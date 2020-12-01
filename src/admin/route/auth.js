const _ = require('lodash');
const uuid = require('uuid');
const moment = require('moment');
const passport = require('passport');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const middleware = require('./middleware');

const debug = require('debug')(`app:admin:route:auth`);

const SCOPE = 'tms';

const ERROR_CODE = {
  [-41001]: 'Account does not exist',
  [-41002]: 'Invalid login',
  [-41003]: 'Invalid login',
};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.get(
    //   '/api/auth/session',
    //   middleware.session.authorize(),
    //   getAuthSession,
    // );
    router.post(
      '/api/auth/login',
      passport.authenticate('MyAuth'),
      postLogin
    );
  }
};

// const getAuthSession = async (req, res) => {
//   try {
//     let {

//     } = req.user;
//   } catch (err) {
//     res.apiError(err);
//   }
// }

const postLogin = async function (req, res) {
  try {
    let loginData = {
      email: '',
      password: ''
    };

    loginData = helper.validateFormData(req.body, loginData);
    let email = loginData.email

    let [userRc] = await model.admin.selectAccount({
      where: {email}
    });

    let resObj = {
      status: 1,
      result: null
    };

    if (!userRc) {
      resObj.result = {
        status: -1,
        errorCode: -40001,
        errorMessage: ERROR_CODE[-40001]
      };
      console.warn('#postLogin :: user account not found', resObj.result.errorCode);
      return res.json(resObj);
    }

    let isPasswordCorrect = (userRc && loginData.password === userRc.password);

    if (!isPasswordCorrect) {
      resObj.result = {
        status: -1,
        errorCode: -40002,
        errorMessage: ERROR_CODE[-40002]
      };
      console.warn('#postLogin :: incorrect password :: ', resObj.result.errorCode);
      return res.json(resObj);
    }

    if (userRc.status !== 1) {
      resObj.result = {
        status: -1,
        errorCode: -40003,
        errorMessage: ERROR_CODE[-40003]
      };
      console.warn('#postLogin :: account not active', resObj.result.errorCode);
      return res.json(resObj);
    }

    // await createSession(req, userRc);
    req.session.ADMIN = {
      id: userRc.admin_id
    };

    resObj.result = {
      status: 1,
      redirect: '/home'
    };

    res.json(resObj);
  } catch (err) {
    console.error(err);
    res.json({
      status: -1,
      errorCode: -1,
      errorMessage: 'Unknown error'
    });
  }
};
