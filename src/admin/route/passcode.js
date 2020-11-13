const fs = require('fs');
const path = require('path');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
// const model = require('../../model');
const controllerModel = require('../../model/controller');
const middleware = require('./middleware');

const ERROR_CODE = {
  // [-40001]: 'Invalid user account'
};
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/passcode', middleware.session.authorize());
    router.get('/api/passcode/qrcode', getPasscodeQRCode);
  }
};

const getPasscodeQRCode = async (req, res) => {
  try {
    const passcode = _.toString(req.query.passcode);

    const [controllerPasscode] = await controllerModel.selectPasscode({
      where: {
        passcode,
      },
    });

    // const filename = `${passcode}.png`;
    // const filepath = path.join(config.get('MEDIA.QRCODE'), filename);

    let qrcodeData = await controllerModel.createQRCode(controllerPasscode);

    res.sendFile(qrcodeData.filepath);
  } catch (err) {
    // res.apiError(err);
    console.error(err);
    res.sendStatus(500);
  }
};
