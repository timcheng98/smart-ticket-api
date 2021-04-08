const Web3 = require("web3");
const Ticket = require("../../admin/client/src/smart-contract/abis/Ticket.json");
const _ = require("lodash");
const config = require("config");
const transactionModel = require("./transaction");

const createTransaction = async (obj) => {
  return transactionModel.insertTransaction(obj);
};

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
    let eventAll = await this.getEventAll();

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

    ticketOwner = _.orderBy(ticketOwner, "ticketId");

    tickets = _.groupBy(ticketOwner, "eventId");
    let eventIdMap = _.keyBy(eventAll, "eventId");
    let events = {};
    _.map(tickets, (val, key) => {
      events[key] = eventIdMap[key];
    });

    let eventObj = {};
    _.each(events, (item, key) => {
      eventObj[key] = {
        event: item,
        ticket_own: tickets[key].length,
        tickets: tickets[key],
      };
    });
    return eventObj;
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

  async getTicketOwner(ticketId) {
    let owner = await this.contract.methods
      .ownerOf(ticketId)
      .call({ from: this.accounts[0] });

    return owner;
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

      if (
        ticket_owner === this.default_account &&
        area === ticketDetail.area &&
        ticketDetail.available
      ) {
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

  async buyTicket(user, address, tickets, total) {
    let onSellTicketIdArr = [];
    let onSellTicketCount = 0;
    let sell_tickets = _.slice(tickets, 0, total);
    _.map(sell_tickets, (item) => {
      onSellTicketIdArr.push(item.ticketId);
      onSellTicketCount++;
    });

    let typesArray = [];

    let transaction;
    if (total > 1) {
      transaction = this.contract.methods.multiTransferFrom(
        this.default_account,
        address,
        onSellTicketIdArr
      );

      typesArray = [
        { type: "address", name: "from" },
        { type: "address", name: "to" },
        { type: "uint256[]", name: "tokenId" },
      ];
    } else {
      let ticketId = onSellTicketIdArr[0];
      transaction = this.contract.methods.safeTransferFrom(
        this.default_account,
        address,
        ticketId
      );

      typesArray = [
        { type: "address", name: "from" },
        { type: "address", name: "to" },
        { type: "uint256", name: "tokenId" },
      ];
    }

    await this.signTransaction(
      { ...user, user_address: address },
      transaction,
      (confirmedMessage) => {
        console.log(" ticket confirmedMessage", confirmedMessage);
        // return getStore().dispatch(CommonActions.setEvents(true))
      },
      typesArray
    );
  }

  async getBuyTicketEstimateGass(user, address, tickets, total) {
    let onSellTicketIdArr = [];
    let onSellTicketCount = 0;
    let sell_tickets = _.slice(tickets, 0, total);
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

    const gas = await transaction.estimateGas({ from: this.default_account });
    return { gas };
  }

  async autoCreateTicketsByEvent(user, tickets, eventId) {
    let transaction = this.contract.methods.mintByEvent(tickets, eventId);
    const typesArray = [
      { type: "string[]", name: "_tickets" },
      { type: "uint256", name: "_eventId" },
    ];
    console.log("auto create ticket step 1 data >>>", tickets);
    console.log("auto create ticket step 2 transaction");
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log(" ticket confirmedMessage", confirmedMessage);
      },
      typesArray
    );
  }

  async autoSignEventTransaction(user, _eventObj) {
    let eventObj = JSON.stringify(_eventObj);
    let transaction = this.contract.methods.createEvent(
      this.accounts[0],
      eventObj
    );
    const typesArray = [
      { type: "address", name: "_owner" },
      { type: "string", name: "_detail" },
    ];
    console.log("step 1 -- post data", eventObj);
    // console.log("step 2 -- transaction");
    return this.signTransaction(
      user,
      transaction,
      function (confirmedMessage) {
        console.log("event confirmedMessage", confirmedMessage);
      },
      typesArray
    );
  }

  async getTicketOnMarketplace(ticketId) {
    let address = await this.contract.methods
      .getTicketOnMarketplace(_.toInteger(ticketId))
      .call({ from: this.accounts[0] });
    return address;
  }

  async getTicketOnMarketplaceAll() {
    const ticketCount = await this.contract.methods
      .getMarketplaceTicketId()
      .call({ from: this.accounts[0] });
    if (ticketCount <= 0) return [];
    let tickets = [];
    for (let i = 0; i < ticketCount; i++) {
      let ticket = await this.contract.methods
        .marketplaceTicketList(i)
        .call({ from: this.accounts[0] });
      let address = await this.contract.methods
        .getTicketOnMarketplace(i)
        .call({ from: this.accounts[0] });
        console.log('address', address);

      if (address !== "0x0000000000000000000000000000000000000000") {
        ticket = await this.contract.methods
          .tickets(ticket)
          .call({ from: this.accounts[0] });
        tickets.push({
          ...JSON.parse(ticket.ticketDetail),
          ticketId: _.toInteger(ticket.ticketId),
          eventId: ticket.eventId,
        });
      }
    }

    return tickets;
  }

  async sellTicketsOnMarketplace(user, seller, ticketId) {
    const owner = await this.contract.methods
      .ownerOf(ticketId)
      .call({ from: this.accounts[0] });
    if (seller !== owner) {
      return { status: -1, errorMessage: "Seller is not the ticket owner." };
    }

    const marketplaceTicket = await this.getTicketOnMarketplace(ticketId);
    if (marketplaceTicket !== "0x0000000000000000000000000000000000000000") {
      return { status: -1, errorMessage: "Ticket already on the marketplace." };
    }
    if (marketplaceTicket === seller) {
      return { status: -1, errorMessage: "Ticket already on the marketplace." };
    }
    console.log('marketplaceTicket', marketplaceTicket);
    console.log('seller', seller);
    let transaction = await this.contract.methods.sellTicketsOnMarketplace(
      seller,
      _.toInteger(ticketId)
    );

    const typesArray = [
      { type: "address", name: "target" },
      { type: "uint256", name: "tokenId" },
    ];

    await this.signTransaction(
      { ...user, user_address: seller },
      transaction,
      function (confirmedMessage) {
        console.log("event confirmedMessage", confirmedMessage);
      },
      typesArray
    );
    return { status: 1 };
  }

  async buyTicketOnMarketplace(user, buyer, ticketId) {
    const owner = await this.contract.methods
      .ownerOf(ticketId)
      .call({ from: this.accounts[0] });
    console.log("owner", owner);
    console.log({ buyer, ticketId });
    if (buyer === owner) {
      return { status: -1, errorMessage: "Buyer is the ticket owner." };
    }

    const marketplaceTicket = await this.getTicketOnMarketplace(ticketId);
    if (marketplaceTicket === "0x0000000000000000000000000000000000000000") {
      return { status: -1, errorMessage: "Ticket is not on the marketplace" };
    }
    if (marketplaceTicket === buyer) {
      return { status: -1, errorMessage: "Cannot buy your own ticket" };
    }

    let transaction = await this.contract.methods.buyTicketOnMarketplace(
      buyer,
      _.toInteger(ticketId)
    );

    const typesArray = [
      { type: "address", name: "target" },
      { type: "uint256", name: "tokenId" },
    ];

    await this.signTransaction(
      { ...user, user_address: buyer },
      transaction,
      function (confirmedMessage) {
        console.log("event confirmedMessage", confirmedMessage);
      },
      typesArray
    );
    return { status: 1 };
  }

  async getBuyTicketOnMarketplaceEstimateGas(user, buyer, ticketId) {
    const owner = await this.contract.methods
      .ownerOf(ticketId)
      .call({ from: this.accounts[0] });
    console.log("owner", owner);
    console.log({ buyer, ticketId });
    if (buyer === owner) {
      return { status: -1, errorMessage: "Buyer is the ticket owner." };
    }

    const marketplaceTicket = await this.getTicketOnMarketplace(ticketId);
    if (marketplaceTicket === "0x0000000000000000000000000000000000000000") {
      return { status: -1, errorMessage: "Ticket is not on the marketplace" };
    }
    if (marketplaceTicket === buyer) {
      return { status: -1, errorMessage: "Cannot buy your own ticket" };
    }

    let transaction = await this.contract.methods.buyTicketOnMarketplace(
      buyer,
      _.toInteger(ticketId)
    );
    const gas = await transaction.estimateGas({ from: this.default_account });
    return { gas };
  }

  async signTransaction(user, transaction, cb, typesArray) {
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

    console.log("typesArray", typesArray);

    await this.web3.eth
      .sendSignedTransaction(signedTransaction.rawTransaction)
      .on("transactionHash", (transactionHash) => {
        console.log("step 2 -- TX Hash: " + transactionHash);
      })
      .on("confirmation", async (confirmationNumber, data) => {
        console.log("step 3 -- confirmation: " + confirmationNumber);

        if (confirmationNumber <= 2) {
          await transactionModel.updateTransactionByTxnHash(
            data.transactionHash,
            {
              confirm_block: confirmationNumber,
            }
          );
        }
        if (confirmationNumber === 2) {
          // await createTransaction(obj);
          cb("Transaction Confirmed");
        }
      })
      .on("receipt", async (receipt) => {
        console.log("receipt", receipt);
        const decodedParameters = await this.web3.eth.abi.decodeParameters(
          typesArray,
          receipt.logs[receipt.logs.length - 1].data
        );
        console.log("decodedParameters", decodedParameters);
        const obj = {
          block_hash: receipt.blockHash,
          block_number: receipt.blockNumber,
          transaction_hash: receipt.transactionHash,
          transaction_index: receipt.transactionIndex,
          sender: receipt.from,
          receiver: receipt.to,
          status: receipt.status ? 1 : 0,
          contract_address: this.address,
          cumulative_gas_used: receipt.cumulativeGasUsed,
          gas_used: receipt.gasUsed,
          logs: JSON.stringify(receipt.logs),
          user_address: "",
          event: JSON.stringify(decodedParameters),
          confirm_block: 0,
          ...user,
        };
        console.log("data", obj);
        await createTransaction(obj);
      })
      .on("error", console.error);
  }
}
