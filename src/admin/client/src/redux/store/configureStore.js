import React, { Component } from 'react';

import {createStore, applyMiddleware, compose} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';

import reducer from '../reducers';


// const loggerMiddleware = createLogger({ predicate: () => __DEV__  });
const loggerMiddleware = createLogger({ predicate: () => process.env.NODE_ENV === `development`});


const enhancer = compose(
    applyMiddleware(
      thunk, // lets us dispatch() functions
      loggerMiddleware
    ),
  );

let store;

export default function configureStore(initialState) {
  store = createStore(reducer, initialState, enhancer);
	return store;
}

export function getStore() {
  return store;
}
