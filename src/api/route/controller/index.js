const _ = require('lodash');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const config = require('config');
const packageData = require('../../../../package.json');
const middleware = require('../middleware');
const CryptoHelper = require('../../../lib/crypto-helper');
const AppError = require('../../../lib/app-error');
const ut = require('@ikoala/node-util');
const controllerModel = require('../../../model/controller');
const passcodeRoute = require('./passcode');
const accesslogRoute = require('./accesslog');
const doorRoute = require('./door');

const debug = require('debug')('app:api/route/controller');

const ERROR_CODE = {
  [-20001]: 'invalid controller',
  [-20002]: 'controller is not active',
  [-20003]: 'controller authentication failed',
  [-20004]: 'failed to authenticate controller, access token exists',
  [-20005]: 'request expired',
  [-20006]: 'controller authentication failed, incorrect signature',
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  passcodeRoute.initRouter(router);
  accesslogRoute.initRouter(router);
  doorRoute.initRouter(router);

  router.get(
    '/api/controller',
    getController,
  );

  // Controller Device // Raspberry Pi
  router.post(
    '/api/controller/auth',
    postControllerAuth,
  );

  router.post(
    '/api/controller/auth/check',
    middleware.session.authorizeController(),
    postControllerAuthCheck,
  );
};

const getController = async (req, res) => {
  res.apiResponse({
    scope: 'controller',
    name: packageData.name,
    ts: moment().unix(),
    version: packageData.version,
  });
};

const postControllerAuth = async (req, res) => {
  try {
    let postData = ut.form.validate(req.body, {
      ts: 0,
      signature: '',
      controller_key: '',
      ip_local: '',
    });

    let {
      ts,
      signature,
      controller_key,
      ip_local,
    } = postData;

    // debug(postData);

    if (moment().unix() - ts >= config.get('API.REQUEST_EXPIRY')) {
      throw new AppError(-20005);
    }

    // TODO :: enable signature check
    // const sigData = {
    //   ...postData,
    // };
    // delete sigData.signature;
    // const verifySignature = CryptoHelper.sha256sha256(
    //   CryptoHelper.objectToString(sigData)
    // );

    // if (verifySignature !== signature) {
    //   throw new AppError(-20006);
    // }

    let [controllerRc] = await controllerModel.selectDevice({
      where: {
        controller_key
      },
    });

    // debug(controllerRc);

    if (!controllerRc) {
      throw new AppError(-20001);
    }

    if (controllerRc.controller_key !== controller_key) {
      throw new AppError(-20003);
    }

    let {
      controller_device_id,
      controller_name,
      access_token,
      info_checksum,
    } = controllerRc;

    if (access_token != controller_key) {
      throw new AppError(-20004);
    }

    if (ip_local.indexOf(',') > 0) {
      const ipArr = ip_local.split(',');
      ip_local = ipArr[0];
    }

    access_token = uuidv4().replace(/-/g, '');

    const infoChecksum = CryptoHelper.md5(
      CryptoHelper.objectToString({
        ip_local,
        ip_internet: req.realIP(),
      })
    );

    if (infoChecksum !== info_checksum) {
      // TODO :: write controller authentication log when controller info changed
    }

    await controllerModel.updateDevice(controller_device_id, {
      access_token,
      login_time: moment().unix(),
      sync_time: moment().unix(),
      ip_local,
      ip_internet: req.realIP(),
      info_checksum: infoChecksum,
    });

    const respData = {
      ts: moment().unix(),
      controller_name,
      access_token,
    };

    res.apiResponse({
      status: 1,
      ...respData,
      signature: CryptoHelper.sha256sha256(CryptoHelper.objectToString(respData)),
    });
  } catch (err) {
    res.apiError(err);
  }
};

const postControllerAuthCheck = async (req, res) => {
  try {
    const {
      controllerSession,
    } = req;
    const {
      controller_device_id,
      status,
      controller_name,
      // access_token,
    } = controllerSession;

    let postData = ut.form.validate(req.body, {
      ts: 0,
      signature: '',
      // controller_key: '',
      hostname: '',
      uptime: 0,
      ip_local: '',
    });

    let {
      ts,
      signature,
      hostname,
      uptime,
      ip_local,
    } = postData;

    // TODO :: check signature

    await controllerModel.updateDevice(controller_device_id, {
      // login_time: moment().unix(),
      sync_time: moment().unix(),
      hostname,
      ip_local,
      ip_internet: req.realIP(),
      // info_checksum: infoChecksum,
    });

    const respData = {
      ts: moment().unix(),
      status,
      controller_name,
    };

    res.apiResponse(respData);
  } catch (err) {
    res.apiError(err);
  }
};
