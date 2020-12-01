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

export function setIsAdmin(admin) {
  let is_admin = {
    admin: false,
    company_admin: false,
    admin_id: 0
  }

  if (admin.role === 1 && admin.admin_id > 0) {
    is_admin.admin = true;
    is_admin.admin_id = admin.admin_id;
  }

  if (admin.role === 2 && admin.admin_id > 0) {
    is_admin.company_admin = true;
    is_admin.admin_id = admin.admin_id;
  }

  return {
    type: types.SET_IS_ADMIN,
    data: is_admin
  }
}

export function setAdmin(admin) {
  setIsAdmin(admin);
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
  setIsAdmin(company_admin);
  console.log('company_admin', company_admin)
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
