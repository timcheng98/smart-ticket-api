const _ = require('lodash');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const userKycModel = require('../../model/user/kyc');
const eventModel = require('../../model/smart-contract/event');
const middleware = require('./middleware');

const ERROR_CODE = {
  [-40001]: 'Invalid user account'
};
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/user', middleware.session.authorize());

        
    // router.get('/api/user/list', getUserList);
    // router.get('/api/user/kyc', getUserKycList);
    // router.get('/api/user/kyc/:id', getUserKyc);
    router.get('/api/admin/user', getUser);
    // router.post('/api/user', createUser);
    router.post('/api/user/decrypt', decryptAccountWallet);
    // router.patch('/api/user', patchUser);
    
    router.get('/api/admin/user/list', getUserList);
    router.get('/api/admin/user/kyc', getUserKycList);
    router.get('/api/admin/user/kyc/:id', getUserKyc);
    router.post('/api/admin/user/kyc', postUserKyc);
    router.patch('/api/admin/user/kyc', patchUserKyc);
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
      return res.apiResponse({status: -1, errorMessage: 'Account does not exist.'})
    }

    if (result.password !== req.body.password) {
      return res.apiResponse({status: -1, errorMessage: 'Incorrect Password'})
    }

    if (result.is_active < 1) {
      return res.apiResponse({status: -1, errorMessage: 'Inactive Account'})
    }

    res.apiResponse({ status: 1, result })
  } catch (error) {
    res.apiError(error)
  }
}


const createUser = async (req, res) => {
  try {
    let dataObj = {};

    _.each(_.pick(req.body, [
      'email','password'
    ]), (val, key) => {
      dataObj[key] = _.toString(val);
    });
    
    let account  = await eventModel.createAccount()
    const { address, encrypt } = account;
    const keystore = encrypt(req.body.password);
    dataObj = {
      ...dataObj,
      wallet_address: address
    }
    
    let [userRc] = await userModel.selectUser({ where: { email: dataObj.email }});
    if (userRc) {
      return res.apiResponse({status: -1, errorMessage: 'Email has been registered' })
    }

    await userModel.insertUser(dataObj);
    res.apiResponse({status: 1, result: keystore })
  } catch (error) {
    res.apiError(error)
  }
}

const decryptAccountWallet = async (req, res) => {
  try {
    console.log(req.body)
    let account  = await eventModel.decryptAccount(req.body.keystoreJsonV3, _.toString(req.body.password))
    res.apiResponse({status: 1, result: account })
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
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

const getUserKycList = async (req, res) => {
  try {
    let result = await userKycModel.selectKyc({
      all: true
    });
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

const getUserKyc = async (req, res) => {
  try {
    let { user_id } = req.params;
    let result = await userKycModel.selectKyc(user_id);
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

const postUserKyc = async (req, res) => {
  try {
    let dataObj = req.body;

    let result = await userKycModel.insertKyc(dataObj);
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

const patchUserKyc = async (req, res) => {
  try {
    let dataObj = req.body;
    let { user_id } = req.body;

    let result = await userKycModel.updateKyc(dataObj, user_id);
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

