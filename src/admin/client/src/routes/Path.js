import React, { Component } from 'react';
import {
  BrowserRouter, Redirect, Switch, Route
} from "react-router-dom";
import Public from './Public';
import Private from './Private';

import Login from '../pages/admin/Login';
import Home from '../pages/admin/Home';
import CompanyList from '../pages/admin/CompanyList';
import CompanyKyc from '../pages/admin/CompanyKyc';
import CompanyKycForm from '../pages/admin/CompanyKycForm';

import NotFound from '../components/NotFound';

const Path = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Public path="/admin/login" component={Login} exact />
        <Public path="/" component={Login} exact />
        <Private path="/admin/home" component={Home} exact />
        <Private path="/admin/company/list" component={CompanyList} exact />
        <Private path="/admin/company/kyc" component={CompanyKyc} exact />
        <Private path="/admin/company/kyc/form" component={CompanyKycForm} exact />
        <Route path="/404" component={NotFound} exact />
        <Redirect exact from="/*" to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default Path;
