const { EventAPI } = require('./eventClass')


const eventAPI = new EventAPI();

exports.getEventAll = async () => {
  await eventAPI.init();
  let events = await eventAPI.getEventAll()
  return events;
}

exports.createEvent = async (event) => {
  await eventAPI.init();
  return eventAPI.autoSignEventTransaction(event);
}

exports.getTicketAll = async () => {
  await eventAPI.init();
  let tickets = await eventAPI.getTicketAll()
  return tickets;
}

exports.createTicket = async (tickets) => {
  await eventAPI.init();
  let created_tickets = await eventAPI.autoCreateTickets(tickets);
  return created_tickets;
}