import Web3 from 'web3';
import Ticket from '../abis/Ticket.json';
// import Event from '../../../abis/Event.json';
// import _ from 'lodash';

export class EventAPI {
  constructor() {
    this.contract = {};
    this.web3 = {};
    this.accounts = [];
  }

  getWeb3() {
    return this.web3;
  }

  async init() {
    await this.loadWeb3();
    await this.loadBlockchainData();
  }

  async loadWeb3 () {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
      this.web3 = window.web3;
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
      this.web3 = window.web3;
    }
    else {
      window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  };

  async loadBlockchainData() {
    // Load accountc
    this.accounts = await this.web3.eth.getAccounts();
    const networkId = await this.web3.eth.net.getId()
    const networkData = Ticket.networks[networkId]
    if(networkData) {
      const abi = Ticket.abi;
      const address = networkData.address
      console.log(address)
      this.contract = new this.web3.eth.Contract(abi, address);
    } else {
      window.alert('Smart contract not deployed to detected network.')
    }
  
  }

  async getEvent(eventId) {
    let event = await this.contract.methods.getEvent(eventId).call({from: this.accounts[0]});
    return JSON.parse(event);
  }

  async createEvent(_eventObj) {
    let eventObj = JSON.stringify(_eventObj);
    await this.contract.methods.createEvent(this.accounts[0], eventObj).send({from: this.accounts[0]});
  }

  async testMint() {
    await this.contract.methods.mint(["123"]).send({from: this.accounts[0]}); 
  }

  async getTicketAll() {
    let tickets = [];
    let total = await this.contract.methods.ticketCount.call({from: this.accounts[0]});    
    console.log(this.web3.utils.hexToNumber(total._hex))
    for(let i = 0; i < this.web3.utils.hexToNumber(total._hex); i++) {
      let data = await this.contract.methods.tickets(i).call({from: this.accounts[0]});
      let ticketDetail = JSON.parse(data.ticketDetail);
      ticketDetail = {
        ...ticketDetail,
        eventId: this.web3.utils.hexToNumber(data.eventId._hex)
      }
      tickets.push(ticketDetail)
    }
    
    return tickets;

    let data = await this.contract.methods.tickets(0).call({from: this.accounts[0]});
    let data1 = await this.contract.methods.tickets(1).call({from: this.accounts[0]});
    let data2 = await this.contract.methods.tickets(2).call({from: this.accounts[0]});
    let data3 = await this.contract.methods.tickets(3).call({from: this.accounts[0]});
    let owner = await this.contract.methods.ownerOf(3).call({from: this.accounts[0]});
    console.log('test data', JSON.parse(data.ticketDetail))
    console.log('test data1', JSON.parse(data1.ticketDetail))
    console.log('test data2', JSON.parse(data2.ticketDetail))
    console.log('test data3', JSON.parse(data3.ticketDetail))
    console.log('test owner3', owner)

    return this.contract.methods.tickets(0).call({from: this.accounts[0]}); 
  }

  async createSeats(_seats) {
    console.log(_seats)
    let result = await this.contract.methods.mint(_seats).send({from: this.accounts[0]});
    // console.log('event seat', _seats)
    // _.each(_seats, (val, area) => {
    //   console.log('area', area)
    //   _.each(_seats[area], (val, row) => {
    //     console.log('row', row)
    //     _.each(_seats[area][row], async (val, col) => {
    //       let result = await this.contract.methods.mint(val.area, _.toString(val.row), _.toString(val.col), val.seat).send({from: this.accounts[0]});
    //       console.log(result)
    //     })
    //   })
    // })
    // console.log({_seats})
  }
}
