const crypto = require('crypto');
const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid');
const shortid = require('shortid');
const config = require('config');
const helper = require('../lib/helper');
const models = require('./index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
  admin_account: 'admin_account',
  // admin_role: 'admin_role'
};

exports.selectAccount = models.createSelect(TABLE.admin_account, 'admin_id');
exports.updateAccount = models.createUpdate(TABLE.admin_account, 'admin_id');
exports.insertAccount = models.createInsert(TABLE.admin_account, 'admin_id');
