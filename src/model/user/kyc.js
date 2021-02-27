const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');
const controllerModel = require('../controller');

const TABLE = {
  user_kyc: ['user_kyc', 'user_kyc_id'],
  user_kyc_by_user: ['user_kyc', 'user_id'],
};

exports.selectKyc = model.createSelect(...TABLE.user_kyc_by_user);
exports.updateKyc = model.createUpdate(...TABLE.user_kyc_by_user);
exports.insertKyc = model.createInsert(...TABLE.user_kyc);