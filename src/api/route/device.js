const _ = require('lodash');
const crypto = require('crypto');
const moment = require('moment');
const uuidv4 = require('uuid/v4');
const middleware = require('./middleware');
const AppError = require('../../lib/app-error');
const ut = require('@ikoala/node-util');
const model = require('../../model');

const debug = require('debug')('app:api:route:device');

const ERROR_CODE = {
  [-11001]: 'Invalid device info',
};
AppError.setErrorCode(ERROR_CODE);

exports.initRouter = (router) => {
  // Mobile Device
  router.put('/device', putDevice);
};

const md5 = (_str) => {
  let str = _str;
  let md5sum = crypto.createHash('md5');
  md5sum.update(str);
  str = md5sum.digest('hex');
  return str;
};

const putDevice = async (req, res) => {
  try {
    let deviceInfo = {
      os: '',
      os_version: '',
      unique_id: '', // unique for android, but ios may change it for some cases
      supported_abi: '',
      screen_width: 0,
      screen_height: 0,
      brand: '',
      model: '',
    };
    debug(`req.body >> `, req.body);

    deviceInfo = ut.form.validate(req.body, deviceInfo);

    _.forEach(deviceInfo, (value) => {
      if (value.trim === "") {
        throw new AppError(-11001, ERROR_CODE['11001'])
      }
    })

    deviceInfo.ip_addr = req.headers['x-forwarded-for'] || req.connection.remoteAddress;

    let keyArr = Object.keys(deviceInfo).sort();
    let deviceStr = '';

    _.each(keyArr, (key) => {
      deviceStr += `${deviceStr.length > 0 ? '&' : ''}${key}=${deviceInfo[key]}`;
    });

    deviceInfo.checksum = md5(deviceStr);
    deviceInfo.app_key = uuidv4().replace(/-/g, '');

    await model.device.createInfo(deviceInfo);

    res.apiResponse({
      status: 1,
      app_key: deviceInfo.app_key
    });
  } catch (err) {
    res.apiError(err);
  }
};
