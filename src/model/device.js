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
  device_info: 'device_info',
};

exports.getInfo = model.createSelect(TABLE.device_info, 'device_info_id');
exports.createInfo = model.createInsert(TABLE.device_info, 'device_info_id');
exports.updateInfo = model.createUpdate(TABLE.device_info, 'device_info_id');
