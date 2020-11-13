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
const companyModel = require('../../../model/company');

const debug = require('debug')('app:api/route/controller/door');

const ERROR_CODE = {

};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  router.post(
    '/api/controller/door',
    middleware.session.authorizeController(),
    postControllerDoor,
  );
};

const postControllerDoor = async (req, res) => {
  try {
    const {
      controllerSession,
    } = req;
    const {
      controller_device_id,
      // controller_name,
      // access_token,
    } = controllerSession;

    let doorList = _.toArray(req.body.doors);

    _.each(doorList, (doorRc) => {
      updateLockStatus(controller_device_id, doorRc);
    });

    const respData = {
      message: 'ok',
    };

    res.apiResponse(respData);
  } catch (err) {
    res.apiError(err);
  }
};

const updateLockStatus = async (controller_device_id, doorRc) => {
  try {
    const {
      DOOR,
      lock_status,
    } = doorRc;

    await companyModel.door.updateLockStatus(
      controller_device_id,
      DOOR,
      lock_status,
    );
  } catch (err) {
    console.error(err);
  }
};
