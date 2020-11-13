const fs = require('fs');
const path = require('path');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const middleware = require('./middleware');
const uuidv4 = require('uuid/v4');
const moment = require('moment');
const company  = require('../../model/company/company');
const company_user = require('../../model/company/user');

const ERROR_CODE = {
  [-40011]: 'Invalid data',
}
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/controller_passcode_list', middleware.session.authorize());
    router.get('/api/controller_passcode/list', getControllerPasscodeList);
    router.get('/api/controller/device', getControllerDevice);
    router.post('/api/controller/device',postContrrollerDevice);
    router.patch('/api/controller/device',patchControllerDevice);
    router.post('/api/controller_passcode', postControllerPasscode);
    router.put('/api/controller_passcode', putControllerPasscodeList);
    router.get('/api/controller_passcode/single_item/:controller_passcode_id/', getControllerPasscodeSingleItem);
    router.get('/api/controller_access_log', getControllerAccessLog);
    router.post('/api/controller_access_log/range', getControllerAccessLogByRange);
    router.post('/api/controller_access_log/range/company_user', getControllerAccessLogByRangeAndUser);
    router.patch('/api/controller/device/status', patchControllerDeviceStatus);
    router.patch('/api/controller_passcode/status', patchControllerPasscodeStatus);
  }
};

const getControllerPasscodeList = async (req, res) => {
  try {
    let passcode = await model.controller.selectPasscode({
      all: true
    });
    let device = await model.controller.selectDevice({
      all: true,
      fields: ['controller_name', 'controller_device_id']
    });
    let result = {
      passcode, device
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getControllerDevice = async (req, res) => {
  try {
    let device = await model.controller.selectDevice({
      all: true
    })
    let result = {
      device
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const postContrrollerDevice = async (req, res) => {
  try {
    let regData = {
      is_active : 0,
      controller_key: '',
      access_token: '',
      controller_name: '',
      software_version: '',
      encryption_version: 0,
      login_time: 0,
      sync_time: 0,
      info_checksum: '',
      ip_local: '',
      ip_internet: '',
    }
    regData = helper.validateFormData(req.body, regData);

    let {
      controller_name,
      software_version,
      encryption_version,
      ip_local,
      ip_internet
    } = regData;

    let is_active = 1;
    let controller_key = uuidv4().replace(/-/g, '');
    let access_token = controller_key;
    let login_time = moment().unix();
    let sync_time = moment().unix();
    let info_checksum = uuidv4().replace(/-/g, '');

    let insertObj =  {
      controller_name,
      software_version,
      encryption_version,
      ip_local,
      ip_internet,
      is_active,
      access_token,
      controller_key,
      login_time,
      sync_time,
      info_checksum
    };

    let result = await model.controller.insertDevice(insertObj);

    res.apiResponse({
      status: 1, result,
    })

  } catch(error){
    res.apiError(error)
  }
}

const postControllerPasscode = async (req, res) => {
  try {
    let regData = {
      company_door_id: 0,
      passcode: '',
      passcode_type: '',
      passcode_time_start: 0,
      passcode_time_end: 0,
      usage_count: '',
      start_time: '',
      end_time: '',
      start_date: '',
      expire_date: '',
    }
    regData = helper.validateFormData(req.body, regData);

    let {
      company_door_id, start_time, end_time, start_date, expire_date,
      usage_count,passcode_time_end,passcode_time_start
    } = regData;

    // Add the logic for passcode
    let passcode = uuidv4().replace(/-/g, '');

    // Add the logic for passcode
    let passcode_type = 0;

    // Add the logic for signature
    let signature = '';

    let is_active = 1;
    // let start_date = '2020-01-01';
    // let expire_date = '2029-12-31';
    // let start_time = '0000';
    // let end_time = '2359';

    let doorData = await company.selectDoor(company_door_id);
    let controller_device_id = doorData.controller_device_id;
    let door = doorData.door;
    let insertObj = {
      is_active,
      controller_device_id,
      passcode_time_start,
      passcode_time_end,
      passcode,
      passcode_type,
      usage_count,
      start_date,
      expire_date,
      start_time,
      end_time,
      signature,
      door,
    }
    let result = await model.controller.createPasscode(insertObj);

    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchControllerDevice = async (req, res) => {
  try {
    let patchData = {
      controller_name: '' ,
      software_version: '' ,
      encryption_version: 0,
      // ip_local: '',
      // ip_internet: ''
    };
    let {controller_device_id} = req.body
    patchData = helper.validateFormData(req.body, patchData);
    patchData.sync_time = moment().unix();

    let result = await model.controller.updateDevice(controller_device_id, patchData);

    res.apiResponse({
      status:1, result,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const putControllerPasscodeList = async (req, res) => {
  try {
    let regData = {
      controller_passcode_id: 0,
      // controller_device_id: 0,
      company_door_id: 0,
      passcode: '',
      passcode_type: '',
      passcode_time_start: 0,
      passcode_time_end: 0,
      usage_count: '',
      start_date:'',
      expire_date: '',
      // start_time: '',
      // end_time: '',
      // start_date: '',
      // expire_date: '',
    }
    regData = helper.validateFormData(req.body, regData);
    // console.log(s)
    let {
      controller_passcode_id, company_door_id, passcode_time_start, passcode_time_end,
      usage_count,start_date,expire_date
    } = regData;

    let doorData = await company.selectDoor(company_door_id);
    let controller_device_id = doorData.controller_device_id;
    let door = doorData.door;

    let is_active = 1;

    let updateObj = {
      is_active,
      controller_device_id,
      door,
      passcode_time_start,
      passcode_time_end,
      usage_count,
      start_date,
      expire_date,
    }

    let result = await model.controller.updatePasscode(controller_passcode_id, updateObj);

    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getControllerPasscodeSingleItem = async (req, res) => {
  try {
    // let regData = {
    //   controller_passcode_id: 0
    // }
    // regData = helper.validateFormData(req.query, regData);
    // let {
    //   controller_passcode_id
    // } = regData;
    // console.log('Get passcode>>>',controller_passcode_id);
    // let passcode = await model.controller.selectPasscode({
    //   where: {controller_passcode_id}
    // });
    let {
      controller_passcode_id
    } = req.params;

    let passcode = await model.controller.selectPasscode({
        where: {controller_passcode_id}
    });

    res.apiResponse({
      status: 1,
      result: passcode
    });
  } catch (error) {
    res.apiError(error)
  }
}

/* CONTROLLER ACCESS LOG API */
const getControllerAccessLog = async (req, res) => {
  try {
    let access_log = await model.controller.selectAccessLog({
      all: true
    });
    // let device = await model.controller.selectDevice({
    //   all: true
    // });
    let result = access_log;
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getControllerAccessLogByRange = async (req, res) => {
  try {
    let postData = {
      start_date: 0,
      end_date: 0
    }
    postData = helper.validateFormData(req.body, postData);

    let access_log = await model.controller.selectControllerAccessLogByRange(postData.start_date, postData.end_date);
    let result = access_log;

    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getControllerAccessLogByRangeAndUser = async (req, res) => {
  try {
    let {
      start_date,
      end_date,
      company_user_id
    } = req.body;
    let passcodeList = [];

    let qrcodeData = await company.selectQRCode({where:{ company_user_id}, fields:['qrcode_door_passcode']});
    passcodeList =(_.map(qrcodeData, 'qrcode_door_passcode'));
    let userDoorData = await company_user.selectUserDoor({where: {company_user_id}, fields: ['user_door_passcode']});
    for(let len in userDoorData) {
      passcodeList.push(userDoorData[len].user_door_passcode);
    }
    let rfidData = await company_user.selectUserRFID({where: {company_user_id}, fields: ['passcode']});
    for(let len in rfidData) {
      passcodeList.push(rfidData[len].passcode);
    }

    let access_log = await model.controller.selectControllerAccessLogByRangeAndPasscode(start_date, end_date, passcodeList);
    res.apiResponse({
      status: 1, access_log
    })
  } catch (error) {
    res.apiError(error);
  }
}

const patchControllerDeviceStatus = async (req, res) => {
  try {
    let patchData = {
      is_active: 0,
      controller_device_id: 0,
    }
    patchData = helper.validateFormData(req.body, patchData);
    if (patchData.is_active == 1){
      patchData.is_active = 0
    } else {
      patchData.is_active = 1
    }
    let controller_device_id = patchData.controller_device_id;
    // patchData.sync_time = moment().unix();
    await model.controller.updateDevice(controller_device_id, patchData);
    res.apiResponse({
      status: 1,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchControllerPasscodeStatus = async (req, res) => {
  try {
    let patchData = {
      is_active: 0,
      passcode_type: 0,
      controller_passcode_id: 0,
    }

    patchData = helper.validateFormData(req.body,patchData);
    let controller_passcode_id = patchData.controller_passcode_id;
    let passcodeData = await model.controller.selectPasscode(controller_passcode_id);
    let passcode = passcodeData.passcode;
    if (patchData.is_active == 1){
      patchData.is_active = 0
    } else {
      patchData.is_active = 1
    }

    if(patchData.passcode_type == 0) {                    //Passcode_type == 0 (System, example: rfid)
      let data = await model.company.user.selectUserRFID({
        where: {passcode}
      });
      if (data[0]){
        data = data[0];
        let company_user_rfid_id = data.company_user_rfid_id;
        await model.company.user.updateUserRFID(company_user_rfid_id,{is_active: patchData.is_active});
      }
    }

    if(patchData.passcode_type == 1) {                  //Passcode_type == 1 (API, door button of user)
      let data = await model.company.user.selectUserDoor({
        where: {user_door_passcode: passcode}
      });
      if (data[0]){
        data = data[0];
        let company_user_door_id = data.company_user_door_id;
        await model.company.user.updateUserDoor(company_user_door_id,{is_active: patchData.is_active});
      }
    }

    if(patchData.passcode_type == 2) {                  //Passcode_type == 2 (QRCODE, door qrcode)
      let data = await model.company.company.selectQRCode({
        where: {qrcode_door_passcode: passcode}
      });
      if (data[0]){
        data = data[0];
        let company_door_qrcode_id = data.company_door_qrcode_id;
        await model.company.company.updateQRCode(company_door_qrcode_id,{is_active: patchData.is_active});
      }
    }

    await model.controller.updatePasscode(controller_passcode_id,{is_active: patchData.is_active});
    res.apiResponse({
      status: 1,
    })
  } catch (error) {
    res.apiError(error);
  }
}