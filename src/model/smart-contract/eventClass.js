const Web3 = require('web3');
const Ticket = require('../../admin/client/src/smart-contract/abis/Ticket.json');
const _ = require('lodash');
const config = require('config');


export class EventAPI {
	constructor() {
		this.contract = {};
		this.web3 = {};
		this.accounts = [];
		this.address = '';
		this.default_account = config.get('TRUFFLE.OWNER_ACCOUNT.PUBLIC_KEY');
		this.default_account_private_key = config.get('TRUFFLE.OWNER_ACCOUNT.PRIVATE_KEY');
	}

	getWeb3() {		

		return this.web3;
	}

	async init() {
		// await this.loadWeb3();
		await this.loadRemoteWeb3();
		await this.loadBlockchainData();
		return true
	}

	async loadRemoteWeb3() {
		let web3 = new Web3(config.get('TRUFFLE.ORIGIN'));

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
			console.error('Smart contract not deployed to detected network')
			// window.alert('Smart contract not deployed to detected network.');
		}
	}

	async getEventAll() {
		let events = [];

		let total = await this.contract.methods.getEventId().call({
			from: this.accounts[0],
		});
		console.log('tset event', total)

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
			if(event) {
				return JSON.parse(event);
			}
			return {}
	}

	async ownerOf(eventId) {
		let tickets = await this.getTicketAll();
		let ticketOwner = [];
		let promise = tickets.map(async (val) => {
			let owner = await this.contract.methods
				.ownerOf(val.ticketId)
				.call({ from: this.accounts[0] });
			if (owner === this.accounts[0]) {
				ticketOwner.push(val);
			}
		});
		await Promise.all(promise);

		tickets = _.groupBy(ticketOwner, 'eventId');
		let ticketIdArr = [];
		_.map(tickets, (val, key) => {
			ticketIdArr.push(_.toInteger(key));
		});

		let events = {};
		promise = _.map(ticketIdArr, async (val, key) => {
			let event = await this.getEvent(val);
			events = {
				...events,
				[val]: event,
			};
		});
		await Promise.all(promise);

		let eventArr = [];
		_.each(tickets, (val, key) => {
			let detailObj = {
				total: val.length,
				event: events[key],
			};
			eventArr.push(detailObj);
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

	async testMint() {
		await this.contract.methods.mint(['123']).send({ from: this.accounts[0] });
	}

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
				ticketId:	_.toInteger(data.ticketId),
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

			let ticket_owner = await this.contract.methods.ownerOf(this.web3.utils.hexToNumber(data.ticketId._hex)).call({from: this.accounts[0]});
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
		let total = await this.contract.methods.ticketCount.call({
			from: this.accounts[0],
		});

		let onSellTicketIdArr = [];


		for (let i = 0; i < this.web3.utils.hexToNumber(total._hex); i++) {
			let data = await this.contract.methods
				.tickets(i)
				.call({ from: this.accounts[0] });
			let ticketDetail = JSON.parse(data.ticketDetail);

			let ticket_owner = await this.contract.methods.ownerOf(this.web3.utils.hexToNumber(data.ticketId._hex)).call({from: this.accounts[0]});
			if (ticket_owner === this.default_account && area === ticketDetail.area) {
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

	async autoSignTicketTransaction({tickets, total}) {

		let onSellTicketIdArr = [];
		let onSellTicketCount = 0;
		let promise = tickets.map( async (item) => {
			let ticket_owner = await this.contract.methods.ownerOf(item.ticketId).call({from: this.accounts[0]});
			if (ticket_owner === this.default_account && onSellTicketCount < total) {
				onSellTicketIdArr.push(item.ticketId);
				onSellTicketCount++;
			}
		});

		await Promise.all(promise);
		console.log('onSellTicketArr', onSellTicketIdArr);

		let transaction;
		if (total > 1) {
			transaction = this.contract.methods
			.multiTransferFrom(
				this.default_account,
				this.accounts[0],
				onSellTicketIdArr
			);
		} else {
			let ticketId = onSellTicketIdArr[0];
			transaction = this.contract.methods
			.safeTransferFrom(
				this.default_account,
				this.accounts[0],
				ticketId
			);
		}

		await this.signTransaction(
			transaction,
			(confirmedMessage) => {
				console.log(' ticket confirmedMessage', confirmedMessage);
				// return getStore().dispatch(CommonActions.setEvents(true))
			}
		);
	}

	async autoCreateTickets(_seats) {
		let transaction = this.contract.methods
		.mint(_seats);

		console.log('auto create ticket step 1 data >>>', _seats)
		console.log('auto create ticket step 2 transaction')
		return this.signTransaction(transaction, function(confirmedMessage) {
			console.log(' ticket confirmedMessage', confirmedMessage);
		}); 
	}

	async createSeats(_seats) {
		let result = await this.contract.methods
			.mint(_seats)
			.send({ from: this.accounts[0] });
	}

	async autoSignEventTransaction(_eventObj) {
		let eventObj = JSON.stringify(_eventObj);
		let transaction = this.contract.methods.createEvent(
			this.accounts[0],
			eventObj
    );
	console.log('step 1 -- post data', eventObj)
	console.log('step 2 -- transaction', transaction)
		return this.signTransaction(transaction, function(confirmedMessage) {
			console.log('event confirmedMessage', confirmedMessage)
			// return getStore().dispatch(CommonActions.setEvents(true))
   });
  
	}

	async signTransaction(transaction, cb) {
		// getStore().dispatch(CommonActions.setLoading(true))

		let gas = await transaction.estimateGas({ from: this.default_account });

		console.log('gas', gas)

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

		console.log('sign step 1 -- signedTransaction', signedTransaction)


		await this.web3.eth
			.sendSignedTransaction(signedTransaction.rawTransaction)
			.on('transactionHash', (transactionHash) => {
				console.log('step 2 -- TX Hash: ' + transactionHash);
			})
			.on('confirmation', (confirmationNumber) => {
				console.log('step 3 -- confirmation: ' + confirmationNumber);
				// getStore().dispatch(CommonActions.setLoading(false))
				if (confirmationNumber == 1) {
					cb("Transaction Confirmed");
				}
			})
			.on('error', console.error);
	}
}
