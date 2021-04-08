const models = require('../index');
const db = require('@ikoala/node-mysql-promise');

const TABLE = {
  transaction: 'transaction',
  // admin_role: 'admin_role'
};

exports.selectTransaction = models.createSelect('transaction', 'transaction_id');
exports.updateTransaction = models.createUpdate('transaction', 'transaction_id');
exports.updateTransactionByTxnHash = models.createUpdate('transaction', 'transaction_hash');
exports.insertTransaction = models.createInsert('transaction', 'transaction_id');
