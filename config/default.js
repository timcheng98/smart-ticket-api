/* eslint-disable */

const path = require('path');

module.exports = {
  "DEBUG": "app:*",
  "DEBUG_MODE": false,
  "STATIC_SERVER_URL": "http://localhost:3000",
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
      "database": "smart_access_api_dev"
    }
  },
  "AUTH": {
    "USERNAME": "",
    "PASSWORD": null
  },
  "EMAIL": {
    "TO": "info@technine.io",
    "FROM": "no-reply@technine.io"
  },
  "SENDGRID_API_KEY": null,
  "TWILIO": {
    "accountSid": "",
    "authToken": "",
    "from": ""
  },
  "FIREBASE": {
    "DATABASE_URL": "",
    "SERVICE_ACCOUNT_FILE": __dirname + "/serviceAccountKey.json"
  },
  "MEDIA": {
    "PUBLIC": path.join(__dirname, "..", "data/public"),
    "PRIVATE": path.join(__dirname, "..", "data/private"),
    "QRCODE": path.join(__dirname, "..", "data/private", "qrcode"), // store controller passcode QR Code
  },
  "PASSCODE_ENCRYPTION_KEY": "D9DF7F6915624B21B0DA5341F0811438",
  "API_PASSCODE_EXPIRY_TIME": 15 * 60, // seconds
};
