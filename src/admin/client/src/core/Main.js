import _ from 'lodash';
import moment from 'moment';
import axios from 'axios'
// import { connect } from 'react-redux';
// import { bindActionCreators } from 'redux';
import { ActionCreators } from '../redux/actions';
import { getStore } from '../redux/store/configureStore';

// export function getUser() {
//   return getStore().getState().app.user;
// }

// export function getCompany() {
//   return getStore().getState().app.company;
// }

// export function signOut() {
//   localStorage.setItem('user');
//   localStorage.setItem('auth', JSON.stringify(false));
//   localStorage.removeItem('company');
// }

export const LEVEL = {
  ALL: 0,
  STAFF: 1,
  COMPANY: 2,
  ADMIN: 3
};

export function mergeByKey(arr, subArr, key) {
  return _.each(arr, (item) => {
    _.find(subArr, (subItem) => {
      return item[key] === subItem[key] ? _.assign(item, subItem) : null;
    })
  })
}

export async function sha256(message) {
  const msgUint8 = new TextEncoder().encode(message);                           // encode as (utf-8) Uint8Array
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);           // hash the message
  const hashArray = Array.from(new Uint8Array(hashBuffer));                     // convert buffer to byte array
  const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join(''); // convert bytes to hex string
  return hashHex;
}

export function gasFeeToHKD(current_eth, gasUsed) {
  let normal_gas_price_per_gwei = 2;
  let total_cost = gasUsed * normal_gas_price_per_gwei;
  let GWEI_PER_ETH = 1000000000;
  let gas_fee_per_hkd = (current_eth * total_cost) / (GWEI_PER_ETH);
  return _.round(gas_fee_per_hkd, 2);
}