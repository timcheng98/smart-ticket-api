require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "172.16.210.165",
      port: 7545,
      network_id: "*", // Match any network id
      websockets: true,
      gas: 4698712,
      gasPrice: 25000000000
    }
  },
  contracts_directory: './src/smart-contract/contracts/',
  contracts_build_directory: './src/smart-contract/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
