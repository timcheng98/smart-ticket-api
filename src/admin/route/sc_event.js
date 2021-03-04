const _ = require('lodash');
const uuid = require('uuid');
const shortid = require('shortid');
const moment = require('moment');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const eventModel = require('../../model/smart-contract/event');
const middleware = require('./middleware');

const debug = require('debug')(`app:event`);

const ERROR_CODE = {

};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());

    router.get('/api/sc/event', getEventAll);
    router.post('/api/sc/event', createEvent);
    router.get('/api/sc/event/ticket', getTicketAll);
    router.post('/api/sc/event/ticket', createTicket);


  }
};

const getEventAll = async (req, res) => {
  try {
    let result = await eventModel.getEventAll();
    result = _.keyBy(result, 'event_id')
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const createEvent = async (req, res) => {
  try {
    if (_.isEmpty(req.body.event)) {
      return res.apiResponse({
        status: -1
      });
    }
    await eventModel.createEvent(req.body.event);
    res.apiResponse({
      status: 1
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getTicketAll = async (req, res) => {
  try {
    let result = await eventModel.getTicketAll();
    result = _.groupBy(result, 'eventId')
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const createTicket = async (req, res) => {
  try {
    let { tickets } = req.body;
    if (!_.isArray(tickets)) {
      return res.apiResponse({
        status: -1
      });
    }

    await eventModel.createTicket(tickets);
    res.apiResponse({
      status: 1
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

