const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
// const uuid = require('uuid');
// const shortid = require('shortid');
const uuidv4 = require('uuid/v4');
const config = require('config');
const helper = require('../lib/helper');
const models = require('./index');
const db = require('@ikoala/node-mysql-promise');
const company_user = require('./company/user');

const TABLE = {
  USER_ACCOUNT: 'user_account',
  USER_OTP: 'user_otp'
};

const SESSION_TOKEN_EXPIRY = config.get('API.SESSION_TOKEN_EXPIRY');
const ACCESS_TOKEN_EXPIRY = config.get('API.ACCESS_TOKEN_EXPIRY');

// General Start
exports.selectUser = models.createSelect(TABLE.USER_ACCOUNT, 'user_id');
exports.insertUser = models.createInsert(TABLE.USER_ACCOUNT, 'user_id');
exports.updateUser = models.createUpdate(TABLE.USER_ACCOUNT, 'user_id');

exports.selectUserOTP = models.createSelect(TABLE.USER_OTP, 'user_otp_id');
exports.insertUserOTP = models.createInsert(TABLE.USER_OTP, 'user_otp_id');
exports.updateUserOTP = models.createUpdate(TABLE.USER_OTP, 'user_otp_id');
// General End

// OTP Function Start
exports.getOTP = async (app_key, mobile, otp_code) => {
  let returnObj = {
    otp_code,
    attempts: 0,
    remain_time: 0,
  };
  let stmt = 'SELECT * FROM `user_otp` WHERE `app_key` = ? OR `mobile` = ?';
  let params = [app_key, mobile];
  let rs = await db.query(stmt, params);

  // No previous OTP record, insert new OTP record
  if (rs.length === 0) {
    let insertObj = {
      app_key,
      mobile,
      otp_code,
      utime: moment().unix(),
      ctime: moment().unix(),
      attempts: 1
    };
    stmt = 'INSERT INTO `user_otp` SET ?';
    params = [insertObj];
    await db.query(stmt, params);
    return returnObj;
  }

  // Check all OTP records and get the largest `remain_time`
  _.each(rs, (_rc) => {
    let rc = _rc;
    rc = getOTPLockTime(rc);
    // Get max remain time
    if (rc.remain_time >= returnObj.remain_time) {
      returnObj.remain_time = rc.remain_time;
    }
    // Get max attempts
    if (rc.attempts >= returnObj.attempts) {
      returnObj.attempts = rc.attempts;
    }
  });

  // `app_key` and `mobile` are time locked
  if (returnObj.remain_time > 0) {
    return returnObj;
  }

  // Remove all OTP records by `app_key` or `mobile` if not OTP time locked
  // stmt = 'DELETE FROM `user_otp` WHERE `app_key` = ? OR `ßmobile` = ?';
  // params = [app_key, mobile];
  // await db.query(stmt, params);

  // Going to send SMS, increase attempts by 1
  returnObj.attempts += 1;

  // Insert a new OTP record if no OTP time lock
  let insertObj = {
    app_key,
    mobile,
    otp_code,
    utime: moment().unix(),
    ctime: moment().unix(),
    attempts: returnObj.attempts
  };
  stmt = 'INSERT IGNORE INTO `user_otp` SET ?';
  params = [insertObj];
  await db.query(stmt, params);

  // Update `app_key` and `mobile` attempts, otp_code, utime
  stmt = 'UPDATE `user_otp` SET ? WHERE `app_key` = ? OR `mobile` = ?';
  params = [
    {
      otp_code: returnObj.otp_code,
      attempts: returnObj.attempts,
      utime: moment().unix(),
    },
    app_key,
    mobile
  ];
  await db.query(stmt, params);
  return returnObj;
};

const getOTPLockTime = (_otpRc) => {
  let otpRc = _otpRc;
  if (!otpRc) { return otpRc; }
  let now = moment();
  let timeDiff = now.diff(moment.unix(otpRc.utime), 's');
  if (otpRc.attempts > 4) {
    otpRc.remain_time = 300 - timeDiff
  } else if (otpRc.attempts >= 2) {
    otpRc.remain_time = 60 - timeDiff;
  } else {
    otpRc.remain_time = 0;
  }
  if (otpRc.remain_time < 0) {
    otpRc.remain_time = 0;
  }
  return otpRc;
};

exports.resetOTP = async (mobile, _obj) => {
  let obj = _obj
  let stmt = 'UPDATE `user_otp` SET ? WHERE `mobile` = ?;';
  obj.attempts = 0;
  obj.utime = moment().unix();
  let params = [obj, mobile];
  return db.query(stmt, params);
}
