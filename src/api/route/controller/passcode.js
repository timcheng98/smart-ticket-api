const _ = require('lodash');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const config = require('config');
const packageData = require('../../../../package.json');
const middleware = require('../middleware');
const CryptoHelper = require('../../../lib/crypto-helper');
const controllerModel = require('../../../model/controller');
const AppError = require('../../../lib/app-error');
const ut = require('@ikoala/node-util');

const debug = require('debug')('app:api/route/controller/passcode');

const ERROR_CODE = {

};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.get(
    '/api/controller/passcode',
    middleware.session.authorizeController(),
    getControllerPasscode,
  );
};

const getControllerPasscode = async (req, res) => {
  try {
    const {
      controllerSession,
    } = req;
    const {
      controller_device_id,
      controller_name,
      access_token,
    } = controllerSession;

    let utime = _.toInteger(req.query.utime);

    const controllerPasscodeArr = await controllerModel.getControllerPasscodeUpdate(
      controller_device_id,
      utime,
    );

    const respData = {
      passcodes: controllerPasscodeArr,
    };
    res.apiResponse(respData);
  } catch (err) {
    res.apiError(err);
  }
};
