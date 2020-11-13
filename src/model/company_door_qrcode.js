// const crypto = require('crypto');
// const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
// const uuid = require('uuid');
// const shortid = require('shortid');
const config = require('config');
// const helper = require('../lib/helper');
const model = require('./index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
};

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
