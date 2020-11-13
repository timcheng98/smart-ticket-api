const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');
const controllerModel = require('../controller');

const TABLE = {
  company_admin: ['company_admin', 'company_admin_id'],
};

exports.selectAdmin = model.createSelect(...TABLE.company_admin);
exports.updateAdmin = model.createUpdate(...TABLE.company_admin);
exports.insertAdmin = model.createInsert(...TABLE.company_admin);

exports.updateAdminStatus = async (company_admin_id, is_active) => {
  let sql = 'UPDATE `company_admin` SET `is_active` = ? WHERE `company_admin_id` IN (?)';
  let params = [is_active, company_admin_id];
  return db.query(sql, params);
}
