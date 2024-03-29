/* eslint-disable */

const path = require('path');

module.exports = {
  "DEBUG": "app:*",
  "DEBUG_MODE": false,
  // "STATIC_SERVER_URL": "http://localhost:3000",
  "STATIC_SERVER_URL": "http://localhost:3001",
  "TICKET_VERIFY_URL": "http://localhost:3002",
  "BLOCKCHAIN_BASE_URL": "http://localhost:4001/",
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
    "HOST": "165.22.251.49",
    "ORIGIN": "http://165.22.251.49:7545",
    "OWNER_ACCOUNT": {
      "PUBLIC_KEY": "0x19EE78BAC3D3b2f9f6c6d162f4347f763021C038",
      "PRIVATE_KEY": "0x999da71ecd57b14e49e398c7ff3f737295e5f85df17961fc22769fa15eae4089"
    }
  },
  "AUTH": {
    "USERNAME": "",
    "PASSWORD": null
  },
  "MEDIA": {
    "PUBLIC": path.join(__dirname, "..", "data/public"),
    "PRIVATE": path.join(__dirname, "..", "data/private"),
    "QRCODE": path.join(__dirname, "..", "data/private", "qrcode"), 
  },
};
