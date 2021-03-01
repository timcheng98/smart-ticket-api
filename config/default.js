/* eslint-disable */

const path = require('path');
const { stringify } = require('querystring');
let ganache_test_account = require('../ganache_test_account.json')

module.exports = {
  "DEBUG": "app:*",
  "DEBUG_MODE": false,
  // "STATIC_SERVER_URL": "http://localhost:3000",
  "STATIC_SERVER_URL": "http://172.16.210.165:3000",
  "API": {
    "PORT": 3000,
    "ORIGIN": "http://localhost:3000",
    "SESSION_SECRET": "abc@123",
    "PASSWORD_SECRET": "abc@123",
    "GA_TRACKING_ID": null,
    "SESSION_TOKEN_EXPIRY": 60 * 60 * 24 * 7, // seconds // 7 days
    "ACCESS_TOKEN_EXPIRY": 60 * 60 * 24, // seconds // 24 hours
    "REQUEST_EXPIRY": 60, // seconds // 60 seconds
  },
  "ADMIN": {
    "PORT": 3001,
    "ORIGIN": "http://localhost:3001",
    "SESSION_SECRET": "abc@123",
    "PASSWORD_SECRET": "abc@123",
    "GA_TRACKING_ID": null,
    "SESSION_EXPIRY": 60 * 60 * 24 * 7, // seconds // 7 days
  },
  "DB": {
    "master": {
      "host": "127.0.0.1",
      "user": "root",
      "password": null,
      "database": "smart_ticket_api_dev"
    }
  },
  "TRUFFLE": {
    "PORT": 7545,
    "HOST": "192.168.2.53",
    "ORIGIN": "http://192.168.2.53:7545",
    "OWNER_ACCOUNT": {
      "PUBLIC_KEY": Object.keys(ganache_test_account.private_keys)[0] || null,
      "PRIVATE_KEY": Object.values(ganache_test_account.private_keys)[0]  || null
    }
  },
  "AUTH": {
    "USERNAME": "",
    "PASSWORD": null
  },
  "EMAIL": {
    "TO": "",
    "FROM": ""
  },
  "SENDGRID_API_KEY": null,
  "TWILIO": {
    "accountSid": "",
    "authToken": "",
    "from": ""
  },
  "FIREBASE": {
    "DATABASE_URL": "",
    "SERVICE_ACCOUNT_FILE": __dirname + ""
  },
  "MEDIA": {
    "PUBLIC": path.join(__dirname, "..", "data/public"),
    "PRIVATE": path.join(__dirname, "..", "data/private"),
    "QRCODE": path.join(__dirname, "..", "data/private", "qrcode"), // store controller passcode QR Code
  },
  "PASSCODE_ENCRYPTION_KEY": "",
  "API_PASSCODE_EXPIRY_TIME": 15 * 60, // seconds
};
