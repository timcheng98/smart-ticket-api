import { combineReducers } from 'redux';
import appReducer from './app';

export default combineReducers(Object.assign(appReducer));