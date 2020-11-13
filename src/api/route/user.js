const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const uuidv1 = require('uuid/v1');
const util = require('util');
const QRCode = require('qrcode');
const config = require('config');
const fs = require('fs');
const middleware = require('./middleware');
const helper = require('../../lib/helper');
const AppError = require('../../lib/app-error');
const model = require('../../model');
const controllerModel = require('../../model/controller')
const ut = require('@ikoala/node-util');
const multer = require('multer');
// const { ModelBuildPage } = require('twilio/lib/rest/autopilot/v1/assistant/modelBuild');
// const { xor } = require('lodash');
const uuidv4 = require('uuid/v4');
const company_user = require('../../model/company/user');
const company_admin = require('../../model/company/admin');
const company = require('../../model/company/company');
// const axios = require('axios');
const websocketController = require('../../websocket-controller');

// const user_session = require('../../model/user_session');

const debug = require('debug')('app:api/route/user');

const registerAttachPath = config.get('MEDIA').REGISTER;

const SESSION_TOKEN_EXPIRY = config.get('API.SESSION_TOKEN_EXPIRY');
const ACCESS_TOKEN_EXPIRY = config.get('API.ACCESS_TOKEN_EXPIRY');
const API_PASSCODE_EXPIRY_TIME = config.get('API_PASSCODE_EXPIRY_TIME');

const ERROR_CODE = {
  // [-30001]: 'Invalid application key',
  // [-30002]: 'Invalid mobile number',
  // [-30003]: 'Invalid otp',
  // [-30004]: 'Invalid otp',
  [-30001]: 'Invalid username/ pasword or not activated',
  [-30002]: 'Session does not exist. Please login again',
  [-30003]: 'Session Expired. Please login again',
  [-30005]: 'failed to send command to controller, conntroller not connected',
  [-30006]: 'invalid passcode format',
  [-30007]: 'invalid qr code',
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.post('/api/user/userlogin', postCompanyUserLogin);                          //Check user login
  router.get('/api/user/quickaccess', quickAccess);
  // router.get('/controller/getcombineaccessdata', getCombineAccessData)            //Get and combine the doorbutton and qrcode passcode

  router.put('/api/user/getcontrolleripaddress', getControllerIpAddress);

  router.use('/api/user*', middleware.session.authorize());
  router.get('/api/user/getuserprofile', getCompanyUserInfo);                        //Get user info.
  router.get('/api/user/getdoorbutton', getDoorButton);                              //Get the button created by user
  router.put('/api/user/putaccessrecord', putAccessRecord);                          //Create access record to the db
  router.get('/api/user/getdooravailcreate', getDoorButtonCreate);                   //Get Door button which user can create
  router.put('/api/user/putdoorcreate', putDoorCreate);                              //Create the door button to the db
  router.put('/api/user/deletedoorbutton', deleteDoorButton);                        //Delete the door button
  router.get('/api/user/getdoorqrcodecreate', getDoorQRCodeCreate);                  //Get which door that user can create QR code
  router.put('/api/user/putdoorqrcode', putDoorQRCode);                              //Create the door QR code to the db
  router.get('/api/user/getqrcoderecord', getQRCodeRecord);                          //Get the QR Code record that the user created before
  router.put('/api/user/deleteqrcoderecord', deleteQRCodeRecord);                    //Set the is_active field of the QRCode field becomes -1

  // create encrypted passcode
  router.put('/api/user/createencryptedpasscode', createEncryptedPasscode);
  // get ip address by the encrypted_passcode
  // router.put('/api/user/getcontrolleripaddress', getControllerIpAddress);

  router.get('/api/user/passcode/qrcode', getPasscodeQRCode);

  router.get('/api/user/qrcode/detail', getUserQRCodeDetail);

  router.get('/api/user/passcode/detail', getUserPasscodeDetail);
  router.post('/api/user/passcode/open', postUserPasscodeOpen);
};

//Check the login user exist
const postCompanyUserLogin = async (req, res) => {
  try {
    let {
      username,
      password,
      app_key
    } = req.body;

    username = _.toString(username);
    password = _.toString(password);
    app_key = _.toString(app_key);

    const data = await company_user.selectUser({ where: { username, password, is_active: 1 } });

    const data1 = await company_user.selectDevice({ where: { app_key } });

    if (!_.isEmpty(data1) && !_.isEmpty(data)) {
      let company_user_id = data[0].company_user_id;
      let userSession = await model.user_session.createSession(company_user_id, app_key);
      res.apiResponse({
        status: 1,
        data,
        userSession,
      });
      return;
    }

    throw new AppError(-30001);
  } catch (error) {
    res.apiError(error);
  }
};

const quickAccess = async (req, res) => {
  try {
    const {
      session_token,
    } = req.query;

    let company_user_session_data = await company_user.selectSession({ where: { session_token } });

    if (_.isEmpty(company_user_session_data)) {
      throw new AppError(-30002);
    }
    if (moment().unix() > company_user_session_data[0].utime + SESSION_TOKEN_EXPIRY) {
      throw new AppError(-30003);
    }

    let company_user_id = company_user_session_data[0].company_user_id;

    let newSession = await model.user_session.createAccessToken(session_token);

    let data = await company_user.selectUser({where: {company_user_id, is_active: 1}});
    data = data[0];
    if(!_.isEmpty(data)) {
    //Get the company_data
    let company_id = data.company_id //Get the company_data
    const data2 = await company.selectCompany(company_id, { fields: ['company_name'] });

    res.apiResponse({
      status: 1,
      newSession,
      data,
      data2,
    })
    return;
    }
    throw new AppError(-30001);
  } catch (err) {
    res.apiError(err);
  }
};

// Get company_user basic info only login with account and password.
const getCompanyUserInfo = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    const data = await company_user.selectUser(company_user_id);
    // data.photo = path.join(config.get('MEDIA.PRIVATE'), data.photo)

    let company_id = data.company_id //Get the company_data
    const data2 = await company.selectCompany(company_id, { fields: ['company_name'] });

    res.apiResponse({
      status: 1,
      data,
      data2,
    });
  } catch (error) {
    res.apiError(error);
  }
}

//Get the door button that the company_user created
const getDoorButton = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    // without getting the passcode.
    let company_user_door_data = await company_user.selectUserDoor({
      where: { company_user_id, is_active : 1 },
      order: ["company_door_id"],
      fields: [
        'company_door_id',
      ]
    });

    let button_id = []
    for (let len in company_user_door_data) {
      button_id.push(company_user_door_data[len].company_door_id);
    }
    const company_door_data = await company.selectDoor({ where: { company_door_id: button_id }, order: ["company_door_id"] });

    button_id = []
    for (let len in company_door_data) {
      button_id.push(company_door_data[len].company_door_id);
    }

    company_user_door_data = await company_user.selectUserDoor({
      where: { company_user_id, company_door_id: button_id },
      order: ["company_door_id"],
      fields: [
        'company_user_door_id',
        'ctime',
        'utime',
        'company_user_id',
        'company_door_id',
        'door_name',
        'privilege_grant_user',
        'privilege_qrcode',
        'is_active',
        'controller_passcode_id',
        'start_date',
        'expire_date',
        'start_time',
        'end_time',
        'icon',
        'effective_times',
        'create_time',
      ]
    });

    res.apiResponse({
      status: 1,
      company_user_door_data,
      company_door_data,
    })
  } catch (error) {
    res.apiError(error);
  }
}

// Create new access record
const putAccessRecord = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    req.body.access_token = null;
    req.body.company_user_id = company_user_id;

    let accessRecordFormat = {
      ctime: 0,
      utime: 0,
      company_user_id: 0,
      company_door_id: 0,
      first_name: '',
      last_name: '',
      nickname: '',
      photo: '',
      latitude: 0.0,
      longitude: 0.0,
      is_staff: 0,
      entry: 0,
      success: 0,
      fail_reason: '',
      access_time: 0,
    };

    accessRecordFormat = ut.form.validate(req.body, accessRecordFormat);

    await company_user.insertAccessRecord(accessRecordFormat);

    res.apiResponse({
      status: 1,
    });
  }
  catch (error) {
    res.apiError(error);
  }
}

// Get the door that the user can create
const getDoorButtonCreate = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    const company_user_id_data = await company_user.selectUser(company_user_id, { fields: ['company_user_role', 'company_id'] });
    // const company_user_role = company_user_id_data.company_user_role;
    const company_id = company_user_id_data.company_id;

    // const company_user_role_data = await company_user.selectRole({ where: { company_user_role, company_id }, fields: ['company_door_id'] });
    // const company_user_edit_door_data = await company_user.selectUserEditDoor({ where: { company_user_id }, fields: ['company_door_id'] });
    const company_user_door_data = await company_user.selectUserDoor({ where: { company_user_id }, fields: ['company_door_id'] });
    let consistDoor = [];
    // the door that user had created
    for (let len in company_user_door_data) {
      consistDoor.push(company_user_door_data[len].company_door_id);
    }

    let company_door_data = await company.selectDoor({
      where: {
        company_id,
      }
    });

    let totalCanCreateDoor = [];
     for (let len in company_door_data) {
      totalCanCreateDoor.push(company_door_data[len].company_door_id)
    }

    // for (let len in company_user_role_data) {               // The door that the role can create
    //   totalCanCreateDoor.push(company_user_role_data[len].company_door_id)
    // }

    // let canCreate = 1;

    // for (let len in company_user_edit_door_data) {          //Check duplicate
    //   canCreate = 1;
    //   for (let len1 in totalCanCreateDoor) {
    //     if (totalCanCreateDoor[len1] == company_user_edit_door_data[len].company_door_id) {
    //       canCreate = 0;
    //       break;
    //     }
    //   }
    //   if (canCreate == 1)
    //     totalCanCreateDoor.push(company_user_edit_door_data[len].company_door_id);
    // }

    const intersection = totalCanCreateDoor.filter(element => consistDoor.includes(element));// Find out which are the intersection

    let createDoorList = [];
    for (let len in totalCanCreateDoor) {                   //排除intersection 的door options
      canCreate = 1
      for (let len1 in intersection) {
        if (totalCanCreateDoor[len] == intersection[len1]) {
          canCreate = 0;
          break;
        }
      }
      if (canCreate == 1)
        createDoorList.push(totalCanCreateDoor[len]);
    }

    // const company_door_data = await company.selectDoor({ where: { company_door_id: createDoorList, is_active: 1 } })

    company_door_data = await company.selectDoor({
      where: {
        company_door_id: createDoorList,
      }
    });

    res.apiResponse({
      status: 1,
      company_door_data,
    })
  }
  catch (error) {
    res.apiError(error);
  }
}

// Create the door button and put the record to the server side
const putDoorCreate = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    req.body.access_token = null;
    req.body.company_user_id = company_user_id;

    let doorCreateFormat = {
      ctime: 0,
      utime: 0,
      company_user_id: 0,
      company_door_id: 0,
      door_name: '',
      privilege_grant_user: 0,
      privilege_qrcode: 0,
      // user_door_passcode: '',
      start_date: '',
      expire_date: '',
      start_time: '',
      end_time: '',
      icon: '',
      create_time: 0,
      is_active: 0,
      effective_times: 0,
    }
    doorCreateFormat = ut.form.validate(req.body, doorCreateFormat);

    const {
      company_door_id,
      start_date,
      expire_date,
      start_time,
      end_time,
      is_active,
    } = doorCreateFormat;

    const [companyDoor] = await company.selectDoor({
      fields: ['controller_device_id', 'door'],
      where: {
        company_door_id,
      },
    });

    const {
      controller_device_id,
      door
    } = companyDoor;

    let passcodeData = {
      controller_device_id,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: 1,
      passcode_time_start: 0,
      passcode_time_end: moment().year(2038).unix(),
      start_date,
      expire_date,
      start_time,
      end_time,
      usage_count: 999999,
      is_active: 1,
      door,
      signature: '',
    };
    let passcodeRc = await controllerModel.createPasscode(passcodeData);

    doorCreateFormat.controller_passcode_id = passcodeRc.controller_passcode_id;
    doorCreateFormat.user_door_passcode = passcodeData.passcode;

    await company_user.insertUserDoor(doorCreateFormat);
    const company_user_door_data = await company_user.selectUserDoor({
      where: {
        company_door_id: doorCreateFormat.company_door_id,
      }
    });

    res.apiResponse({
      status: 1,
      company_user_door_data,
    });
  }
  catch (error) {
    res.apiError(error);
  }
}

const deleteDoorButton = async (req, res) => {
  try {
    let {
      company_door_id
    } = req.body;

    const company_user_id = req.companyUserAccount.company_user_id;

    company_door_id = _.toInteger(company_door_id);

    let userDoorData = await company_user.selectUserDoor({where: {company_user_id, company_door_id}});
    let {user_door_passcode} = userDoorData[0];
    let passcodeData = await controllerModel.selectPasscode({where: {passcode: user_door_passcode}, fields: ['controller_passcode_id']});
    let {controller_passcode_id} = passcodeData[0];
    // Update is_active of controller_passcode to 0
    await controllerModel.updatePasscode(controller_passcode_id, {is_active: 0});
    await company_user.deleteUserDoor(company_user_id, company_door_id);
    res.apiResponse({
      status: 1,
    })
  }
  catch (error) {
    res.apiResponse(error);
  }
}

const getDoorQRCodeCreate = async (req, res) => {          //Check which door can create Door QRCode
  try {
    // let {
    //   // company_user_id,
    //   access_token
    // } = req.query;

    const company_user_id = req.companyUserAccount.company_user_id;

    // const company_user_id_data = await company_user.selectUser(company_user_id);

    // const company_user_role = company_user_id_data.company_user_role;
    // const company_id = company_user_id_data.company_id;

    // const company_user_role_data = await company_user.selectRole({ where: { company_user_role, company_id }, fields: ['company_door_id'] });

    // const company_user_edit_door_data = await company_user.selectUserEditDoor({ where: { company_user_id }, fields: ['company_door_id'] });
    // let totalCanCreateDoor = []
    // for (let len in company_user_role_data)
    //   totalCanCreateDoor.push(company_user_role_data[len].company_door_id);

    // let canCreate = 1
    // for (let len in company_user_edit_door_data) {
    //   canCreate = 1
    //   for (let len_role in company_user_role_data) {
    //     if (totalCanCreateDoor[len_role] == company_user_edit_door_data[len])
    //       canCreate = 0
    //   }
    //   if (canCreate == 1)
    //     totalCanCreateDoor.push(company_user_edit_door_data[len].company_door_id)
    // }

    // totalCanCreateDoor = _.uniq(totalCanCreateDoor);

    let userDoorArr = await company_user.selectUserDoor({
      fields: ['company_door_id'],
      where: {
        company_user_id,
      },
    });

    let company_door_data = await company.selectDoor({
      where: {
        // company_door_id: totalCanCreateDoor,
        company_door_id: _.map(userDoorArr, 'company_door_id'),
      },
    });

    res.apiResponse({
      status: 1,
      company_door_data,
    });
  } catch (error) {
    res.apiError(error);
  }
}

const putDoorQRCode = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    // req.body.access_token = null;
    // req.body.company_user_id = company_user_id;

    let CreateQRCodeFormat = {
      // ctime: 0,
      // utime: 0,
      company_door_id: 0,
      // company_user_id: 0,
      first_name: '',
      last_name: '',
      gender: '',
      usage_count: 0,
      // qrcode_door_passcode: '',
      start_date: 0,
      expire_date: 0,
      start_time: '',
      end_time: '',
      // company_door_qrcode: '',
      identity: '',
      remark: '',
      // is_active: 0,
      // create_time: moment().unix(),
    };

    req.body.start_time = moment.unix(req.body.start_time).format('HHmm');
    req.body.end_time = moment.unix(req.body.end_time).format('HHmm');

    CreateQRCodeFormat = ut.form.validate(req.body, CreateQRCodeFormat);

    CreateQRCodeFormat.ctime = moment().unix();
    CreateQRCodeFormat.utime = moment().unix();
    CreateQRCodeFormat.create_time = moment().unix();
    CreateQRCodeFormat.is_active = 1;
    CreateQRCodeFormat.company_user_id = company_user_id;

    let {
      company_door_id,
      start_date,
      expire_date,
      start_time,
      end_time,
      usage_count,
      // is_active,
    } = CreateQRCodeFormat;

    const [companyDoor] = await company.selectDoor({
      fields: ['controller_device_id', 'door'],
      where: {
        company_door_id,
      },
    });

    // TODO :: check user company id

    const {
      controller_device_id,
      door
    } = companyDoor;

    let passcodeData = {
      controller_device_id,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: controllerModel.PASSCODE_TYPE.QRCODE,
      passcode_time_start: start_date,
      passcode_time_end: expire_date,
      start_date: moment.unix(start_date).format('YYYY-MM-DD'),
      expire_date: moment.unix(expire_date).format('YYYY-MM-DD'),
      start_time,
      end_time,
      usage_count,
      is_active: 1,
      door,
      signature: '',
    };
    let passcodeRc = await controllerModel.createPasscode(passcodeData);

    CreateQRCodeFormat.controller_passcode_id = passcodeRc.controller_passcode_id;
    CreateQRCodeFormat.qrcode_door_passcode = passcodeData.passcode;
    CreateQRCodeFormat.company_door_qrcode = ``;
    CreateQRCodeFormat.start_date = passcodeData.start_date;
    CreateQRCodeFormat.expire_date = passcodeData.expire_date;

    await company.insertQRCode(CreateQRCodeFormat);

    res.apiResponse({
      status: 1,
    });
  } catch (error) {
    res.apiError(error);
  }
}

const getQRCodeRecord = async (req, res) => {
  try {
    const company_user_id = req.companyUserAccount.company_user_id;

    let company_door_qrcode_data = await company.selectQRCode({ where: { company_user_id, is_active: 1 }, limit: 20 , order: ['company_door_qrcode_id', 'DESC']});
    let {company_id}= await company_user.selectUser(company_user_id, {
      fields: ['company_id'],
    });
    let company_door_data = await company.selectDoor({where:{company_id},fields: ['company_door_id', 'door_name']});
    res.apiResponse({
      status: 1,
      company_door_qrcode_data,
      company_door_data,
    })
  }
  catch (error) {
    res.apiError(error)
  }
}



const getCombineAccessData = async (req, res) => {
  try {
    let company_user_door_data = await company_user.selectUserDoor();
    let company_door_qrcode_data = await company.selectQRCode();

    let passcodeData = []
    for (let len in company_user_door_data) {
      // passcodeData.push
    }

    for (let len in company_door_qrcode_data) {

    }

    for (let len in passcodeData) {

    }

  }
  catch (error) {
    res.apiError(error)
  }
}

const getUserQRCodeDetail = async (req, res) => {
  try {
    const {
      company_door_qrcode_id,
    } = req.query;

    const userDoorQRCodeRecord = await company.selectQRCode(company_door_qrcode_id);

    const {
      controller_passcode_id,
    } = userDoorQRCodeRecord;

    let controllerPasscodeRecord = await controllerModel.selectPasscode(controller_passcode_id);

    res.apiResponse({

    });
  } catch (err) {
    res.apiError(err);
  }
};

const getPasscodeQRCode = async (req, res) => {
  try {
    const passcode = _.toString(req.query.passcode);

    const [controllerPasscode] = await controllerModel.selectPasscode({
      where: {
        passcode,
      },
    });

    // const filename = `${passcode}.png`;
    // const filepath = path.join(config.get('MEDIA.QRCODE'), filename);

    let qrcodeData = await controllerModel.createQRCode(controllerPasscode);

    res.sendFile(qrcodeData.filepath);
  } catch (err) {
    res.apiError(err);
  }
}

/**
 *
 * @param {*} req
 * @param {*} res
 */
const createEncryptedPasscode = async (req, res) => {
  try {
    const controller_passcode_id = _.toInteger(req.body.controller_passcode_id);

    // TODO :: Security Problem, should check user permission

    const encrypted_passcode = await controllerModel.createEncryptedPasscodeById(controller_passcode_id);
    const passcode_data = await controllerModel.selectPasscode(controller_passcode_id, { fields: ['controller_device_id'] });
    const controller_device_data = await controllerModel.selectDevice(passcode_data.controller_device_id, { fields: ['ip_local'] });
    const ip_local = controller_device_data.ip_local;

    // const expire_time = moment().unix() + API_PASSCODE_EXPIRY_TIME;
    // const company_door_id = req.body.company_door_id;

    res.apiResponse({
      // company_door_id,
      // expire_time,
      encrypted_passcode,
      // controller_passcode_id,
      ip_local,
    });
  } catch (err) {
    res.apiError(err);
  }
}

// The function used to handle the encrypted_passcode.
const getControllerIpAddress = async (req, res) => {
  try {
    const controller_passcode_id = _.toInteger(req.body.controller_passcode_id);
    const encrypted_passcode = _.toString(req.body.encrypted_passcode);

    // const decryptedPasscode = await controllerModel.decryptPasscode(encrypted_passcode);
    // const passcode = decryptedPasscode.passcode;

    const controllerPasscode = await controllerModel.selectPasscode(controller_passcode_id, {
      fields: ['controller_device_id'],
    });

    const {
      controller_device_id,
    } = controllerPasscode;

    // const controller_device_id = controller_passcode_data[0].controller_device_id;      //Because passcode not id, therefore array.

    const controllerDevice = await controllerModel.selectDevice(controller_device_id);

    const {
      access_token,
    } = controllerDevice;

    const sendCommandResult = websocketController.sendCommandToController(access_token, {
      action: 'open_door',
      data: {
        passcode: encrypted_passcode,
      },
    })

    if (!sendCommandResult) {
      throw new AppError(-30005);
    }

    res.apiResponse({
      status: 1,
    });
  } catch (err) {
    res.apiError(err);
  }
}

const getUserPasscodeDetail = async (req, res) => {
  try {
    const {
      encryptedPasscodeData
    } = req.query;

    debug(`encryptedPasscodeData >> `, encryptedPasscodeData);

    const isValidEncryptedPasscode = controllerModel.validateEncryptedPasscode(encryptedPasscodeData);

    if (!isValidEncryptedPasscode) {
      throw new AppError(-30006);
    }

    const decryptedPasscode = controllerModel.decryptPasscode(encryptedPasscodeData);

    const {
      passcode,
    } = decryptedPasscode;

    let [controllerPasscode] = await controllerModel.selectPasscode({
      where: {
        passcode,
      }
    });

    if (!controllerPasscode) {
      throw new AppError(-30007);
    }

    const {
      controller_passcode_id,
    } = controllerPasscode;

    const [companyUserQRCode] = await company.selectQRCode({
      where: {
        controller_passcode_id,
      }
    });

    if (!companyUserQRCode) {
      throw new AppError(-30007);
    }
    let company_user_id = companyUserQRCode.company_user_id;
    let companyUser = null;
    if(company_user_id > 0) {
      companyUser = await company_user.selectUser(company_user_id);
    }
    res.apiResponse({
      ...companyUserQRCode,
      ...controllerPasscode,
      ...{companyUser},
    });
  } catch (err) {
    res.apiError(err);
  }
};

const postUserPasscodeOpen = async (req, res) => {
  try {
    const encryptedPasscodeData = _.toString(req.body.encryptedPasscodeData);

    debug(`encryptedPasscodeData >> `, encryptedPasscodeData);

    const isValidEncryptedPasscode = controllerModel.validateEncryptedPasscode(encryptedPasscodeData);

    if (!isValidEncryptedPasscode) {
      throw new AppError(-30006);
    }

    const decryptedPasscode = controllerModel.decryptPasscode(encryptedPasscodeData);

    const {
      passcode,
    } = decryptedPasscode;

    let [controllerPasscode] = await controllerModel.selectPasscode({
      where: {
        passcode,
      }
    });

    const {
      controller_device_id,
    } = controllerPasscode;

    const controllerDevice = await controllerModel.selectDevice(controller_device_id);

    const {
      access_token,
    } = controllerDevice;

    const sendCommandResult = websocketController.sendCommandToController(access_token, {
      action: 'open_door',
      data: {
        passcode: encryptedPasscodeData,
      },
    });

    if (!sendCommandResult) {
      throw new AppError(-30005);
    }

    res.apiResponse({
      status: 1,
    });
  } catch (err) {
    res.apiError(err);
  }
}

const deleteQRCodeRecord = async (req, res) => {
  try {
    let {
      company_door_qrcode_id
    } = req.body;

    let postObj = {
      is_active: 0
    };
    let {controller_passcode_id} = await company.selectQRCode(company_door_qrcode_id);
    await company.updateQRCode(company_door_qrcode_id, postObj);
    await controllerModel.updatePasscode(controller_passcode_id, postObj);
    res.apiResponse({
      status: 1,
    });
  } catch (err) {
    res.apiError(err);
  }
}
