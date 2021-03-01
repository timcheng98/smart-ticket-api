require('babel-register');
require('babel-polyfill');
const config = require('config');
let ganache_test_account = require('./ganache_test_account.json')

module.exports = {
  networks: {
    development: {
      host: '192.168.2.53',
      port: 7545,
      network_id: "*", // Match any network id,
      // from: '0xB817DA6466Be30CDDE56BDB6aF9349D247798900'
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
