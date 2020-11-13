const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');

const TABLE = {
  company_info: ['company_info', 'company_id'],
  company_door: ['company_door', 'company_door_id'],
  company_door_qrcode: ['company_door_qrcode', 'company_door_qrcode_id'],
};

exports.selectCompany = model.createSelect(...TABLE.company_info);
exports.updateCompany = model.createUpdate(...TABLE.company_info);
exports.insertCompany = model.createInsert(...TABLE.company_info);

exports.selectDoor = model.createSelect(...TABLE.company_door);
exports.updateDoor = model.createUpdate(...TABLE.company_door);
exports.insertDoor = model.createInsert(...TABLE.company_door);

exports.selectQRCode = model.createSelect(...TABLE.company_door_qrcode);
exports.updateQRCode = model.createUpdate(...TABLE.company_door_qrcode);
exports.insertQRCode = model.createInsert(...TABLE.company_door_qrcode);