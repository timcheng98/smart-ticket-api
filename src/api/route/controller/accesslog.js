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

const debug = require('debug')('app:api/route/controller/accesslog');

const ERROR_CODE = {
  [-21001]: 'invalid logs',
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.put(
    '/api/controller/accesslog',
    middleware.session.authorizeController(),
    putControllerAccessLog,
  );
};

const putControllerAccessLog = async (req, res) => {
  try {
    const logs = _.toArray(req.body.logs);

    if (!Array.isArray(logs)) {
      throw new AppError(-21001);
    }

    const {
      controllerSession,
    } = req;
    const {
      controller_device_id,
      controller_name,
      ip_local,
      // ip_internet,
    } = controllerSession;
    const ip_internet = req.realIP();

    let promises = _.map(logs, (logRc) => {
      return controllerModel.saveAccessLog(logRc, {
        controller_device_id,
        controller_name,
        ip_local,
        ip_internet,
      });
    });

    let saveResults = await Promise.all(promises);

    const respData = {
      results: saveResults,
    };
    res.apiResponse(respData);
  } catch (err) {
    res.apiError(err);
  }
};
