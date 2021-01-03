const Event = artifacts.require("Event");
const Ticket = artifacts.require("Ticket");

module.exports = function(deployer) {
  deployer.deploy(Event);
  deployer.deploy(Ticket);
};
