const _ = require('lodash');
const moment = require('moment');
const model = require('./index');
const db = require('@ikoala/node-mysql-promise');

const TABLES = {
  Upload: ['media_upload', 'media_upload_id'],
}

_.each(TABLES, (val, key) => {
  const [tbl, id] = val;
  exports[`select${key}`] = model.createSelect(tbl, id);
  exports[`insert${key}`] = model.createInsert(tbl, id);
  exports[`update${key}`] = model.createUpdate(tbl, id);
})
