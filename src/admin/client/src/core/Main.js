import _ from 'lodash';
import moment from 'moment';
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

export function mergeByKey (arr, subArr, key) {
  return _.each(arr, (item) => {
    _.find(subArr, (subItem) => {
      return item[key] === subItem[key] ? _.assign(item, subItem) : null;
    })
  })
}

export const momentFormat = (unixTime, outputFormat = 'YYYY/MM/DD') => {
  if (unixTime === 0) {
    return '-'
  } 
  return moment.unix(unixTime).format(outputFormat);
}


export const displayStatus = (value) => {
  let displayStr = '';
  let statusValue = _.toInteger(value);
  switch (statusValue) {
    case 1:
      displayStr = "Activate";
      break;
    case 0:
      displayStr = "Disable";
      break;
    default:
      displayStr = "Error"
      break;
  }
  return displayStr;
}