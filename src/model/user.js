const models = require('./index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
  USER_ACCOUNT: 'user_account'
};


// General Start
exports.selectUser = models.createSelect(TABLE.USER_ACCOUNT, 'user_id');
exports.insertUser = models.createInsert(TABLE.USER_ACCOUNT, 'user_id');
exports.updateUser = models.createUpdate(TABLE.USER_ACCOUNT, 'user_id');