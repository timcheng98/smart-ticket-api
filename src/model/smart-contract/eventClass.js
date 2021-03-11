const Web3 = require("web3");
const Ticket = require("../../admin/client/src/smart-contract/abis/Ticket.json");
const _ = require("lodash");
const config = require("config");

export class EventAPI {
  constructor() {
    this.contract = {};
    this.web3 = {};
    this.accounts = [];
    this.address = "";
    this.default_account = config.get("TRUFFLE.OWNER_ACCOUNT.PUBLIC_KEY");
    this.default_account_private_key = config.get(
      "TRUFFLE.OWNER_ACCOUNT.PRIVATE_KEY"
    );
  }

  getWeb3() {
    return this.web3;
  }

  async init() {
    // await this.loadWeb3();
    await this.loadRemoteWeb3();
    await this.loadBlockchainData();
    return true;
  }

  async loadRemoteWeb3() {
    let web3 = new Web3(config.get("TRUFFLE.ORIGIN"));

    this.web3 = web3;
  }

  async loadBlockchainData() {
    // Load accountc
    this.accounts = await this.web3.eth.getAccounts();
    const networkId = await this.web3.eth.net.getId();
    const networkData = Ticket.networks[networkId];
    if (networkData) {
      const abi = Ticket.abi;
      const address = networkData.address;
      this.address = address;

      this.contract = new this.web3.eth.Contract(abi, address);
    } else {
      console.error("Smart contract not deployed to detected network");
      // window.alert('Smart contract not deployed to detected network.');
    }
  }

  async createAccount() {
    const account = await this.web3.eth.accounts.create();
    return account;
  }

  async decryptAccount(keystoreJsonV3, password) {
    const account = await this.web3.eth.accounts.decrypt(
      keystoreJsonV3,
      password
    );
    return account;
  }

  async getEventAll() {
    let events = [];

    let total = await this.contract.methods.getEventId().call({
      from: this.accounts[0],
    });
    console.log("tset event", total);

    if (!total) return [];

    for (let i = 0; i < total; i++) {
      let data = await this.contract.methods
        .events(i)
        .call({ from: this.accounts[0] });
      let eventDetail = JSON.parse(data.detail);
      eventDetail = {
        ...eventDetail,
        eventId: i,
      };
      events.push(eventDetail);
    }
    return events;
  }

  async getEvent(eventId) {
    let event = await this.contract.methods
      .getEvent(eventId)
      .call({ from: this.accounts[0] });
    if (event) {
      return JSON.parse(event);
    }
    return {};
  }

  async getOwnerTicket(address) {
    let tickets = await this.getTicketAll();
    // console.log('tickets', tickets)
    // console.log('address', address)
    let ticketOwner = [];
    let promise = _.map(tickets, async (val) => {
      let owner = await this.contract.methods
        .ownerOf(val.ticketId)
        .call({ from: this.accounts[0] });
      if (owner === address) {
        ticketOwner.push(val);
      }


    });


    await Promise.all(promise);
    // console.log(ticketOwner)

    tickets = _.groupBy(ticketOwner, "eventId");
    let ticketIdArr = [];
    _.map(tickets, (val, key) => {
      ticketIdArr.push(_.toInteger(key));
    });

    let events = {};
    promise = _.map(ticketIdArr, async (val, key) => {
      let event = await this.getEvent(val);
      events = {
        ...events,
        [val]: {...event, eventId: val},
      };
    });
    await Promise.all(promise);

    let eventArr = {};
    _.each(events, (event, key) => {
      let detailObj = {
        event,
        ticket_own: ticketOwner.length,
        tickets: ticketOwner,
      };
      eventArr = {
        ...eventArr,
        [event.eventId]: detailObj
      }
      // eventArr.push();
    });
    return eventArr;
  }

  async createEvent(_eventObj) {
    let eventObj = JSON.stringify(_eventObj);
    let result = await this.contract.methods
      .createEvent(this.accounts[0], eventObj)
      .send({ from: this.accounts[0] });
    return result;
  }

  // async testMint() {
  //   await this.contract.methods.mint(["123"]).send({ from: this.accounts[0] });
  // }

  async getTicketAll() {
    let tickets = [];

    let total = await this.contract.methods.totalSupply().call({
      from: this.accounts[0],
    });

    for (let i = 0; i < total; i++) {
      let data = await this.contract.methods
        .tickets(i)
        .call({ from: this.accounts[0] });
      let ticketDetail = JSON.parse(data.ticketDetail);
      ticketDetail = {
        ...ticketDetail,
        eventId: _.toInteger(data.eventId),
        ticketId: _.toInteger(data.ticketId),
      };
      tickets.push(ticketDetail);
    }

    return tickets;
  }

  async getOnSellTicketsAll(type) {
    let total = await this.contract.methods.ticketCount.call({
      from: this.accounts[0],
    });

    let onSellTicketIdArr = [];

    for (let i = 0; i < this.web3.utils.hexToNumber(total._hex); i++) {
      let data = await this.contract.methods
        .tickets(i)
        .call({ from: this.accounts[0] });
      let ticketDetail = JSON.parse(data.ticketDetail);

      let ticket_owner = await this.contract.methods
        .ownerOf(this.web3.utils.hexToNumber(data.ticketId._hex))
        .call({ from: this.accounts[0] });
      if (ticket_owner === this.default_account) {
        ticketDetail = {
          ...ticketDetail,
          eventId: this.web3.utils.hexToNumber(data.eventId._hex),
          ticketId: this.web3.utils.hexToNumber(data.ticketId._hex),
        };
        onSellTicketIdArr.push(ticketDetail);
      }
    }

    return onSellTicketIdArr;
  }

  async getOnSellTicketsByArea(area) {
    let total = await this.contract.methods.totalSupply().call({
      from: this.accounts[0],
    });

    let onSellTicketIdArr = [];

    for (let i = 0; i < total; i++) {
      let data = await this.contract.methods
        .tickets(i)
        .call({ from: this.accounts[0] });

      let ticketDetail = JSON.parse(data.ticketDetail);

      let ticket_owner = await this.contract.methods
        .ownerOf(data.ticketId)
        .call({ from: this.accounts[0] });

      if (ticket_owner === this.default_account && area === ticketDetail.area && ticketDetail.available) {
        ticketDetail = {
          ...ticketDetail,
          eventId: data.eventId,
          ticketId: data.ticketId,
        };
        onSellTicketIdArr.push(ticketDetail);
      }
    }

    return onSellTicketIdArr;
  }

  async buyTicket(address, tickets, total) {
    let onSellTicketIdArr = [];
    let onSellTicketCount = 0;
    let sell_tickets = _.slice(tickets, 0, total)
    _.map(sell_tickets, (item) => {
      onSellTicketIdArr.push(item.ticketId);
      onSellTicketCount++;
    });

    let transaction;
    if (total > 1) {
      transaction = this.contract.methods.multiTransferFrom(
        this.default_account,
        address,
        onSellTicketIdArr
      );
    } else {
      let ticketId = onSellTicketIdArr[0];
      transaction = this.contract.methods.safeTransferFrom(
        this.default_account,
        address,
        ticketId
      );
    }

    await this.signTransaction(transaction, (confirmedMessage) => {
      console.log(" ticket confirmedMessage", confirmedMessage);
      // return getStore().dispatch(CommonActions.setEvents(true))
    });
  }

  async autoCreateTickets(_seats) {
    let transaction = this.contract.methods.mint(_seats);

    console.log("auto create ticket step 1 data >>>", _seats);
    console.log("auto create ticket step 2 transaction");
    return this.signTransaction(transaction, function (confirmedMessage) {
      console.log(" ticket confirmedMessage", confirmedMessage);
    });
  }

  async autoSignEventTransaction(_eventObj) {
    let eventObj = JSON.stringify(_eventObj);
    let transaction = this.contract.methods.createEvent(
      this.accounts[0],
      eventObj
    );
    console.log("step 1 -- post data", eventObj);
    // console.log("step 2 -- transaction");
    return this.signTransaction(transaction, function (confirmedMessage) {
      console.log("event confirmedMessage", confirmedMessage);
    });
  }

  async getTicketOnMarketplace(ticketId) {
    let address = await this.contract.methods.getTicketOnMarketplace(
      _.toInteger(ticketId)
    ).call({ from: this.accounts[0] });
    return address;
  }

  async sellTicketsOnMarketplace(seller, ticketId) {
    const owner = await this.contract.methods.ownerOf(ticketId).call({ from: this.accounts[0] })
    if (seller !== owner) {
      return { status: -1, errorMessage: 'Seller is not the ticket owner.' };
    }

    const marketplaceTicket = await this.getTicketOnMarketplace(ticketId);
    if (marketplaceTicket !== '0x0000000000000000000000000000000000000000' && marketplaceTicket === seller) {
      return { status: -1, errorMessage: 'Ticket already on the marketplace.' }
    }

    let transaction = await this.contract.methods.sellTicketsOnMarketplace(
      seller,
      _.toInteger(ticketId)
    );

    await this.signTransaction(transaction, function (confirmedMessage) {
      console.log("event confirmedMessage", confirmedMessage);
    });
    return { status: 1 }
  }

  async signTransaction(transaction, cb) {

    let gas = await transaction.estimateGas({ from: this.default_account });

    let nonce = await this.web3.eth.getTransactionCount(this.default_account);

    let options = {
      to: this.address,
      data: transaction.encodeABI(),
      gas,
      nonce,
    };


    let signedTransaction = await this.web3.eth.accounts.signTransaction(
      options,
      this.default_account_private_key
    );

    console.log("sign step 1 -- signedTransaction", signedTransaction);

    await this.web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .on("transactionHash", (transactionHash) => {
        console.log("step 2 -- TX Hash: " + transactionHash);
      })
      .on("confirmation", (confirmationNumber) => {
        console.log("step 3 -- confirmation: " + confirmationNumber);
        if (confirmationNumber >= 24) {
          cb("Transaction Confirmed");
        }
      })
      .on("error", console.error);
    // .on('receipt', (receipt) => console.log('tsest', receipt))
  }
}
