const fs = require('fs');
const path = require('path');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const userKycModel = require('../../model/user/kyc');
const middleware = require('./middleware');

const ERROR_CODE = {
  [-40001]: 'Invalid user account'
};
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    router.use('/api/user', middleware.session.authorize());
    router.get('/api/user/list', getUserList);
    router.get('/api/user/kyc', getUserKycList);
    router.get('/api/user/kyc/:id', getUserKyc);
    router.post('/api/user/kyc', postUserKyc);
    router.patch('/api/user/kyc', patchUserKyc);
  }
};

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

