const path = require('path');
const util = require('util');
const moment = require('moment');
const QRCode = require('qrcode');
const config = require('config');
const passport = require('passport');
const model = require('../../model');
const AppError = require('../../lib/app-error');
const userModel = require('../../model/user');
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

const getAdmin = async (req, res) => {
  try {
    let { admin_id } = req.user;
    if (admin_id == null) {
      throw new AppError(-71001);
    }

    let userData = await model.admin.selectAccount({
      where: { admin_id },
      fields: ['admin_id', 'is_active', 'username', 'nickname', 'level', 'email', 'is_active', 'admin_role', 'admin_photo', 'mobile']
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

const getCompanyAdmin = async (req, res) => {
  try {
    let { company_admin_id, company_key, company_id} = req.user;
    if(company_admin_id == null) {
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
