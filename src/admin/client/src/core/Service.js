import _ from 'lodash';
import axios from 'axios';
import { ActionCreators } from '../redux/actions';
import { getStore } from '../redux/store/configureStore';

export async function call(_method, _endpoint, _data) {
  try {
    let method = _.toString(_method).toLowerCase();
    let endpoint = _.toString(_endpoint);
    let data = _.clone(_data) || {};

    let resp = await axios[method](endpoint, data);
    let respData = resp.data;
    let {
      status, errorCode, errorMessage, result
    } = respData;
    
    console.log(`%c${_method.toUpperCase()} ${_endpoint} >>> `, 'background: #222; color: #bada55; font-size: 13px; font-weight: normall',
    respData);

    // console.log(`respData >> `, respData);

    if (status <= 0) {
      console.error(`Service.call() Error :: ${errorCode} :: ${errorMessage} :: end point ${_endpoint}`);
      // if (errorCode === -101) {
      // TODO :: Redirect ???
      // }
      let errorObj = {
        status,
        errorCode,
        errorMessage
      }
      return errorObj;
    }
    // TODO :: resmove result in response
    if (!_.isUndefined(result)) {
      return result;
    } else {
      return respData;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

export function createURL (action, endpoint, content) {
  content = content || {};
  let url = '';
  url += endpoint;
  if (action.toLowerCase() === 'get') {
    let queryStr = '';
    _.each(content, (val, key) => {
      queryStr += `${key}=${val}&`;
    });
    url += `?${queryStr}`;
  }
  return url;
}

// export async function getUser() {
//   let userData = await call('get', '/api/user');
//   if (userData) {
//     getStore().dispatch(ActionCreators.setAuth(true));
//     getStore().dispatch(ActionCreators.setAdmin(userData));
//   }
//   return userData;
// }

// export async function getCompany() {
//   let companyData = await call('get', '/api/company');
//   if (companyData) {
//     getStore().dispatch(ActionCreators.setCompany(companyData.result));
//   }
//   return companyData;
// }

export async function logout() {
  let result = await call('post', '/api/login/admin/logout');
  getStore().dispatch(ActionCreators.setAuth(false));
  getStore().dispatch(ActionCreators.setAdmin({}));
  return result;
}


export default call;
