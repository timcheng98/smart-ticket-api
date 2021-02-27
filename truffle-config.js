require('babel-register');
require('babel-polyfill');
const config = require('config');

module.exports = {
  networks: {
    development: {
      host: config.get('TRUFFLE.HOST'),
      port: config.get('TRUFFLE.PORT'),
      network_id: "*", // Match any network id,
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
