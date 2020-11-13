const crypto = require('crypto');
const querystring = require('querystring');
const P = require('bluebird');
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

const SESSION_TOKEN_EXPIRY = config.get('API.SESSION_TOKEN_EXPIRY');
const ACCESS_TOKEN_EXPIRY = config.get('API.ACCESS_TOKEN_EXPIRY');

/**
 * Get customer session by `access_token`
 * @param  {[type]}  access_token [description]
 * @return {Promise}              [description]
 */
const getSessionSelect = models.createSelect('company_user_session');
exports.getSession = async (...args) => {
  let rs = await getSessionSelect(...args);

  let sessionData = rs[0];
  if (sessionData) {
    sessionData.isAccessTokenValid = function() {
      if (this.status <= 0) {
        return false;
      }
      let now = moment();
      let isTokenExpired = now.diff(moment.unix(this.utime), 's') >= ACCESS_TOKEN_EXPIRY;
      if (isTokenExpired) {
        return false;
      }
      return true;
    };
    sessionData.isSessionValid = function() {
      if (this.status <= 0) {
        return false;
      }
      let now = moment();
      let isSessionExpired = now.diff(moment.unix(this.utime), 's') >= SESSION_TOKEN_EXPIRY;
      if (isSessionExpired) {
        return false;
      }
      return true;
    };
    sessionData.touch = async function() {
      await touchSession(this.access_token);
    };
  }
  return sessionData;
};

exports.createSession = async (company_user_id, app_key) => {
  let session_token = uuidv4().replace(/-/g, '');
  let access_token = uuidv4().replace(/-/g, '');
  // let app_key = '';
  let insertObj = {
    company_user_id,
    session_token,
    access_token,
    app_key,
    utime: moment().unix(),
    ctime: moment().unix(),
    status: 1,
  };
  let stmt = 'REPLACE INTO `company_user_session` SET ?';
  await db.query(stmt, [insertObj]);
  return insertObj;
};

exports.removeSession = async (where) => {
  let sql = 'DELETE FROM `company_user_session` WHERE ? LIMIT 1';
  let params = [where];
  return db.query(sql, params);
};

exports.createAccessToken = async (session_token) => {
  let access_token = uuidv4().replace(/-/g, '');
  let stmt = 'UPDATE `company_user_session` SET ? WHERE `session_token` = ? LIMIT 1';
  let params = [{
    utime: moment().unix(),
    access_token,
  }, session_token];
  await db.query(stmt, params);
  return access_token;
};

const touchSession = async (access_token) => {
  let stmt = 'UPDATE `company_user_session` SET `utime` = ? WHERE `access_token` = ? LIMIT 1';
  let params = [moment().unix(), access_token];
  try {
    await db.query(stmt, params);
  } catch (err) {
    console.error(err);
  }
};
