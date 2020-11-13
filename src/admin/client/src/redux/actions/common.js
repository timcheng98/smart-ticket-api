import _ from 'lodash';
import * as types from './types';
// import AsyncStorage from '@react-native-community/async-storage';
// import * as Main from '../../core/Main';

export function setConfig(appConfig) {
  return {
    type: types.SET_CONFIG,
    data: appConfig,
  };
}

export function setAdmin(admin) {
  return {
    type: types.SET_ADMIN,
    data: admin
    // data: _.pick(admin, [
    //   'admin_id',
    //   'email',
    //   'mobile',
    //   'level',
    //   'admin_photo',
    //   'admin_role',
    //   'is_active',
    //   'status',
    //   'username',
    //   'nickname'
    // ])
  };
}

export function setCompanyAdmin(company_admin) {
  return {
    type: types.SET_COMPANY_ADMIN,
    data: company_admin
  }
}

export function setAuth(state) {
  return {
    type: types.SET_AUTH,
    data: state
  };
}

export function setOrigin(admin) {
  return {
    type: types.SET_ORIGIN,
    data: admin
  };
}

export function setLoading(loading) {
  return {
    type: types.SET_LOADING,
    data: loading
  };
}

export function setLogoutWay(logoutWay) {
  return {
    type: types.SET_LOGOUTWAY,
    data: logoutWay
  };
}

// export function setCompany(company) {
//   return {
//     type: types.SET_COMPANY,
//     data: company
//   };
// }
