const path = require('path');
const util = require('util');
const moment = require('moment');
const QRCode = require('qrcode');
const config = require('config');
const passport = require('passport');
const model = require('../../model');
const AppError = require('../../lib/app-error');
const userModel = require('../../model/user');
const eventModel = require('../../model/smart-contract/event');
const middleware = require('./middleware');
const helper = require('../../lib/helper');
const _ = require('lodash');

// TODO:: errorCode
const ERROR_CODE = {
  [-71001]: 'Invalid technine admin information',
  [-71002]: 'Invalid company admin information',
};

AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.post(
    '/api/user/register',
    // passport.authenticate('UserAuth'),
    createUser,
  );

  router.post(
    '/api/login/user',
    passport.authenticate('UserAuth'),
    getUser
  );



  router.use('/api/user', middleware.session.authorizeUser());

  router.get(
    '/api/user',
    getUser
  );

  router.post(
    '/api/user/logout',
    postUserLogout,
  );
  

  router.post(
    '/api/login/admin',
    passport.authenticate('AdminAuth'),
    getAdmin,
  );
  router.post(
    '/api/login/admin/logout',
    postLogout,
  );



  router.use('/api/admin', middleware.session.authorize());
  router.get(
    '/api/admin',
    getAdmin
  );

  router.post(
    '/api/login/company_admin',
    passport.authenticate('CompanyAdminAuth'),
    getCompanyAdmin,
  );
  // router.post(
  //   '/api/login/company_admin/logout',
  //   postCompanyAdminLogout,
  // )

  router.use('/api/login/get_company_admin', middleware.session.authorize());
  router.get(
    '/api/login/get_company_admin',
    getCompanyAdmin,
  )
  // router.patch('/api/admin', patchUser);
};

const createUser = async (req, res) => {
  try {
    let dataObj = {};

    _.each(_.pick(req.body, [
      'email', 'password'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });

    let account = await eventModel.createAccount()
    const { address, encrypt } = account;
    const keystore = encrypt(req.body.password);
    dataObj = {
      ...dataObj,
      wallet_address: address
    }

    let [userRc] = await userModel.selectUser({ where: { email: dataObj.email } });
    if (userRc) {
      return res.apiResponse({ status: -1, errorMessage: 'Email has been registered' })
    }

    await userModel.insertUser(dataObj);
    res.apiResponse({ status: 1, result: keystore })
  } catch (error) {
    res.apiError(error)
  }
}

const getAdmin = async (req, res) => {
  try {
    let { admin_id } = req.user;
    if (admin_id == null) {
      throw new AppError(-71001);
    }

    let userData = await model.admin.selectAccount({
      where: { admin_id },
      // fields: ['admin_id', 'is_active', 'username', 'nickname', 'level', 'email', 'is_active', 'admin_role', 'admin_photo', 'mobile']
    });

    res.apiResponse({
      status: 1,
      userData
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getUser = async (req, res) => {
  try {
    let { user_id } = req.user;
    if (req.user.user_id === 0 ) throw new AppError(req.user.errorCode)
    console.log('req.user', req.user);
    // if (user_id == null) {
    //   throw new AppError(-71001);
    // }

    let result = await userModel.selectUser(user_id, {
      fields: ['user_id', 'is_active', 'first_name', 'last_name', 'email', 'mobile', 'wallet_address', 'need_kyc', 'user_kyc_id']
    });

    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getCompanyAdmin = async (req, res) => {
  try {
    let { company_admin_id, company_key, company_id } = req.user;
    if (company_admin_id == null) {
      throw new AppError(-71002);
    }

    let userData = await model.company.admin.selectAdmin(company_admin_id);

    res.apiResponse({
      status: 1,
      userData,
      company_key,
      company_id,
    })

  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}
// const postUser = async (req, res) => {
//   try {
//     let postData = {
//       email: '',
//       password: '',
//       mobile: ''
//     }
//     postData = helper.validateFormData(req.body, postData);
//     let {email, password, mobile} = postData;
//     let postObj = {
//       email,
//       password,
//       mobile,
//       status: 0,
//       utime: moment().unix(),
//       ctime: moment().unix()
//     }
//     let haveEmail = await model.user.getAccount({
//       where: {email}
//     });
//     let haveMobile = await model.user.getAccount({
//       where: {mobile}
//     });
//     if (haveEmail.length > 0 || haveMobile.length > 0) {
//       return res.apiResponse({
//         status: -1,
//         errorCode: -101,
//         errorMessage: 'User Account existed',
//         result: {}
//       });
//     }
//     let result = await model.user.createAccount(postObj);
//     res.apiResponse({
//       status: 1,
//       result
//     });
//   } catch (error) {
//     console.error(error);
//     res.apiError(error);
//   }
// }

// const patchUser = async (req, res) => {
//   try {
//     let patchData = {
//       status: '',
//     }
//     let {user_id} = req.user;
//     patchData = helper.validateFormData(req.body, patchData);
//     let {status} = patchData;
//     let patchObj = {
//       status,
//       utime: moment().unix(),
//     }
//     let result = await model.user.updateAccount(user_id, patchObj);
//     res.apiResponse({
//       result
//     });
//   } catch (error) {
//     console.error(error);
//     res.apiError(error);
//   }
// }

const postUserLogout = async (req, res) => {
  try {
    req.logout();
    res.apiResponse({
      message: 'ok',
    });
  } catch (err) {
    res.apiError(err);
  }
}


const postLogout = async (req, res) => {
  try {
    req.logout();
    res.apiResponse({
      message: 'ok',
    });
  } catch (err) {
    res.apiError(err);
  }
}
