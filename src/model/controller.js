// const querystring = require('querystring');
const path = require('path');
const fs = require('fs');
const _ = require('lodash');
const moment = require('moment');
// const uuid = require('uuid');
// const shortid = require('shortid');
const QRCode = require('qrcode');
const config = require('config');
// const helper = require('../lib/helper');
const model = require('./index');
const securityModel = require('./security');
const companyModel = require('./company');
const ut = require('@ikoala/node-util');
const db = require('@ikoala/node-mysql-promise');
const websocketController = require('../websocket-controller');

const debug = require('debug')('app:model/controller');

const TABLE = {
  ControllerDevice: ['controller_device', 'controller_device_id'],
  ControllerPasscode: ['controller_passcode', 'controller_passcode_id'],
  ControllerAccessLog: ['controller_access_log', 'controller_access_log_id'],
};

const PASSCODE_TYPE = {
  SYSTEM: 0,
  USER: 1,
  QRCODE: 2,
};
exports.PASSCODE_TYPE = PASSCODE_TYPE;

exports.selectDevice = model.createSelect(...TABLE.ControllerDevice);
exports.insertDevice = model.createInsert(...TABLE.ControllerDevice);
exports.updateDevice = model.createUpdate(...TABLE.ControllerDevice);

exports.selectPasscode = model.createSelect(...TABLE.ControllerPasscode);
const insertPasscode = model.createInsert(...TABLE.ControllerPasscode);
const updatePasscodeFunc = model.createUpdate(...TABLE.ControllerPasscode);

exports.createPasscode = async (passcodeData) => {
  const {
    controller_device_id,
  } = passcodeData;
  let rs = await insertPasscode(passcodeData);

  const controllerDevice = await exports.selectDevice(controller_device_id);
  const {
    access_token,
  } = controllerDevice;
  const sendCommandResult = websocketController.sendCommandToController(access_token, {
    action: 'fetch_passcode',
    data: {},
  });

  return rs;
};

exports.updatePasscode = async (controller_passcode_id, ...args) => {
  let rs = await updatePasscodeFunc(controller_passcode_id, ...args);

  let passcodeRc = await exports.selectPasscode(controller_passcode_id, {
    fields: ['controller_device_id'],
  })
  const controller_device_id = passcodeRc.controller_device_id;
  const controllerDevice = await exports.selectDevice(controller_device_id);
  const {
    access_token,
  } = controllerDevice;
  const sendCommandResult = websocketController.sendCommandToController(access_token, {
    action: 'fetch_passcode',
    data: {},
  });

  return rs;
};

exports.selectAccessLog = model.createSelect(...TABLE.ControllerAccessLog);
/**
 *
 * @param {number} start_date
 * @param {number} end_date
 */
exports.selectControllerAccessLogByRange = async (start_date, end_date) => {
  let sql = 'SELECT * FROM `controller_access_log` WHERE `access_time` between ? AND ?';
  let params = [start_date, end_date];
  return db.query(sql, params);
};

exports.selectControllerAccessLogByRangeAndPasscode = async (start_date, end_date, passcode) => {
  let sql = 'SELECT * FROM `controller_access_log` WHERE `passcode` in (?) AND `access_time` between ? AND ?'
  let params = [passcode, start_date, end_date];
  return db.query(sql, params);
}
// const insertAccessLog = model.createInsert(...TABLE.ControllerAccessLog);
// exports.updateAccessLog = model.createUpdate(...TABLE.ControllerAccessLog);

/**
 *
 * @param {number} controller_device_id
 * @param {number} updateTime
 */
exports.getControllerPasscodeUpdate = async (controller_device_id, updateTime) => {
  let sql = 'SELECT * FROM `controller_passcode` WHERE `controller_device_id` = ? AND `utime` > ?';
  let params = [controller_device_id, updateTime];
  return db.query(sql, params);
};

const PASSCODE_ENCRYPTION_KEY = '';

const convert = (from, to) => (str) => Buffer.from(str, from).toString(to);
const utf8ToHex = convert('utf8', 'hex');
const hexToUtf8 = convert('hex', 'utf8');

/**
 * Validate encrypted passcode format
 * @param {string} encryptedPasscode
 * @returns {boolean}
 */
const validateEncryptedPasscode = (encryptedStr) => {
  const dataArr = encryptedStr.split('.');

  if (dataArr.length !== 5) {
    debug('validateEncryptedPasscode() :: encrypted passcode has invalid format');
    return false;
  }

  const [
    version, createTime, expiryTime, encryptedData, encryptedPasscode
  ] = dataArr;

  const nowTs = moment().unix();

  if (createTime >= nowTs) {
    debug('validateEncryptedPasscode() :: encrypted passcode has invalid create time');
    return false;
  }

  if (nowTs >= expiryTime) {
    debug('validateEncryptedPasscode() :: encrypted passcode has expired');
    return false;
  }

  return true;
};
exports.validateEncryptedPasscode = validateEncryptedPasscode;

/**
 * Encrypt passcode to be used on controller
 * v1
    .1595925806
    .2145948206
    .5089f9045d5a55590422c89df92a186b:7d4262043160a0b137f9c1284c72873e39412cda73faecf9fd32f9c2cfa4ea4586069d2490bb926eb78172489ab527fc
    .4d0cd5ddaaebea4e08205df8df3c01f6:a62ec04c562cda6811144c1aec46b6ae2580c844e0e32a31704418052f5e8c5cc1b6aed27dc56e9434cfacd86cc0f5c3
 * @param {number} encryption_version
 * @param {string} controller_key
 * @param {string} passcode
 * @param {number} expiryTime encrypted passcode expiry unix timestamp
 */
const encryptPasscode = (encryption_version, controller_key, passcode, expiryTime) => {
  const createTime = moment().unix();
  const encryptedPasscode = securityModel.encryptString(
    `${PASSCODE_ENCRYPTION_KEY}${createTime}${expiryTime}`,
    passcode
  );
  const encryptedData = securityModel.encryptString(
    `${controller_key}${createTime}${expiryTime}`,
    passcode
  );

  const encryptedPasscodeData = `v${encryption_version}.${createTime}.${expiryTime}.${encryptedData}.${passcode}`;

  // TODO :: use shorter encryption length
  // return `v${encryption_version}.${createTime}.${expiryTime}.${encryptedData}.${encryptedPasscode}`;
  // return `v${encryption_version}.${createTime}.${expiryTime}.${encryptedData}.0`;

  debug(`encryptedPasscodeData >> ${encryptedPasscodeData}`);

  return encryptedPasscodeData;
};
exports.encryptPasscode = encryptPasscode;

/**
 * Decrypt passcode from QR Code data
 * @param {string} qrcodeData
 */
const decryptPasscode = (qrcodeData) => {
  const [
    version, createTime, expiryTime, encryptedData, encryptedPasscode
  ] = qrcodeData.split('.');

  // return {
  //   encryption_version: _.toInteger(version.replace('v', '')),
  //   createTime: _.toInteger(createTime),
  //   expiryTime: _.toInteger(expiryTime),
  //   passcode: securityModel.decryptString(
  //     `${PASSCODE_ENCRYPTION_KEY}${createTime}${expiryTime}`,
  //     encryptedPasscode
  //   ),
  // };

  return {
    encryption_version: _.toInteger(version.replace('v', '')),
    createTime: _.toInteger(createTime),
    expiryTime: _.toInteger(expiryTime),
    passcode: encryptedPasscode,
  };
};
exports.decryptPasscode = decryptPasscode;

/**
 * Create encrypted passcode for controller API by `controller_passcode_id`
 * @param {number} controller_passcode_id
 */
exports.createEncryptedPasscodeById = async (controller_passcode_id) => {
  let controllerPasscode = await exports.selectPasscode(controller_passcode_id);
  // console.log('ControllerPasscode>>>', controllerPasscode);
  return exports.createEncryptedPasscode(controllerPasscode);
}

/**
 * Create encrypted passcode for controller API by controller_record
 * @param {controller_passcode} passcodeRecord
 */
exports.createEncryptedPasscode = async (passcodeRecord, expiryTime) => {
  // TODO :: check expiry time range

  const {
    ctime,
    controller_device_id,
    passcode,
    // passcode_type,
    // passcode_time_start,
    // passcode_time_end,
  } = passcodeRecord;

  let controllerDevice = await exports.selectDevice(
    controller_device_id,
    {
      fields: [
        'controller_key',
        'software_version',
        'encryption_version',
      ],
    }
  );

  // console.log('Controller Device>>>',controllerDevice)

  const {
    controller_key,
    software_version,
    encryption_version,
  } = controllerDevice;

  const encryptedPasscode = encryptPasscode(
    encryption_version,
    controller_key,
    passcode,
    expiryTime || moment().add(config.get('API_PASSCODE_EXPIRY_TIME'), 's').unix(),
  );

  // debug(`encrypted qrcode data >> ${qrcodeData}`);
  // debug(`decrypted qrcode data >> `, decryptPasscode(qrcodeData));

  return encryptedPasscode;
};

/**
 * Create QR Code image file with controller passcode record
 * Check if QR Code file already exists
 * Create QR Code image file if not exists
 * @param {controller_passcode} passcodeRecord
 */
exports.createQRCode = async (passcodeRecord) => {
  const {
    ctime,
    controller_device_id,
    passcode,
    // passcode_type,
    // passcode_time_start,
    // passcode_time_end,
  } = passcodeRecord;

  const qrcodeFileName = `${ctime}_${passcode}.png`;
  const qrcodeFilePath = path.join(config.get('MEDIA.QRCODE'), qrcodeFileName);

  // const qrcodeURL = `${config.get('STATIC_SERVER_URL')}/media/${qrcodeFileName}`;

  if (fs.existsSync(qrcodeFilePath)) {
    return {
      filename: qrcodeFileName,
      filepath: qrcodeFilePath,
      // url: qrcodeURL,
    };
  }

  // const qrcodeData = {
  //   passcode,
  //   passcode_type,
  //   passcode_time_start,
  //   passcode_time_end,
  // };

  // debug(`qrcodeData >> `, qrcodeData);

  let controllerDevice = await exports.selectDevice(controller_device_id, {
    fields: [
      'controller_key',
      'software_version',
      'encryption_version',
    ],
  });

  const {
    controller_key,
    software_version,
    encryption_version,
  } = controllerDevice;

  const qrcodeData = encryptPasscode(
    encryption_version,
    controller_key,
    passcode,
    moment().year(2038).month(0).date(1).unix()
  );

  // debug(`encrypted qrcode data >> ${qrcodeData}`);
  // debug(`decrypted qrcode data >> `, decryptPasscode(qrcodeData));

  return new Promise((resolve, reject) => {
    QRCode.toFile(qrcodeFilePath, qrcodeData, (err) => {
      if (err) {
        console.error(err);
        reject(err);
        return;
      }
      // console.info(`created qrcode >> ${qrcodeURL}`);

      resolve({
        filename: qrcodeFileName,
        filepath: qrcodeFilePath,
        // url: qrcodeURL,
      });
    });
  });
};

exports.saveAccessLog = async (logRc, controllerDevice) => {
  let logData = ut.form.validate(logRc, {
    _id: '',
    // upload_time,
    access_time: 0,
    // access_time_str,
    status: '',
    passcode: '',
    passcode_type: 0,
    passcode_time_start: 0,
    passcode_time_end: 0,
    usage_count: 0,
    is_active: 0,
    direction: '',
    action: '',
    reader: '',
    // >>> Optional Fields
    access_token: '',
    client_ip: '',
    browser: '',
    version: '',
    os: '',
    platform: '',
    // <<< Optional Fields
    signature: '',
  });

  logData.passcode = _.truncate(logData.passcode, {
    length: 32,
    omission: '',
  });

  const {
    controller_device_id,
    controller_name,
    ip_local,
    ip_internet,
  } = controllerDevice;
  logData = {
    controller_device_id,
    controller_name,
    controller_ip_local: ip_local,
    controller_ip_internet: ip_internet,
    ...logData,
  };

  // let companyUser = {
  //   company_user_id: 0,
  //   username: '',
  //   mobile: '',
  //   email: '',
  //   last_name: '',
  //   first_name: '',
  // };

  logData.ctime = moment().unix();
  logData.utime = logData.ctime;

  let sql = 'INSERT INTO `controller_access_log` SET ? ON DUPLICATE KEY UPDATE ?';
  let params = [logData, { utime: moment().unix() }];
  let rs = await db.query(sql, params);

  logData.controller_access_log_id = rs.insertId;

  // debug(companyModel);

  await companyModel.user.saveAccessLog(logData);

  return {
    _id: logData._id,
    upload_time: moment().unix(),
  };
};
