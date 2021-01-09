const _ = require('lodash');
const uuid = require('uuid');
const shortid = require('shortid');
const moment = require('moment');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const eventModel = require('../../model/event');
const middleware = require('./middleware');

const debug = require('debug')(`app:event`);

const ERROR_CODE = {

};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    router.use('/api/event', middleware.session.authorize());

    router.get('/api/event/all', getEventAll);
    router.get('/api/event', getEvent);
    router.post('/api/event', postEvent);
    router.patch('/api/event', patchEvent);
    router.patch('/api/admin/event', patchEventByAdmin);

  }
};

const getEventAll = async (req, res) => {
  try {
    let result = await eventModel.selectEvent({all: true});

    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;

    let eventRc = await eventModel.selectEvent(admin_id);
    console.log('event', eventRc);

    res.apiResponse({
      status: 1,
      eventRc
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const postEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;
    let postObj = {
      ...req.body,
      admin_account_id: admin_id,
      start_time: moment(req.body.start_time).unix(),
      end_time: moment(req.body.end_time).unix(),
      released_date: moment(req.body.released_date).unix(),
      close_date: moment(req.body.close_date).unix(),
      event_code: shortid.generate().replace(/-/g, ''),
      country: '',
      region: '',
      location: '',
      address: '',
      status: 0, // draft
      issued_tickets: 0,
      type: 0
    };
    delete postObj.start_end_time;
    delete postObj.released_close_date;

    console.log(postObj);

    let eventRC = await eventModel.insertEvent(postObj);

    res.apiResponse({
      status: 1,
      eventRC
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const patchEvent = async (req, res) => {
  try {
    let { admin_id } = req.user;
    let postData = {}

    _.each(_.pick(req.body, [
      'name','country', 'region', 'location', 'address', 'short_desc',
      'long_desc', 'approval_doc', 'seat_doc', 'reject_reason'
    ]), (val, key) => {
      postData[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'status',  'need_kyc', 'is_seat_doc_verified', 'is_approval_doc_verified'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });

    _.each(_.pick(req.body, [
      'released_date', 'close_date', 'start_time', 'end_time'
    ]), (val, key) => {
      postData[key] = _.toInteger(moment(val).unix());
    });
    let [eventRC] = await eventModel.updateEvent(admin_id, postData);

    res.apiResponse({
      status: 1,
      eventRC
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const patchEventByAdmin = async (req, res) => {
  try {
    let postData = {}

    // _.each(_.pick(req.body, [
    //   'name','country', 'region', 'location', 'address', 'short_desc',
    //   'long_desc', 'approval_doc', 'seat_doc', 'reject_reason'
    // ]), (val, key) => {
    //   postData[key] = _.toString(val);
    // });

    // _.each(_.pick(req.body, [
    //   'released_date', 'close_date', 'start_time', 'end_time'
    // ]), (val, key) => {
    //   postData[key] = _.toInteger(moment(val).unix());
    // });

    _.each(_.pick(req.body, [
      'status', 'is_seat_doc_verified', 'is_approval_doc_verified', 'admin_id'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });

    let [eventRC] = await eventModel.updateEvent(postData.admin_id, postData);

    res.apiResponse({
      status: 1,
      eventRC
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}


