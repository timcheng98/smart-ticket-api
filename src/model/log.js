const _ = require('lodash');
const moment = require('moment');
const db = require('@ikoala/node-mysql-promise');

const TABLES = {
  DriverTokens: ['log_driver_tokens', 'log_id'],
}

_.each(TABLES, (val, key) => {
  const [tbl, id] = val;
  // exports[`select${key}`] = model.createSelect(tbl, id);
  exports[`insert${key}`] = db.helper.createInsert(tbl, id, {
    defaults: {
      ctime: () => moment().unix()
    }
  });
})
