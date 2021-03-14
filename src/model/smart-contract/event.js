const { EventAPI } = require('./eventClass')


const eventAPI = new EventAPI();

exports.createAccount = async () => {
  await eventAPI.init();
  let account = await eventAPI.createAccount()

  return account;
}

exports.decryptAccount = async (keystoreJsonV3, password) => {
  await eventAPI.init();
  console.log('keystoreJsonV3, password', password)
  let account = await eventAPI.decryptAccount(keystoreJsonV3, password)

  return account;
}

exports.getEventAll = async () => {
  await eventAPI.init();
  let events = await eventAPI.getEventAll()

  return events;
}


exports.createEvent = async (event) => {
  await eventAPI.init();
  return eventAPI.autoSignEventTransaction(event);
}

exports.createTicket = async (tickets) => {
  await eventAPI.init();
  let created_tickets = await eventAPI.autoCreateTickets(tickets);
  return created_tickets;
}

exports.getTicketAll = async () => {
  await eventAPI.init();
  let tickets = await eventAPI.getTicketAll()
  return tickets;
}

exports.getOwnerTicket = async (address) => {
  await eventAPI.init();
  let tickets = await eventAPI.getOwnerTicket(address)

  return tickets;
}

exports.getOnSellTicketsByArea = async (selectedArea) => {
  await eventAPI.init();
  let tickets = await eventAPI.getOnSellTicketsByArea(selectedArea)
  return tickets;
}

exports.buyTicket = async (address, tickets, total) => {
  await eventAPI.init();
  let result = await eventAPI.buyTicket(address, tickets, total)
  return result;
}


exports.sellTicketsOnMarketplace = async (seller, ticket_id) => {
  await eventAPI.init();
  let result = await eventAPI.sellTicketsOnMarketplace(seller, ticket_id)
  return result;
}

exports.buyTicketOnMarketplace = async (buyer, ticket_id) => {
  await eventAPI.init();
  let result = await eventAPI.buyTicketOnMarketplace(buyer, ticket_id)
  return result;
}

exports.getTicketOnMarketplaceAll = async () => {
  await eventAPI.init();
  let result = await eventAPI.getTicketOnMarketplaceAll()
  return result;
}