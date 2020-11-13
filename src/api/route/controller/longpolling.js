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

const debug = require('debug')('app:api/route/controller/polling');

const ERROR_CODE = {

};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.get(
    '/api/controller/longpolling',
    middleware.session.authorizeController(),
    getControllerLongPolling,
  );
};

const getControllerLongPolling = async (req, res) => {
  try {
    const {
      controllerSession,
    } = req;
    const {
      controller_device_id,
      controller_name,
      access_token,
    } = controllerSession;

    // let utime = _.toInteger(req.query.utime);

    // const controllerPasscodeArr = await controllerModel.getControllerPasscodeUpdate(
    //   controller_device_id,
    //   utime,
    // );

    // const respData = {
    //   passcodes: controllerPasscodeArr,
    // };

    setTimeout(() => {
      res.apiResponse({
        message: 'ok',
      });
    }, 5000);
  } catch (err) {
    res.apiError(err);
  }
};
