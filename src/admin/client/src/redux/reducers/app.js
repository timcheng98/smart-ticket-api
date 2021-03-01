import * as types from '../actions/types';
import Immutable from 'seamless-immutable';

const initialState = Immutable({
  auth: false,
  config: {
    STATIC_SERVER_URL: null,
  },
  is_admin: {
    admin: false,
    company_admin: false,
    admin_id: 0
  },
  loading: false,
  // admin: {
  //   admin_id: 0,
  //   username: null,
  //   first_name: '',
  //   last_name: '',
  //   nickname: '',
  //   avatar_file: null,
  //   email: '',
  //   mobile: '',
  // },
  admin: {},
  company_admin: {},
  origin: '',
  logoutWay: '',
  totalSeats: {},
  events: false
});

const smartContractInitalState = Immutable({
  sc_event: {},
  events: {}
});

const formInitialState = Immutable({
  form_data: {},
});

const appReducer = {
  app: (state = initialState, action) => {
    switch (action.type) {
      case types.SET_CONFIG: {
        console.log(`config >> `, action.data);
        return {...state, config: action.data};
      }
      case types.SET_AUTH:
        state = {...state, auth: action.data}
        return state;
      case types.SET_IS_ADMIN:
        state = {...state, is_admin: action.data}
        return state;
      case types.SET_LOADING:
        state = {...state, loading: action.data}
        return state;
      case types.SET_ADMIN:
        if (!action.data || Object.keys(action.data).length === 0) {
          state = {
            ...state,
            admin: initialState.admin,
          };
        } else {
          state = {...state, admin: action.data};
        }
        return state;
        case types.SET_COMPANY_ADMIN:
          if (!action.data || Object.keys(action.data).length === 0) {
            state = {
              ...state,
              company_admin: initialState.company_admin,
            };
          } else {
            state = {...state, company_admin: action.data};
          }
          return state;
      case types.SET_ORIGIN:
        state = {...state, origin: action.data}
        return state;
      case types.SET_TOTAL_SEATS: {
        state = {
          ...state,
          totalSeats: {...state.totalSeats, ...action.data}
        };
        return state;
      }
      case types.SET_EVENTS: {
        state = {
          ...state,
          events: action.data
        };
        return state;
      }
      default:
        return state;
      case types.SET_LOGOUTWAY:
        state = {...state, logoutWay: action.data}
        return state;
    }
  },
  smartContract: (state = smartContractInitalState, action) => {
    switch (action.type) {
      case types.SET_SC_EVENT_API: {
        return {...state, sc_event_api: action.data};
      }
      case types.SET_SC_EVENTS: {
        return {...state, sc_events: action.data};
      }
      default:
        return state;
    }
  },
  form: (state = formInitialState, action) => {
    switch (action.type) {
      case types.SET_FORM_DATA: {
        return {...state, form_data: action.data};
      }
      default:
        return state;
    }
  },
};

export default appReducer;
