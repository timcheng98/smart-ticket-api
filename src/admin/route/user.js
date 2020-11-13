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

const ERROR_CODE = {
  [-40001]: 'Invalid user account'
};
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    router.use('/api/user', middleware.session.authorize());
    router.get('/api/user/list', getUserList);
  }
};

const getUserList = async (req, res) => {
  try {
    let result = await model.user.selectUser({
      all: true,
      fields: [
        'user_id', 'user_key', 'is_active', 'mobile', 'ctime', 'utime', 'first_name', 'last_name', 'nickname', 'avatar_file', 'email'
      ]
    });
    res.apiResponse({status: 1, result})
  } catch (error) {
    res.apiError(error)
  }
}

