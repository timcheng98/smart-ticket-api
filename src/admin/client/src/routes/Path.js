import React, { Component } from 'react';
import {
  BrowserRouter, Redirect, Switch, Route
} from "react-router-dom";
import * as Main from '../core/Main'
import Public from './Public';
import Private from './Private';

import Login from '../pages/admin/Login';
import Home from '../pages/admin/Home';
import CompanyList from '../pages/admin/company/List';
import CompanyKyc from '../pages/admin/company/KycList';
import CompanyKycForm from '../pages/admin/company/KycForm';
import CompanyKycInfo from '../pages/admin/company/KycInfo';

import NotFound from '../components/NotFound';

const Path = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Public path="/admin/login" component={Login} exact />
        <Public path="/" component={Login} exact />
        <Private path="/home" component={Home} exact level={Main.LEVEL.ALL} />

        <Private path="/admin/company/list" component={CompanyList} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/company/kyc" component={CompanyKyc} exact />
        <Private path="/admin/company/kyc/info" component={CompanyKycInfo} exact level={Main.LEVEL.ADMIN} />

        <Private path="/company/kyc/form" component={CompanyKycForm} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/kyc/info" component={CompanyKycInfo} exact level={Main.LEVEL.COMPANY} />
        <Route path="/404" component={NotFound} exact />
        <Redirect exact from="/*" to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default Path;
