const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');

const TABLE = {
  company_kyc: ['company_kyc', 'company_kyc_id'],
  company_kyc_by_admin: ['company_kyc', 'admin_id'],
};

exports.selectKyc = model.createSelect(...TABLE.company_kyc_by_admin);
exports.updateKyc = model.createUpdate(...TABLE.company_kyc_by_admin);
exports.insertKyc = model.createInsert(...TABLE.company_kyc);

// exports.updateAdminStatus = async (company_admin_id, is_active) => {
//   let sql = 'UPDATE `company_admin` SET `is_active` = ? WHERE `company_admin_id` IN (?)';
//   let params = [is_active, company_admin_id];
//   return db.query(sql, params);
// }
