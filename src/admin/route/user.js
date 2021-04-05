const _ = require('lodash');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const userKycModel = require('../../model/user/kyc');
const eventModel = require('../../model/smart-contract/event');
const middleware = require('./middleware');
const userModel = require('../../model/user')

const ERROR_CODE = {
  [-40001]: 'Invalid user account'
};
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/user', middleware.session.authorize());


    // router.get('/api/admin/user/list', getUserList);
    // router.get('/api/user/kyc', getUserKycList);
    // router.get('/api/user/kyc/:id', getUserKyc);
    router.get('/api/admin/user', getUser);
    
    // router.get('/api/admin/user/:id', getSingleUser);
    // router.post('/api/user', createUser);
    router.post('/api/user/decrypt', decryptAccountWallet);
    router.patch('/api/admin/user', patchUserByAdmin);

    router.get('/api/admin/user/list', getUserList);
    router.get('/api/admin/user/kyc', getUserKycList);
    router.post('/api/admin/user/kyc', postUserKyc);
    router.patch('/api/admin/user/kyc', patchUserKyc);
    
    router.patch('/api/user', patchUser);
    router.get('/api/user/kyc', getUserKyc);
    router.post('/api/user/kyc', postUserKyc);
    router.patch('/api/user/kyc', patchUserKyc);
  }
};

const getUser = async (req, res) => {
  try {
    let [result] = await userModel.selectUser({
      where: {
        email: req.body.email
      }
    });

    if (!result) {
      return res.apiResponse({ status: -1, errorMessage: 'Account does not exist.' })
    }

    if (result.password !== req.body.password) {
      return res.apiResponse({ status: -1, errorMessage: 'Incorrect Password' })
    }

    if (result.is_active < 1) {
      return res.apiResponse({ status: -1, errorMessage: 'Inactive Account' })
    }

    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

const getSingleUser = async (req, res) => {
  try {
    console.log('req.params', req.params);
    let result = await userModel.selectUser(_.toInteger(req.params.id));
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}



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

const patchUserByAdmin = async (req, res) => {
  try {
    let dataObj = {
    };
    _.each(_.pick(req.body, [
      'credit_card_expiry_date', 'credit_card_name', 'mobile'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });
    _.each(_.pick(req.body, [
      'credit_card_number', 'status', 'role', 'is_active', 'is_mobile_verified', 'is_email_verfied'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });

    await userModel.updateUser(req.body.user_id, dataObj);

    res.apiResponse({ status: 1 })
  } catch (error) {
    res.apiError(error)
  }
}

const patchUser = async (req, res) => {
  try {
    let dataObj = {
      user_id: req.user.user_id
    };
    _.each(_.pick(req.body, [
      'credit_card_expiry_date', 'credit_card_name', 'mobile'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });
    _.each(_.pick(req.body, [
      'credit_card_number', 'status', 'role', 'is_active', 'is_mobile_verified', 'is_email_verfied'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });

    await userModel.updateUser(req.user.user_id, dataObj);

    res.apiResponse({ status: 1 })
  } catch (error) {
    res.apiError(error)
  }
}

const decryptAccountWallet = async (req, res) => {
  try {
    console.log(req.body)
    let account = await eventModel.decryptAccount(req.body.keystoreJsonV3, _.toString(req.body.password))
    res.apiResponse({ status: 1, result: account })
  } catch (error) {
    res.apiError(error)
  }
}

const getUserList = async (req, res) => {
  try {
    let result = await model.user.selectUser({
      all: true,
      //   fields: [
      //     'user_id', 'is_active', 'mobile', 'ctime', 'utime', 'first_name', 'last_name', 'nickname', 'email'
      //   ]
    });
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

const getUserKycList = async (req, res) => {
  try {
    let result = await userKycModel.selectKyc({
      all: true
    });
    console.log('result', result);
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

const getUserKyc = async (req, res) => {
  try {
    let { user_id } = req.user;
    console.log('user_id', user_id);
    let result = await userKycModel.selectKyc(user_id);
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

const postUserKyc = async (req, res) => {
  try {
    let dataObj = {
      user_id: req.user.user_id
    };
    _.each(_.pick(req.body, [
      'national_id', 'first_name', 'last_name', 'national_doc', 'face_doc', 'reject_reason'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'status', 'birthday', 'national_doc_verified', 'face_doc_verified'
    ]), (val, key) => {
      dataObj[key] = _.toInteger(val);
    });

    let result = await userKycModel.insertKyc(dataObj);
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

const patchUserKyc = async (req, res) => {
  try {
    let { user_id } = req.body;
    let dataObj = {}

    _.each(_.pick(req.body, [
      'national_id', 'first_name', 'last_name', 'national_doc', 'face_doc', 'reject_reason'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'status', 'birthday', 'national_doc_verified', 'face_doc_verified'
    ]), (val, key) => {
      dataObj[key] = _.toInteger(val);
    });

    let result = await userKycModel.updateKyc(user_id, dataObj);
    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}

