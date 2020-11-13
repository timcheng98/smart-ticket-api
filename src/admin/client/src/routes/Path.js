import React, { Component } from 'react';
import {
  BrowserRouter, Redirect, Switch, Route
} from "react-router-dom";
import Public from './Public';
import Private from './Private';

import Login from '../pages/admin/Login';
import Home from '../pages/admin/Home';
import CompanyList from '../pages/admin/CompanyList';

import NotFound from '../components/NotFound';

const Path = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Public path="/admin/login" component={Login} exact />
        <Private path="/admin/home" component={Home} exact />
        <Private path="/admin/company/list" component={CompanyList} exact />
        <Route path="/404" component={NotFound} exact />
        <Redirect exact from="/*" to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default Path;
