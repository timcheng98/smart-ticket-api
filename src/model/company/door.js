const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');

const TABLE = {
  company_door: ['company_door', 'company_door_id'],
  company_door_qrcode: ['company_door_qrcode', 'company_door_qrcode_id'],
};

exports.selectDoor = model.createSelect(...TABLE.company_door);
exports.updateDoor = model.createUpdate(...TABLE.company_door);
exports.insertDoor = model.createInsert(...TABLE.company_door);

exports.selectQRCode = model.createSelect(...TABLE.company_door_qrcode);
exports.updateQRCode = model.createUpdate(...TABLE.company_door_qrcode);
exports.insertQRCode = model.createInsert(...TABLE.company_door_qrcode);

/**
 * Update door lock status by controller device and door number
 * @param {*} controller_device_id
 * @param {*} door
 * @param {*} lock_status
 */
exports.updateLockStatus = async (controller_device_id, door, lock_status) => {
  let sql = 'UPDATE `company_door` SET ? WHERE `controller_device_id` = ? AND `door` = ? LIMIT 1';
  let params = [{
    utime: moment().unix(),
    lock_status,
  }, controller_device_id, door];
  return db.query(sql, params);
};
