const crypto = require('crypto');
const cryptoHelper = require('../lib/crypto-helper');

const ALGORITHM = 'aes-256-cbc';

/**
 * Encrypt a string
 * @param {string} encryptionKey Raw key used by algorithm
 * @param {string} dataString Data string to be encrypted
 */
const encryptString = (encryptionKey, dataString) => {
  if (encryptionKey.length !== 32) {
    // Encryption Key must be 32 characters
    encryptionKey = cryptoHelper.md5(encryptionKey);
  }
  let iv = crypto.randomBytes(16);
  let cipher = crypto.createCipheriv(ALGORITHM, Buffer.from(encryptionKey), iv);
  let encrypted = cipher.update(dataString, 'utf8', 'hex') + cipher.final('hex');
  encrypted = `${iv.toString('hex')}:${encrypted}`;
  return encrypted;
};
exports.encryptString = encryptString;

/**
 * Decrypt a data string encrypted by encrypt method
 * @param {string} encryptionKey Raw key used by algorithm
 * @param {string} encrypted Encryped string
 */
const decryptString = (encryptionKey, encrypted) => {
  if (encryptionKey.length !== 32) {
    // Encryption Key must be 32 characters
    encryptionKey = cryptoHelper.md5(encryptionKey);
  }
  let textParts = encrypted.split(':');
  let iv = Buffer.from(textParts.shift(), 'hex');
  let encryptedBuffer = Buffer.from(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv(ALGORITHM, encryptionKey, iv);
  let decrypted = decipher.update(encryptedBuffer, 'hex', 'utf8') + decipher.final('utf8');
  return decrypted;
};
exports.decryptString = decryptString;
