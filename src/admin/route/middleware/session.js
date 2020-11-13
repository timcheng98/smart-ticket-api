const _ = require('lodash');
const AppError = require('../../../lib/app-error');
const model = require('../../../model');

const debug = require('debug')(`app:admin:route:middleware:session`);

const ERROR_CODE = {
  [-101]: 'invalid session'
};

AppError.setErrorCode(ERROR_CODE);

let context = '';

exports.init = (_context) => {
  context = _context;
};

exports.get = (_opts) => {
  return async (req, res, next) => {
    try {
      debug(`session.get()`);

      let opts = _opts || {};

      // debug(`session.get() :: `, req.session);

      next();
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  };
};

/**
 * Auothorization to protect private webpages
 * @param  {object} opts [description]
 * @return {[type]}      [description]
 */
exports.authorize = function(_opts) {
  return async (req, res, next) => {
    try {
      debug(`authorize()`);

      let opts = _opts || {};
      if (req.isAuthenticated()) {
        next();
      } else {
        res.apiError(new AppError(-101));
        // res.sendStatus(401);
      }
    } catch (err) {
      console.error(err);
      res.sendStatus(500);
    }
  };
};
