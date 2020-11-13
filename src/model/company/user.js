const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');
const model = require('../index');
const controllerModel = require('../controller');

const TABLE = {
  company_user: ['company_user', 'company_user_id'],
  // company_admin: ['company_admin', 'company_admin_id'],
  // company_info: ['company_info', 'company_id'],
  company_user_door: ['company_user_door', 'company_user_door_id'],
  device_info: ['device_info', 'device_info_id'],
  company_user_access: ['company_user_access', 'company_user_access_id'],
  company_user_role: ['company_user_role', 'company_user_role_id'],
  company_user_edit_door: ['company_user_edit_door', 'company_user_edit_door_id'],
  company_user_access_log: ['company_user_access_log', 'company_user_access_log_id'],
  company_user_session: 'company_user_session',
  company_user_rfid: ['company_user_rfid', 'company_user_rfid_id'],
};

exports.selectUser = model.createSelect(...TABLE.company_user);
exports.insertUser = model.createInsert(...TABLE.company_user);
exports.updateUser = model.createUpdate(...TABLE.company_user);
// exports.deleteUser = model.createDelete(...TABLE.company_user);

exports.selectUserDoor = model.createSelect(...TABLE.company_user_door);
exports.insertUserDoor = model.createInsert(...TABLE.company_user_door);
exports.updateUserDoor = model.createUpdate(...TABLE.company_user_door);

/**
 *
 * @param {number} company_door_id
 * @param {number} is_active
 */
exports.updateUserDoorStatus = async (company_door_id, is_active) => {
  is_active === 0 ? is_active = -1 : is_active;
  let sql = 'UPDATE `company_user_door` SET is_active = ? WHERE company_door_id = ? AND is_active != 0';
  let params = [is_active, company_door_id];
  return db.query(sql, params);
};
/**
 *
 * @param {number} company_door_id
 * @param {number} is_active
 */
exports.updateUserDoorQRCodeStatus = async (company_door_id, is_active) => {
  is_active === 0 ? is_active = -1 : is_active;
  let sql = 'UPDATE `company_door_qrcode` SET is_active = ? WHERE company_door_id = ? AND is_active != 0';
  let params = [is_active, company_door_id];
  return db.query(sql, params);
};

exports.updateUserDoor = model.createUpdate(...TABLE.company_user_door);
exports.deleteUserDoor = async(company_user_id, company_door_id) => {
  let stmt = `DELETE FROM company_user_door WHERE company_user_id = ? AND company_door_id = ?`
  let params = [company_user_id , company_door_id]
  db.query(stmt, params);
}

exports.selectDevice = model.createSelect(...TABLE.device_info);
exports.updateDevice = model.createUpdate(...TABLE.device_info);
exports.insertDevice = model.createInsert(...TABLE.device_info);

exports.selectAccessRecord = model.createSelect(...TABLE.company_user_access);
// exports.updateAccessRecord = model.createUpdate(...TABLE.company_user_access);
exports.insertAccessRecord = model.createInsert(...TABLE.company_user_access);

exports.selectRole = model.createSelect(...TABLE.company_user_role);
exports.updateRole = model.createUpdate(...TABLE.company_user_role);
exports.insertRole = model.createInsert(...TABLE.company_user_role);

exports.selectUserEditDoor = model.createSelect(...TABLE.company_user_edit_door);
exports.updateUserEditDoor = model.createUpdate(...TABLE.company_user_edit_door);
exports.insertUserEditDoor = model.createInsert(...TABLE.company_user_edit_door);

exports.selectCompanyUserAccessLog = model.createSelect(...TABLE.company_user_access_log);
exports.selectCompanyUserAccessLogInRange = async (start_date, end_date) => {
  let sql = 'SELECT access_time FROM `company_user_access_log` WHERE `access_time` between ? AND ?';
  let params = [start_date, end_date];
  return db.query(sql, params);
};
exports.selectCompanyUserAccessLogInRangeWithCompanyUserId = async (start_date, end_date, company_user_id) => {
    let sql = 'SELECT access_time FROM `company_user_access_log` WHERE `access_time` between ? AND ? AND `company_user_id` in (?)';
    let params = [start_date, end_date, company_user_id];
    return db.query(sql, params);
}

exports.selectSession = model.createSelect(TABLE.company_user_session, 'session_token');
exports.updateSession = model.createUpdate(TABLE.company_user_session, 'session_token');
exports.insertSession = model.createInsert(TABLE.company_user_session, 'session_token');
// exports.insertSession = insertSession;

exports.updateUserStatus = async (company_user_id, is_active) => {
  let sql = 'UPDATE `company_user` SET `status` = ? WHERE `company_user_id` IN (?)';
  let params = [is_active, company_user_id];
  return db.query(sql, params);
}

exports.saveAccessLog = async (accessLogRc) => {
  const {
    controller_access_log_id,
    access_time,
    status,
    passcode,
    passcode_type,
    direction,
    action,
    reader,
    // >>> Optional Fields
    access_token,
    client_ip,
    browser,
    version,
    os,
    platform,
    // <<< Optional Fields
    signature,
  } = accessLogRc;
  // Save company user access log if access token exists

  if (passcode_type !== controllerModel.PASSCODE_TYPE.USER) {
    return;
  }

  let userAccessLogData = {
    controller_access_log_id,
    access_time,
    status,
    passcode,
    passcode_type,
    direction,
    action,
    reader,
    latitude: 123.456,
    longitude: 123.456,
    // >>> Optional Fields
    access_token,
    client_ip,
    browser,
    version,
    os,
    platform,
    // <<< Optional Fields
    signature,
    company_user_id: 0,
    mobile: '',
    email: '',
    first_name: '',
    last_name: '',
  };

  // Select company user door record
  let [companyUserDoor] = await exports.selectUserDoor({
    fields: [
      'company_user_door_id',
      'company_user_id',
    ],
    where: {
      user_door_passcode: passcode,
    }
  });

  // Append company user data to user access log if exists
  if (companyUserDoor) {
    const {
      company_user_id,
    } = companyUserDoor;
    const companyUser = await exports.selectUser(company_user_id, {
      fields: [
        'company_user_id',
        'mobile',
        'email',
        'first_name',
        'last_name',
      ],
    });

    userAccessLogData = {
      ...userAccessLogData,
      ...companyUser,
    };
  }

  userAccessLogData.ctime = moment().unix();
  userAccessLogData.utime = userAccessLogData.ctime;

  let sql = 'INSERT INTO `company_user_access_log` SET ? ON DUPLICATE KEY UPDATE ?';
  let params = [userAccessLogData, {utime: moment().unix()}];
  await db.query(sql, params);
};

exports.selectUserRFID = model.createSelect(...TABLE.company_user_rfid);
exports.insertUserRFID = model.createInsert(...TABLE.company_user_rfid);
exports.updateUserRFID = model.createUpdate(...TABLE.company_user_rfid);
exports.deleteUserRFID = async (company_user_rfid_id) => {
  let stmt = 'DELETE FROM `company_user_rfid` WHERE `company_user_rfid_id` = ?';
  let params = [company_user_rfid_id];
  db.query(stmt, params);
}