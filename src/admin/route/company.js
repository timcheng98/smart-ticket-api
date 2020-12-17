const fs = require('fs');
const path = require('path');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const uuidv4 = require('uuid/v4');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const middleware = require('./middleware');
const moment = require('moment');
const company_user = require('../../model/company/user');
const company = require('../../model/company/company');
const company_admin = require('../../model/company/admin');
const kyc = require('../../model/company/kyc');
const controllerModel = require('../../model/controller');
const controller = require('./controller');
const admin = require('../../model/company/admin');


const ERROR_CODE = {
  [-60001]: 'Company user RFID exists',
  [-60002]: 'Exceed maximum company admin account creation',
  [-60003]: 'RFID record cannot find, it maybe deleted or removed by admin',
}
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    /* Authorize */
    router.use('/api/company', middleware.session.authorize());

    /* Company Route */
    // router.get('/api/company/list', getCompanyList);
    // router.post('/api/company', postCompany);
    // router.patch('/api/company', patchCompany);
    // router.patch('/api/company/status', patchCompnayStatus);

    /* Company Admin */
    // router.get('/api/company/admin/list', getCompanyAdminList);
    // router.get('/api/company/admin/:company_id', getCompanyAdminByCompanyId);
    // router.patch('/api/company/admin/pw', patchCompanyAdminPassword);
    // router.post('/api/post/company/admin', postCompanyAdmin);
    // router.patch('/api/patch/company/admin', patchCompanyAdmin);
    // router.patch('/api/patch/company/admin/status', patchCompanyAdminStatus);

    /* Company Admin KYC */
    router.get('/api/company/admin/kyc', getKycList);
    router.get('/api/company/admin/kyc/single', getKycById);
    router.post('/api/company/admin/kyc', postKyc);
    router.patch('/api/company/admin/kyc', patchKyc);
    router.patch('/api/company/admin/kyc/single', patchKycById);
    // router.patch('/api/patch/company/admin/status', patchCompanyAdminStatus);
    
    /* User Route */
    // router.get('/api/company/user', getCompanyUserList);
    // router.get('/api/company/user/by/:company_id', getCompanyUserByCompanyId);
    // router.get('/api/company/user/by/user/:company_user_id', getCompanyUserByCompanyUserId);
    // router.post('/api/company/user', postCompanyUser);
    // router.patch('/api/company/user', patchCompanyUser);
    // router.patch('/api/company/user/pw',patchCompanyUserPassword);
    // router.patch('/api/company/user/status', patchCompanyUserStatus);

    /* User Role Route */
    // router.get('/api/company/user_role', getCompanyUserRole);
    // router.get('/api/company/user_role/:company_id', getCompanyUserRoleById);
    // router.post('/api/company/user_role', postCompanyUserRole);
    // router.patch('/api/company/user_role', patchCompanyUserRole);
  }
};

const getKycList = async (req, res) => {
  try {
    let result = await kyc.selectKyc({
      all: true
    });
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
} 

const getKycById = async (req, res) => {
  try {
    let result = await kyc.selectKyc(req.user.admin_id);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
} 

const postKyc = async (req, res) => {
  try {
    let postData = {
      admin_id: req.user.admin_id,
      check_by: 0,
      is_company_doc_verified: 0,
      status: 0, //pending
      company_size: '',
      company_code: '',
      company_doc: '',
      name: '',
      description: '',
      owner: '',
      address: '',
      industry: '',
      found_date: moment().unix(),
    }
 
    postData = helper.validateFormData(req.body, postData);
    let postObj = postData;
    postObj.reference_no = `${moment().format('YYMMDD')}-${uuidv4().split('-')[1]}`
    let result = await kyc.insertKyc(postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchKyc = async (req, res) => {
  try {
    const postData = { status: 0 };

    _.each(_.pick(req.body, [
      'company_doc','description', 'owner', 'address', 'name', 'company_code', 'company_doc', 'company_size', 'industry', 'reject_reason'
    ]), (val, key) => {
      postData[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'status', 'is_company_doc_verified'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });

    _.each(_.pick(req.body, [
      'found_date'
    ]), (val, key) => {
      postData[key] = _.toInteger(moment(val).unix());
    });
 
    let postObj = postData;
    let result = await kyc.updateKyc(req.user.admin_id, postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchKycById = async (req, res) => {
  try {
    const postData = {};

    _.each(_.pick(req.body, [
      'reject_reason'
    ]), (val, key) => {
      postData[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'is_company_doc_verified', 'admin_id', 'status'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });
 
    let postObj = postData;
    let result = await kyc.updateKyc(postObj.admin_id, postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}



const getCompanyList = async (req, res) => {
  try {
    let result = await company.selectCompany({
      all: true
    });
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const postCompany = async (req, res) => {
  try {
    let postData = {
      company_name: '',
      nickname: '',
      password: '',
      email: '',
      mobile: '',
      company_key: '',
      admin_account_max: '',
      create_time: moment().unix()
    }
    // let {user_id} = req.user;
    postData = helper.validateFormData(req.body, postData);
    let {
      company_name,
      nickname,
      password,
      email,
      mobile,
      company_key,
      admin_account_max,
      create_time
    } = postData;
    let postObj = {
      company_name,
      nickname,
      password,
      email,
      mobile,
      company_key,
      admin_account_max,
      create_time,
      admin_id: 1,
      is_active: 1
    }
    let result = await company.insertCompany(postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompany = async (req, res) => {
  try {
    let postData = {
      company_id: 0,
      company_name: '',
      nickname: '',
      password: '',
      email: '',
      mobile: '',
      company_key: '',
      admin_account_max: ''
    }
    // let {user_id} = req.user;
    postData = helper.validateFormData(req.body, postData);
    let {
      company_id,
      company_name,
      nickname,
      password,
      email,
      mobile,
      company_key,
      admin_account_max,
    } = postData;
    let postObj = {
      company_name,
      nickname,
      password,
      email,
      mobile,
      company_key,
      admin_account_max,
      is_active: 1
    }
    let result = await company.updateCompany(company_id, postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompnayStatus = async (req, res) => {
  try {
    if (req.body.is_active == 1)
      req.body.is_active = 0;
    else
      req.body.is_active = 1;

    let {
      company_id, is_active
    } = req.body;

    let result = await company_user.selectUser({where: {company_id}});
    let company_user_id =  _.each((result), function(value, key){
      result[key] = value.company_user_id;
    });
    if(result[0])
      await company_user.updateUserStatus(company_user_id, is_active);

    result = await admin.selectAdmin({where: {company_id}});
    let company_admin_id = _.each((result), function(value, key){
      result[key] = value.company_admin_id;
    });
    if(result[0])
      await admin.updateAdminStatus(company_admin_id, is_active);
    await company.updateCompany(company_id,{is_active});

    res.apiResponse({
      status: 1
    })

  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserList = async (req, res) => {
  try {
    let companyUsers = await company_user.selectUser({
      all: true
    });
    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    })
    let result = {
      companyUsers, companies
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyAdminList = async (req, res) => {
  try {
    let companyAdmin = await company_admin.selectAdmin({
      all: true
    });
    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    });
    let result = {
      companyAdmin, companies
    };
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyAdminByCompanyId = async (req, res) => {
  try {
    let {
      company_id
    } = req.params;
    let companyAdmin = await company_admin.selectAdmin({
      where: {company_id}
    });
    let [companies] = await company.selectCompany({
      where: {company_id},
      fields: ['company_id', 'company_name']
    });
    let result = {
      companyAdmin, companies
    };
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyAdminPassword = async (req, res) => {
  try {
    let patchData = {
      email : '',
      company_admin_id: '',
      password: ''
    };
    patchData = helper.validateFormData(req.body, patchData);
    let {
      company_admin_id,
      email,
      password,
    } = patchData;
    let postObj = {
      mobile: password,
    }
    let result = await admin.updateAdmin(company_admin_id, postObj);
    res.apiResponse({
      status: 1,
      result
    })
  } catch (error) {
    res.apiError(error);
  }
}

const postCompanyAdmin = async (req, res) => {
  try {
    let {
      company_id,
    } = req.body;
    let companyAdminData = await company_admin.selectAdmin({where: {company_id}});
    let companyData = await company.selectCompany(company_id);
    console.log('Length of company',companyAdminData.length);
    console.log('Max',companyData.admin_account_max);
    if (companyAdminData.length >= companyData.admin_account_max) {
        throw new AppError(-60002);
    }

    let postData = {
      company_id: 0,
      first_name: '',
      last_name: '',
      nickname: '',
      gender: 'M',
      photo: '',
      email: '',
      mobile: '',
      is_verified_email: 0,
      is_verified_mobile: 0,
      is_active: 0,
      is_admin: 0,
      create_time: 0,
    }
    postData = helper.validateFormData(req.body, postData);

    //Init company_admin data for future modification
    postData.is_verified_email = 1;
    postData.is_verified_mobile = 1;
    postData.is_active = 1;
    postData.is_admin = 1;
    postData.create_time = moment().unix();

    await company_admin.insertAdmin(postData);
    res.apiResponse({
      status: 1
    })

  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyAdmin = async (req, res) => {
  try {
    let patchData ={
      company_id: 0,
      first_name: '',
      last_name: '',
      nickname: '',
      email: '',
      mobile: '',
    }
    patchData = helper.validateFormData(req.body, patchData);
    company_admin_id = req.body.company_admin_id
    company_admin.updateAdmin(company_admin_id, patchData);

    res.apiResponse({
      status: 1,
    })

  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyAdminStatus = async (req, res) => {
  try {
    let patchData = {
      company_admin_id: 0,
      is_active: 0,
    }
    patchData = helper.validateFormData(req.body, patchData);
    if(patchData.is_active == 1) {
      patchData.is_active = 0
    } else {
      patchData.is_active = 1
    };
    let result = await company_admin.updateAdmin(patchData.company_admin_id, {is_active: patchData.is_active});
    res.apiResponse({
      status: 1,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserByCompanyId = async (req, res) => {
  try {
    let {
      company_id
    } = req.params;

    companyUsers = await company_user.selectUser({
      where: {company_id}
    });
    let companies = await company.selectCompany({
      where: {company_id},
      fields: ['company_id', 'company_name']
    })
    let result = {
      companyUsers, companies
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error);
  }
}

const getCompanyUserByCompanyUserId = async (req, res) => {
  try {
    let {
      company_user_id
    } = req.params;

    companyUser = await company_user.selectUser(company_user_id,{
      fields:['first_name', 'last_name', 'company_user_id']
    });
    res.apiResponse({
      status:1, companyUser,
    })
  } catch (error) {
    res.apiError(error);
  }
}

const postCompanyUser = async (req, res) => {
  try {
    let postData = {
      company_admin_id: 0,
      username: '',
      password: '',
      first_name: '',
      last_name: '',
      nickname: '',
      gender: '',
      email: '',
      mobile: '',
      qr_code: '',
      photo: '',
      company_user_role: '',
      company_id: 0,
      privilege_scan_qrcode: 0,
      is_admin: 0,
      ref_id: '',
      create_time: moment().unix()
    }
    // let {user_id} = req.user;
    postData = helper.validateFormData(req.body, postData);
    let {
      company_admin_id,
      password,
      username,
      first_name,
      last_name,
      nickname,
      gender,
      email,
      mobile,
      qr_code,
      photo,
      create_time,
      company_user_role,
      is_admin,
      company_id,
      privilege_scan_qrcode,
      ref_id,
    } = postData;
    password = uuidv4().replace(/-/g, '');
    password = password.substring(0,8);
    if (company_admin_id == null) {
      company_admin_id = 0;
    }
    let postObj = {
      company_id,
      company_admin_id,
      password,
      username,
      first_name,
      last_name,
      nickname,
      gender,
      email,
      mobile,
      create_time,
      privilege_scan_qrcode: 1,
      is_admin: 0,
      is_verified_mobile: 0,
      is_verified_email: 0,
      is_active: 1,
      status: 1,
      photo,
      qr_code,
      ref_id,
      company_user_role,
    }
    let result = await company_user.insertUser(postObj);
    res.apiResponse({
      status: 1, result,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const postCompanyDoor = async (req, res) => {
  try {
    let postData = {
      controller_device_id: 0,
      door_name: '',
      company_id: 0,
      photo: '',
      latitude: 0,
      longitude: 0,
      status: 1,
      is_active: 1,
      door: 0,
      door_ref:'',
      description: '',
      addr_area: '',
      addr_district: '',
      addr_region: '',
      address: '',
      create_time: moment().unix()
    }
    // let {user_id} = req.user;
    postData = helper.validateFormData(req.body, postData);
    let {
      controller_device_id,
      door_name,
      company_id,
      photo,
      latitude,
      longitude,
      status,
      is_active,
      door,
      door_ref,
      description,
      addr_area,
      addr_district,
      addr_region,
      address,
      create_time
    } = postData;
    let postObj = {
      controller_device_id,
      door_name,
      company_id,
      photo,
      latitude,
      longitude,
      status,
      is_active,
      door,
      door_ref,
      description,
      addr_area,
      addr_district,
      addr_region,
      address,
      create_time,
      last_sync_time: moment().unix()
    }
    let result = await company.insertDoor(postObj);
    res.apiResponse({
      status: 1, result,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyDoor = async (req, res) => {
  try {
    let patchData = {
      company_door_id: 0,
      controller_device_id: 0,
      door_name: '',
      company_id: 0,
      latitude: 0,
      longitude: 0,
      door: 0,
      door_ref: '',
      description: '',
      addr_area: '',
      addr_district: '',
      addr_region: '',
      address: ''
    }

    patchData = helper.validateFormData(req.body, patchData);
    let {
      company_door_id,
      controller_device_id,
      door_name,
      company_id,
      latitude,
      longitude,
      door,
      door_ref,
      description,
      addr_area,
      addr_district,
      addr_region,
      address,
    } = patchData;
    let patchObj = {
      company_door_id,
      controller_device_id,
      door_name,
      company_id,
      latitude,
      longitude,
      door,
      door_ref,
      description,
      addr_area,
      addr_district,
      addr_region,
      address
    }
    let result = await company.updateDoor(company_door_id, patchObj);
    res.apiResponse({
      status: 1, result,
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyDoorStatus = async (req, res) => {
  try {
    let patchData = {
      company_door_id: 0,
      is_active: 0
    }
    patchData = helper.validateFormData(req.body, patchData);
    let { company_door_id, is_active } = patchData;

    if (is_active === 1) {
      is_active = 0;
    } else {
      is_active = 1;
    }

    let result = await company.updateDoor(company_door_id, { is_active });
    await company_user.updateUserDoorStatus(company_door_id, is_active);
    await company_user.updateUserDoorQRCodeStatus(company_door_id, is_active);
    res.apiResponse({
      status: 1, result
    });
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyUser = async (req, res) => {
  try {
    let patchData = {
      company_user_id: 0,
      // company_admin_id: 0,
      username: '',
      // password: '',
      first_name: '',
      last_name: '',
      nickname: '',
      // gender: '',
      email: '',
      mobile: '',
      ref_id: '',
      // company_user_role: '',
      // privilege_scan_qrcode: 0,
      // is_admin: 0,
      // create_time: moment().unix()
    }
    // let {user_id} = req.user;
    patchData = helper.validateFormData(req.body, patchData);
    let {
      company_user_id,
      // company_admin_id,
      // password,
      username,
      first_name,
      last_name,
      nickname,
      // gender,
      email,
      mobile,
      ref_id,
      // create_time,
      // company_user_role,
      // is_admin,
      // privilege_scan_qrcode,
    } = patchData;
    let postObj = {
      // company_admin_id,
      // password,
      username,
      first_name,
      last_name,
      nickname,
      // gender,
      email,
      mobile,
      ref_id,
      // create_time,
      // privilege_scan_qrcode,
      // is_admin,
      // is_verified_mobile: 0,
      // is_verified_email: 0,
      // is_active: 1,
      // status: 1,
      // company_user_role,
    }
    let result = await company_user.updateUser(company_user_id, postObj);
    res.apiResponse({
      status: 1, result,
    })
  } catch (error) {
    res.apiError(error);
  }
}

const patchCompanyUserPassword = async (req, res) => {
  try {
    let patchData = {
      company_user_id : 0,
      password: ''
    };
    patchData = helper.validateFormData(req.body, patchData);
    let {
      company_user_id,
      password,
    } = patchData;
    let postObj = {
      // company_user_id,
      password
    }
    let result = await company_user.updateUser(company_user_id, postObj);
    res.apiResponse({
      status: 1,
      result
    })
  }
  catch (error) {
    res.apiError(error);
  }
}

const patchCompanyUserStatus = async (req, res) => {
  try {
    let patchData = {
      company_user_id: 0,
      is_active: 0,
    };
    patchData = helper.validateFormData(req.body, patchData);
    let {is_active, company_user_id } = patchData;
    if (is_active == 0) {
      patchData.is_active = 1
      patchData.status = 1
    } else {
      patchData.is_active = 0
      patchData.status = 0
    }
    await company_user.updateUser(company_user_id,patchData);
    res.apiResponse({
      status: 1
    })
  } catch (error) {
    res.apiError(error);
  }
}

/* Access Log */
const getCompanyUserAccessLog = async (req, res) => {
  try {
    let {
      company_user_id
    } = req.params;

    company_user_id = _.toInteger(company_user_id);

    let access_log = await company_user.selectCompanyUserAccessLog({
      where: {company_user_id}
    });
    let companyUsers = await company_user.selectUser({
      all: true,
      fields: ['company_user_id', 'username']
    });
    let devices = await model.controller.selectAccessLog({
      all: true,
      fields: ['controller_access_log_id', 'controller_name']
    });
    let result = {
      access_log, devices, companyUsers
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserAccessLogSpecific = async (req, res) => {
  try {
    let {
      controller_access_log_id
    } = req.params;

    controller_access_log_id = _.toInteger(controller_access_log_id);

    let access_log = await company_user.selectCompanyUserAccessLog({
      where: {controller_access_log_id}
    });
    if(_.isEmpty(access_log)) {
      return res.apiResponse({
        status: 1, access_log
      })
    }
    access_log = access_log[0];

    let companyUser = await company_user.selectUser({
      where: {company_user_id: access_log.company_user_id},
    });
    companyUser = companyUser[0]

    let companyInfo = await company.selectCompany({
      where: {company_id : companyUser.company_id},
    });
    companyInfo = companyInfo[0];

    let passcodeData = await controllerModel.selectPasscode({where: {passcode: access_log.passcode}});
    passcodeData = passcodeData[0];

    let {door, controller_device_id} = passcodeData;
    let companyDoorInfo = await company.selectDoor({where: {door, controller_device_id}});
    companyDoorInfo = companyDoorInfo[0];

    let result = {
      access_log, companyUser, companyInfo, companyDoorInfo
    }
    res.apiResponse({
      status: 1, result
    })
   } catch (error){
    res.apiError(error)
    }
  }

const getCompanyUserAccessLogByDate = async (req, res) => {
  try {
    let seven_day_before = moment().subtract(7, 'days').unix();
    console.log(seven_day_before);
    let today = moment().startOf('day').unix() + 86399;

    let access_log = await company_user.selectCompanyUserAccessLogInRange(seven_day_before, today);
    for (let len in access_log) {
    access_log[len] = moment.unix(access_log[len].access_time).format('MM/DD');
    };
    access_log = _.groupBy(access_log)
    for (let len in access_log) {
    access_log[len] = access_log[len].length;
    }
    res.apiResponse({
    status: 1, access_log
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserAccessLogByCompanyDate = async (req, res) => {
  try {
    let seven_day_before = moment().subtract(7, 'days').unix();
    console.log(seven_day_before);
    let today = moment().startOf('day').unix() + 86399;

    let {company_id} = req.params;
    let respData = await company_user.selectUser({where: {company_id}, fields:['company_user_id']});
    let users = _.map(respData, value => {
      return value.company_user_id
    });
    console.log('User >>>', users);

    let access_log = await company_user.selectCompanyUserAccessLogInRangeWithCompanyUserId(seven_day_before, today, users);
    for (let len in access_log) {
    access_log[len] = moment.unix(access_log[len].access_time).format('MM/DD');
    };
    access_log = _.groupBy(access_log)
    for (let len in access_log) {
    access_log[len] = access_log[len].length;
    }
    res.apiResponse({
    status: 1, access_log
    })
  } catch (error) {
    res.apiError(error)
  }
}

/* Door */
const getCompanyDoor = async (req, res) => {
  try {
    let doors = await company.selectDoor({
      all: true
    });
    let devices = await model.controller.selectDevice({
      all: true,
      fields: ['controller_device_id', 'controller_name']
    });

    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    });

    let result = {
      doors, devices, companies
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyDoorById = async (req, res) => {
  try {
    let {
      company_id
    } = req.params;
    let doors = await company.selectDoor({where: { company_id }});
    let result = {
      doors
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserDoor = async (req, res) => {
  try {
    let {
      company_user_id
    } = req.params;
    company_user_id = _.toInteger(company_user_id);
    let userDoors = await company_user.selectUserDoor({where: {company_user_id}});
    let doors = await company.selectDoor({
      all: true,
      fields: ['company_door_id', 'door_name', 'is_active']
    });

    let result = {
      userDoors, doors
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserDoorByPasscode = async (req, res) => {
  try {
    const {
      passcode
    } = req.params;
    let userDoors = await company_user.selectUserDoor({where: {user_door_passcode: passcode}});
    console.log(userDoors);
    let doors = await company.selectDoor({
      all: true,
      fields: ['company_door_id', 'door_name', 'company_id']
    });

    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    });
    let result = {
      userDoors, doors, companies
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserDoorQRCode = async (req, res) => {
  try {
    const {
      company_user_id
    } = req.params;
    let userDoors = await company.selectQRCode({where: {company_user_id}});
    let doors = await company.selectDoor({
      all: true,
      fields: ['company_door_id', 'door_name', 'is_active']
    });
    let result = {
      userDoors, doors
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserDoorQRCodeByPasscode = async (req, res) => {
  try {
    const {
      passcode
    } = req.params;
    console.log('passcode', passcode);
    let userDoors = await company.selectQRCode({where: {qrcode_door_passcode: passcode}});
    console.log(userDoors);
    let doors = await company.selectDoor({
      all: true,
      fields: ['company_door_id', 'door_name', 'company_id']
    });

    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    });
    let result = {
      userDoors, doors, companies
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const postCompanyUserDoorQRCode = async (req, res) => {
  try {
    let postData = {
      company_user_id: 0,
      company_door_id: 0,
      passcode_time_start: 0,
      passcode_time_end: 0,
      start_date: '',
      expire_date: '',
      start_time: '',
      end_time: '',
      usage_count: 0,
      remark: '',
    }

    postData = helper.validateFormData(req.body, postData);

    let {
     company_user_id, company_door_id, passcode_time_start, passcode_time_end, start_date, expire_date, start_time, end_time, usage_count, remark
    } = postData;
    let doorData = await company.selectDoor(company_door_id,{fields: ['controller_device_id', 'door']});
    let controller_device_id = doorData.controller_device_id;
    let door = doorData.door;
    let passcodeFormat = {
      controller_device_id,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: 2,
      passcode_time_start,
      passcode_time_end,
      start_date,
      expire_date,
      start_time,
      end_time,
      usage_count,
      is_active: 1,
      tag_id: '',
      door,
      signature: '',
    }
    let passcodeRc = await controllerModel.createPasscode(passcodeFormat);
    let passcode = passcodeRc.passcode;

    let qrcodeFormat = {
      company_door_id,
      is_active: 1,
      company_user_id,
      first_name: '',
      last_name: '',
      gender: '',
      usage_count,
      qrcode_door_passcode: passcode,
      start_date,
      expire_date,
      start_time,
      end_time,
      controller_passcode_id: passcodeRc.controller_passcode_id,
      company_door_qrcode: '',
      identity: '',
      remark,
      create_time: moment().unix()
    };

    await company.insertQRCode(qrcodeFormat);
    res.apiResponse({
      status: 1,
    })

  } catch (error) {
    res.apiError(error)
  }
};

const patchCompanyUserDoor = async (req, res) => {
  try {
    let patchData = {
      company_user_door_id: 0,
      company_door_id: 0,
      door_name: '',
      privilege_grant_user: 0,
      privilege_qrcode: 0,
      is_active: 0,
      start_date: '',
      expire_date: '',
      start_time: '0000',
      end_time: '0000',
      effective_times: 0,
    }
    patchData = helper.validateFormData(req.body, patchData);
    let postObj = _.clone(patchData);

    let {company_user_door_id} = req.body;

    let result = await company_user.updateUserDoor(company_user_door_id,postObj);
    res.apiResponse({
      status: 1, result
    });
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyUserDoorStatus = async (req, res) => {
  try {
    let patchData = {
      company_user_door_id: 0,
      is_active: 0
    }
    patchData = helper.validateFormData(req.body, patchData);
    let { company_user_door_id, is_active } = patchData;

    let userDoorData = await company_user.selectUserDoor(company_user_door_id);
    const {user_door_passcode} = userDoorData;
    let passcodeData = await controllerModel.selectPasscode({where: {passcode: user_door_passcode}});
    const {controller_passcode_id} = passcodeData[0];

    if (is_active === 1) {
      is_active = 0;
    } else {
      is_active = 1;
    }

    let passcodeResult = await controllerModel.updatePasscode(controller_passcode_id, {is_active})
    let result = await company_user.updateUserDoor(company_user_door_id, { is_active });
    res.apiResponse({
      status: 1, result
    });
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyUserDoorQRCode = async (req, res) => {
  try {
    let patchData = {
      usage_count : 0,
      start_date : '',
      expire_date : '',
      start_time : '',
      end_time : '',
      passcode_time_start: 0,
      passcode_time_end: 0,
      first_name: '',
      last_name: '',
      identity: '',
      remark: '',
    }
    patchData = helper.validateFormData(req.body, patchData);
    let {
      passcode_time_start,
      passcode_time_end,
      start_date,
      expire_date,
      start_time,
      end_time,
      usage_count,
   } = patchData;

   let {company_door_qrcode_id} = req.body;
    let qrcodeData = await company.selectQRCode(company_door_qrcode_id);
    let passcode = qrcodeData.qrcode_door_passcode;
    let passcodeData = await controllerModel.selectPasscode({where: {passcode}});
    let patchPasscodeData = {
      passcode_time_start,
      passcode_time_end,
      start_date,
      expire_date,
      start_time,
      end_time,
      usage_count,
    }
    await controllerModel.updatePasscode(passcodeData[0].controller_passcode_id, patchPasscodeData);

    delete patchData.passcode_time_start;
    delete patchData.passcode_time_end;
    let result = await company.updateQRCode(company_door_qrcode_id, patchData);
    res.apiResponse ({
      status: 1, result,
    })

  } catch(error) {
    res.apiError(error)
  }
}

const patchCompanyUserDoorQRCodeStatus = async (req, res) => {
  try {
    let patchData = {
      company_door_qrcode_id: 0,
      is_active: 0
    }
    patchData = helper.validateFormData(req.body, patchData);
    let { company_door_qrcode_id, is_active } = patchData;

    if (is_active === 1) {
      is_active = 0;
    } else {
      is_active = 1;
    }
    let {qrcode_door_passcode} = await company.selectQRCode(company_door_qrcode_id);
    let passcode = qrcode_door_passcode;
    let [controller_passcode_id] =   await controllerModel.selectPasscode({where: {passcode}, fields: ['controller_passcode_id']});
    let result = await company.updateQRCode(company_door_qrcode_id, { is_active });
    await controllerModel.updatePasscode(controller_passcode_id.controller_passcode_id, {is_active});

    res.apiResponse({
      status: 1, result
    });
  } catch (error) {
    res.apiError(error)
  }
}

/* Company User RFID */
const getCompanyUserRFID = async (req, res) => {
  try {
    let {
      company_user_id
    } = req.params;
    let userrfid = await company_user.selectUserRFID({
      where: {company_user_id}
    });
    let [user] = await company_user.selectUser(
    {
      where: {company_user_id},
      fields: ['first_name', 'last_name', 'company_user_id', 'company_id']}
    );
    let doors = await company.selectDoor({
      where: {company_id: user.company_id},
      fields: ['door_name', 'company_door_id']
    });
    res.apiResponse({
      status: 1, userrfid, user, doors
    })
  } catch (error) {
    res.apiError(error);
  }
}

const getComapnyUserRFIDByPasscode = async (req, res) => {
  try{
    let {
      passcode
    } = req.params;
    if(_.isEmpty(passcode))
      {
        throw new AppError(-60003);
      }
    let rfidData = await company_user.selectUserRFID({
      where: {passcode}
    });
    if(_.isEmpty(rfidData[0]))
      {
        throw new AppError(-60003);
      }
    rfidData = rfidData[0];

    let passcodeData = await controllerModel.selectPasscode({where: {passcode}, fields: ['door', 'controller_device_id']});
    passcodeData = passcodeData[0];
    let {door, controller_device_id} = passcodeData;

    let companyDoorData = await company.selectDoor({where: {door, controller_device_id}, fields: ['door_name']});
    companyDoorData = companyDoorData[0];

    let userData = await company_user.selectUser(rfidData.company_user_id);
    let companyData = await company.selectCompany(userData.company_id);


    let result = {rfidData, userData, companyData, companyDoorData};

    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error);
  }
}

const patchCompanyUserRFIDStatus = async (req, res) => {
  try {
    let patchData = {
      company_user_rfid_id: 0,
      is_active: 0
    }
    patchData = helper.validateFormData(req.body, patchData);
    let { company_user_rfid_id, is_active } = patchData;

    if (is_active === 1) {
      is_active = 0;
    } else {
      is_active = 1;
    }
    let {passcode} = await company_user.selectUserRFID(company_user_rfid_id);
    let [controller_passcode_id] =   await controllerModel.selectPasscode({where: {passcode}, fields: ['controller_passcode_id']});
    let result = await company_user.updateUserRFID(company_user_rfid_id, { is_active });
    await controllerModel.updatePasscode(controller_passcode_id.controller_passcode_id, {is_active});
    res.apiResponse({
      status: 1, result
    });
  } catch (error) {
    res.apiError(error);
  }
}

const deleteCompanyUserRFIDStatus = async (req, res) => {
  try {
    let patchData = {
      company_user_rfid_id: 0,
    }
    patchData = helper.validateFormData(req.body, patchData);
    let { company_user_rfid_id} = patchData;
    let rfidData = await company_user.selectUserRFID(company_user_rfid_id);
    let passcode = rfidData.passcode;
    let passcodeData = await controllerModel.selectPasscode({where: {passcode}});
    passcodeData = passcodeData[0];
    await controllerModel.updatePasscode(passcodeData.controller_passcode_id, {is_active: 0});

    await company_user.deleteUserRFID(company_user_rfid_id);

    res.apiResponse({
      status: 1,
    })
  } catch (error) {
    res.apiError(error);
  }
}

const postCompanyUserRFID = async (req, res) => {
  try {
    let patchData = {
      company_user_id: 0,
      tag_id: '',
      company_door_id: 0,
      is_active: 0,
    };
    patchData = helper.validateFormData(req.body, patchData);
    let {company_door_id, tag_id} = patchData;
    let doorInfo = await company.selectDoor(company_door_id);
    let controller_device_id = doorInfo.controller_device_id;

    let passcodeData = {
      controller_device_id,
      passcode: uuidv4().replace(/-/g, ''),
      passcode_type: 0,
      passcode_time_start: 0,
      passcode_time_end: 2147472000,
      start_date: moment.unix(0).format('YYYY-MM-DD'),
      expire_date: moment.unix(2147472000).format('YYYY-MM-DD'),
      start_time: '0000',
      end_time: '2359',
      usage_count: 99999999,
      is_active: 1,
      door: doorInfo.door,
      tag_id,
      signature: '',
    };
    passcodeRc = await controllerModel.createPasscode(passcodeData);
    patchData.passcode = passcodeRc.passcode;
    delete patchData.controller_device_id;
    patchData.is_active = 1;
    let result = await company_user.insertUserRFID(patchData);
    res.apiResponse({
      status:1, result
    })
  } catch (error) {
    res.apiError(error);
  }
}

/* ROLE */
const getCompanyUserRole = async (req, res) => {
  try {
    let userRoles = await company_user.selectRole({
      all: true
    });
    let companies = await company.selectCompany({
      all: true,
      fields: ['company_id', 'company_name']
    });
    let doors = await company.selectDoor({
      all: true,
      fields: ['company_door_id', 'door_name']
    });
    let result = {
      userRoles, companies, doors
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const getCompanyUserRoleById = async (req, res) => {
  try {
    const {
      company_id
    } = req.params;

    let userRoles = await company_user.selectRole({
      where: {company_id}
    });
    let result = {
      userRoles
    }
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const postCompanyUserRole = async (req, res) => {
  try {
    let postData = {
      company_user_role: '',
      company_id: 0,
      company_door_id: 0,
      company_role_door_entry: 0,
      privilege_grant_user: 0,
      privilege_qrcode: 0,
      privilege_edit: 0,
      create_time: moment().unix()
    }
    // let {user_id} = req.user;
    postData = helper.validateFormData(req.body, postData);
    let {
      company_user_role,
      company_id,
      company_door_id,
      company_role_door_entry,
      privilege_grant_user,
      privilege_qrcode,
      privilege_edit,
      create_time
    } = postData;
    let postObj = {
      company_user_role,
      company_id,
      company_door_id,
      company_role_door_entry,
      privilege_grant_user,
      privilege_qrcode,
      privilege_edit,
      create_time
    }
    let result = await company_user.insertRole(postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchCompanyUserRole = async (req, res) => {
  try {
    let patchData = {
      company_user_role: '',
      company_door_id: 0,
      company_role_door_entry: 0,
      privilege_grant_user: 0,
      privilege_qrcode: 0,
      privilege_edit: 0
    }

    let company_user_role_id = req.body.company_user_role_id;

    patchData = helper.validateFormData(req.body, patchData);
    let {
      company_user_role,
      company_door_id,
      company_role_door_entry,
      privilege_grant_user,
      privilege_qrcode,
      privilege_edit,
    } = patchData;
    let patchObj = {
      company_user_role,
      company_door_id,
      company_role_door_entry,
      privilege_grant_user,
      privilege_qrcode,
      privilege_edit,
    }
    let result = await company_user.updateRole(company_user_role_id, patchObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}