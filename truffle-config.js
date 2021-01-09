require('babel-register');
require('babel-polyfill');

module.exports = {
  networks: {
    development: {
      host: "172.16.210.165",
      port: 7545,
      network_id: "*", // Match any network id
    }
  },
  contracts_directory: './src/admin/client/src/smart-contract/contracts/',
  contracts_build_directory: './src/admin/client/src/smart-contract/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
