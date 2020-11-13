const controllerModel = require('../model/controller');

const TAG = 'WebsocketController';
const debug = require('debug')('app:websocket-controller');

const connectionPool = {};

exports.authorize = async (access_token) => {
  try {
    const [controllerDevice] = await controllerModel.selectDevice({
      where: {
        access_token,
      },
    });

    if (!controllerDevice) {
      throw new Error('failed to register websocket connection, invalid conntroller device');
    }

    const {
      controller_device_id,
      controller_name,
    } = controllerDevice;

    return {
      controller_device_id,
      controller_name,
      access_token,
    };
  } catch (err) {
    console.error(err);
  }

  return null;
};

exports.registerConnection = async (controllerSession, ws) => {
  exports.unregisterConnection(controllerSession);

  connectionPool[controllerSession.access_token] = ws;

  debug(`#registerConnection :: number of websocket connection :: `, Object.keys(connectionPool).length);
};

exports.unregisterConnection = (controllerSession) => {
  delete connectionPool[controllerSession.access_token];

  debug(`#unregisterConnection :: number of websocket connection :: `, Object.keys(connectionPool).length);
};

exports.sendCommandToController = (access_token, command) => {
  try {
    const ws = connectionPool[access_token];
    if (!ws) {
      console.warn(`${TAG} :: #sendCommandToController failed :: conntroller not connected :: ${access_token}`);
      return false;
    }

    ws.send(JSON.stringify(command));

    return true;
  } catch (err) {
    console.error(err);
  }

  return false;
};
