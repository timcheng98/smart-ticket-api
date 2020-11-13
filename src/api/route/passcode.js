const url = require('url');
const path = require('path');
const _ = require('lodash');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const QRCode = require('qrcode');
const config = require('config');
const packageData = require('../../../package.json');
const middleware = require('./middleware');
const CryptoHelper = require('../../lib/crypto-helper');
const controllerModel = require('../../model/controller');
const company_user = require('../../model/company/user');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const ut = require('@ikoala/node-util');
const company  = require('../../model/company/company');

const debug = require('debug')('app:api/route/passcode');

const ERROR_CODE = {
  [-10001]: 'Create user data field incomplete.',
  [-10002]: 'Cannot create other company user rfid record',
  [-10003]: 'Create user rfid field imcomplete',
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.get(
    '/api/passcode/qrcode',
    middleware.session.authorizeAPIToken(),
    getPasscodeQRCode
  );
  router.put(
    '/api/passcode',
    middleware.session.authorizeAPIToken(),
    putPasscode,
  );
  router.post(
    '/api/passcode/post/company/user',
    middleware.session.authorizeAPIToken(),
    postCompanyUserByAPI,
  )
  router.post(
    '/api/passcode/post/company/user/rfid',
    middleware.session.authorizeAPIToken(),
    postCompanyUserRfidByAPI,
  )
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
    // res.apiError(err);
    console.error(err);
    res.sendStatus(500);
  }
}

const putPasscode = async (req, res) => {
  try {
    // const {
    //   controllerSession,
    // } = req;
    // const {
    //   controller_device_id,
    //   controller_name,
    //   access_token,
    // } = controllerSession;

    let {
      access_token,
      ts,
      signature,
      passcode_time_start,
      passcode_time_end,
      usage_count,
    } = req.body;

    passcode_time_start = passcode_time_start || 0;
    passcode_time_end = passcode_time_end || moment().year(2038).unix();
    usage_count = usage_count || 999999;

    let postData = {
      controller_device_id: 3,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: 0,
      passcode_time_start,
      passcode_time_end,
      start_date: moment.unix(passcode_time_start).format('YYYY-MM-DD'),
      expire_date: moment.unix(passcode_time_end).format('YYYY-MM-DD'),
      start_time: '0000',
      end_time: '2359',
      usage_count,
      is_active: 1,
      signature: '',
    };

    const passcodeRc = await controllerModel.createPasscode(postData);

    const {
      passcode,
    } = passcodeRc;

    const respData = {
      passcode: {
        qrcode_url: url.resolve(config.get('API.ORIGIN'), `/api/passcode/qrcode?passcode=${passcode}`),
      },
    };
    res.apiResponse(respData);
  } catch (err) {
    res.apiError(err);
  }
};

const postCompanyUserByAPI = async (req, res) => {
  try {
    let postData = {
      username: '',
      password:'',
      email:'',
      mobile:'',
      first_name:'',
      last_name:'',
      nickname:'',
    }

    postData = helper.validateFormData(req.body, postData);
    _.each(postData, function (value, key) {
      if (value == '') {
        throw new AppError(-10001);
      }
    });

    postData.ref_id = req.body.ref_id;
    postData.company_id = req.companyAccount.company_id;
    postData.gender = '-';
    postData.qr_code = '-';
    postData.photo = '-';

    let fullPostData = {
      company_admin_id: 0,
      company_id: 0,
      username: '',
      password:'',
      email:'',
      mobile:'',
      status: 1,
      is_active: 1,
      first_name:'',
      last_name:'',
      nickname:'',
      gender: '',
      photo: '',
      qr_code: '',
      is_verified_email: 0,
      is_verified_mobile: 0,
      is_admin: 0,
      privilege_scan_qrcode: 0,
      company_user_role: '',
      create_time: moment().unix(),
      ref_id: '',
    };
    postData = helper.validateFormData(postData, fullPostData);
    let result = await company_user.insertUser(postData);
    res.apiResponse({
      status: 1, result
    })
  } catch (err) {
    res.apiError(err);
  }
}

const postCompanyUserRfidByAPI = async (req, res) => {
  try {
    let postRFIDData = {
      company_user_id: 0,
      company_door_id: 0,
      tag_id: '',
    }

    postRFIDData = helper.validateFormData(req.body, postRFIDData);
    _.each(postRFIDData, function (value, key) {                    //Check Empty
      if (value == '' || value == 0)
        throw new AppError(-10003);
    });

    let company_user_id = postRFIDData.company_user_id;
    let company_door_id = postRFIDData.company_door_id;

    let userList = await company_user.selectUser(company_user_id);  // Maybe email or not (?)
    if (_.isEmpty(userList) ||userList.company_id != req.companyAccount.company_id) {     //Checking same company create user
        throw new AppError(-10002);
    };
    let [doorList] = await company.selectDoor({where:{company_door_id}});
    if (_.isEmpty(doorList) || doorList.company_id != req.companyAccount.company_id) {
      throw new AppError(-10002);
  };

    let fullPasscodeData = {
      controller_device_id: doorList.controller_device_id,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: 0,
      passcode_time_start: 0,
      passcode_time_end: 2147472000,
      start_date: '-',
      expire_date: '2038-01-19',
      start_time: '0000',
      end_time: '2359',
      usage_count: 999999999,
      is_active: 1,
      door: doorList.door,
      tag_id: postRFIDData.tag_id,
      signature: '',
    };

    let postPasscodeResult = await controllerModel.createPasscode(fullPasscodeData);

    postRFIDData = {
      company_user_id: postRFIDData.company_user_id,
      company_door_id: postRFIDData.company_door_id,
      tag_id: postPasscodeResult.tag_id,
      is_active: 1,
      passcode: postPasscodeResult.passcode,
    }

    let fullPostRFIDData = {
      company_user_id: 0,
      company_door_id: 0,
      tag_id: '',
      is_active: 0,
      passcode: '',
    };

    postRFIDData = helper.validateFormData(postRFIDData, fullPostRFIDData);
    let result = await company_user.insertUserRFID(postRFIDData);

    res.apiResponse({
      status: 1, result
    });

  } catch (err) {
    res.apiError(err);
  }
}
