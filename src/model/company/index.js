const companyUserModel = require('./user');
const companyAdminModel = require('./admin');
const companyModel = require('./company');
const doorModel = require('./door');

exports.user = companyUserModel;
exports.admin = companyAdminModel;
exports.company = companyModel;
exports.door = doorModel;
