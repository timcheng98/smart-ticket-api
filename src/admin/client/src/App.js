import React from 'react';
import {Provider} from "react-redux";
import configureStore from "./redux/store/configureStore";
import RootProvider from './container/RootProvider';
import 'antd/dist/antd.css';
import './style.css';

const store = configureStore();

export default function App(props) {
  return (
    <Provider store={store}>
      <RootProvider />
    </Provider>
  );
};
