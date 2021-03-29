const _ = require('lodash');
const uuid = require('uuid');
const shortid = require('shortid');
const moment = require('moment');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const eventModel = require('../../model/smart-contract/event');
const middleware = require('./middleware');
const { DefaultAzureCredential } = require("@azure/identity");
const { SecretClient } = require("@azure/keyvault-secrets");
const debug = require('debug')(`app:event`);

const ERROR_CODE = {

};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());

    router.get('/api/sc/event', getEventAll);
    router.get('/api/sc/event/single', getEvent);
    router.post('/api/sc/event', createEvent);
    router.get('/api/sc/event/ticket', getTicketAll);
    router.get('/api/sc/event/ticket/owner/single', getTicketOwner);
    router.post('/api/sc/event/ticket', createTicket);
    router.post('/api/sc/event/ticket/onsell', getOnSellTicketsByArea);
    router.post('/api/sc/event/ticket/buy', buyTicket);
    router.post('/api/sc/event/ticket/owner', getOwnerTickets);
    router.get('/api/sc/event/ticket/marketplace', getTicketOnMarketplaceAll);
    router.post('/api/sc/event/ticket/marketplace/sell', sellTicketsOnMarketplace);
    router.post('/api/sc/event/ticket/marketplace/buy', buyTicketOnMarketplace);
    // router.get('/api/sc/event/secret', getSecret);

  }
};

const getEventAll = async (req, res) => {
  try {
    let result = await eventModel.getEventAll();
    // result = _.keyBy(result, 'event_id')
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
    let result = await eventModel.getEvent(req.query.eventId);
    // result = _.keyBy(result, 'event_id')
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
    await eventModel.createEvent(req.user, req.body.event);
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


const getTicketOwner = async (req, res) => {
  try {
    let result = await eventModel.getTicketOwner(req.query.ticketId);
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getOwnerTickets = async (req, res) => {
  try {
    let result = await eventModel.getOwnerTicket(req.body.address);
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getOnSellTicketsByArea = async (req, res) => {
  try {
    let result = await eventModel.getOnSellTicketsByArea(req.body.selectedArea);
    res.apiResponse({
      status: 1,
      result
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const buyTicket = async (req, res) => {
  try {
    let result = await eventModel.buyTicket(req.user, req.body.address, req.body.tickets, req.body.total);
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

    await eventModel.createTicket(req.user, tickets);
    res.apiResponse({
      status: 1
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const sellTicketsOnMarketplace = async (req, res) => {
  try {
    let { ticketId, seller } = req.body;
    if (!_.isInteger(ticketId)) {
      return res.apiResponse({
        status: -1
      });
    }

    let result = await eventModel.sellTicketsOnMarketplace(req.user, seller, ticketId);
    if (result.status === -1) {
      return res.apiResponse({
        status: -1,
        errorMessage: result.errorMessage
      });
    }
    res.apiResponse({
      status: 1
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const buyTicketOnMarketplace = async (req, res) => {
  try {
    let { ticketId, buyer } = req.body;
    if (!_.isInteger(ticketId)) {
      return res.apiResponse({
        status: -1
      });
    }
    let result = await eventModel.buyTicketOnMarketplace(req.user, buyer, ticketId);
    if (result.status === -1) {
      return res.apiResponse({
        status: -1,
        errorMessage: result.errorMessage
      });
    }
    res.apiResponse({
      status: 1
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getTicketOnMarketplaceAll = async (req, res) => {
  try {
    let { ticketId } = req.query;
    if (!_.isInteger(_.toInteger(ticketId))) {
      return res.apiResponse({
        status: -1
      });
    }

    let address = await eventModel.getTicketOnMarketplaceAll();
    res.apiResponse({
      status: 1,
      result: address
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const getSecret = async (req, res) => {
  try {
    const keyVaultName = process.env["KEY_VAULT_NAME"];
    const KVUri = "https://" + keyVaultName + ".vault.azure.net";

    const credential = new DefaultAzureCredential();
    const client = new SecretClient(KVUri, credential);
    
    // console.log();
    res.apiResponse({keyVaultName, KVUri, credential, client})
  } catch (error) {
    console.error(error);
    res.apiError(error)
  }
}