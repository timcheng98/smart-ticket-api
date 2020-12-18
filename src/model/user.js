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
  USER_ACCOUNT: 'user_account'
};


// General Start
exports.selectUser = models.createSelect(TABLE.USER_ACCOUNT, 'user_id');
exports.insertUser = models.createInsert(TABLE.USER_ACCOUNT, 'user_id');
exports.updateUser = models.createUpdate(TABLE.USER_ACCOUNT, 'user_id');