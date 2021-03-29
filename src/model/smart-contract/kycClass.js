const Web3 = require("web3");
const Ticket = require("../../admin/client/src/smart-contract/abis/Kyc.json");
const _ = require("lodash");
const config = require("config");
const transactionModel = require('./transaction');

const createTransaction = async (obj) => {
  return transactionModel.insertTransaction(obj)
}

export class KycAPI {
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

  async createUserCredential(user, id, hashHex) {
    const transaction = this.contract.methods.validateUser(id, hashHex);
    return this.signTransaction(user, transaction, function (confirmedMessage) {
      console.log(" user credential confirmedMessage", confirmedMessage);
    });
  }

  async verifyUserCredential(id, hashHex) {
    return this.contract.methods.verifyUser(id, hashHex);
  }

  async getTotalUserCount() {
    return this.contract.methods.getTotalUserCount();
  }

  async getTotalUser(ids) {
    return this.contract.methods.getTotalUser(ids);
  }

  async getUser(id) {
    return this.contract.methods.getUser(id);
  }

  async renewUserCredential(id) {
    return this.contract.methods.renewUser(id);
  }

  async burnUserCredential(id) {
    return this.contract.methods.burnUser(id);
  }

  async createCompanyCredential(user, id, hashHex) {
    const transaction = this.contract.methods.validateCompany(id, hashHex);
    return this.signTransaction(user, transaction, function (confirmedMessage) {
      console.log(" Company credential confirmedMessage", confirmedMessage);
    });
  }

  async verifyCompanyCredential(id, hashHex) {
    return this.contract.methods.verifyCompany(id, hashHex);
  }

  async getTotalCompanyCount() {
    return this.contract.methods.getTotalCompanyCount();
  }

  async getTotalCompany(ids) {
    return this.contract.methods.getTotalCompany(ids);
  }

  async getCompany(id) {
    return this.contract.methods.getCompany(id);
  }

  async renewCompanyCredential(id) {
    return this.contract.methods.renewCompany(id);
  }

  async burnCompanyCredential(id) {
    return this.contract.methods.burnCompany(id);
  }

  async signTransaction(user, transaction, cb) {

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
      .on('receipt', async (receipt) => {
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
          user_address: '',
          ...user
        }

        await createTransaction(obj)
      })
      .on("error", console.error);
  }
}