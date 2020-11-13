const crypto = require('crypto');
const querystring = require('querystring');
const P = require('bluebird');
const _ = require('lodash');
const moment = require('moment');
// const uuid = require('uuid');
// const shortid = require('shortid');
const uuidv4 = require('uuid/v4');
const config = require('config');
const models = require('.././index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
    company_api: ['company_api', 'company_api_id'],
}

const getCompanyAPI = models.createSelect(...TABLE.company_api);
const insertCompanyAPI = models.createInsert(...TABLE.company_api);
const updateCompanyAPI = models.createUpdate(...TABLE.company_api);

const getSessionSelect = models.createSelect('company_api');
exports.getSession = async (...args) => {
    let rs = await getSessionSelect(...args);
  
    let sessionData = rs[0];
    if (sessionData) {
      sessionData.isAccessTokenValid = function() {
        if (this.status <= 0) {
          return false;
        }
        let now = moment();
        // let isTokenExpired = now.diff(moment.unix(this.utime), 's') >= ACCESS_TOKEN_EXPIRY;
        let isTokenExpired = false;
        if (isTokenExpired) {
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

const touchSession = async (access_token) => {
    let stmt = 'UPDATE `company_api` SET `utime` = ? WHERE `access_token` = ? LIMIT 1';
    let params = [moment().unix(), access_token];
    try {
        await db.query(stmt, params);
    } catch (err) {
        console.error(err);
    }
};
