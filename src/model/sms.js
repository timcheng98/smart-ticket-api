const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
const uuid = require('uuid');
const shortid = require('shortid');
const Twilio = require('twilio');
const randomstring = require("randomstring");
const config = require('config');
const AppError = require('../lib/app-error');
const helper = require('../lib/helper');
const models = require('./index');
const db = require('@ikoala/node-mysql-promise');

const debug = require('debug')('app:model:sms');

exports.createOTPCode = () => {
  let code = randomstring.generate({
    length: 4,
    charset: '0123456789'
  });

  debug('OTP %s ', code);

  return code;
};

exports.send = async function(phonenumber, message) {
  try {
    let accountSid = config.get("TWILIO.accountSid");

    let authToken = config.get("TWILIO.authToken");

    let from = config.get("TWILIO.from");

    if (!accountSid || !authToken || !from) {
      throw new AppError(-10003, 'Invalid SMS settings')
    }

    let client = new Twilio(accountSid, authToken);

    let rs = await client.messages.create({
      body: message,
      to: phonenumber,
      from
    });

    debug('Send phone %s rs %j', phonenumber, rs);
  } catch (error) {
    console.error(error);
  }
};
