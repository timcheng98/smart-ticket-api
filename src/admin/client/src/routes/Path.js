import React, { Component } from 'react';
import {
  BrowserRouter, Redirect, Switch, Route
} from "react-router-dom";
import * as Main from '../core/Main'
import Public from './Public';
import Private from './Private';

//All
import Login from '../pages/admin/Login';
import Home from '../pages/admin/Home';

//Admin
import CompanyKycInfoAll from '../pages/admin/company/kyc/Info';
import CompanyKycListAll from '../pages/admin/company/kyc/List';
import EventTicket from '../pages/admin/event/Ticket';
import EventList from '../pages/admin/event/List';
import EventInfo from '../pages/admin/event/Info';

//Company
import CompanyKyc from '../pages/company/kyc';
import CompanyEvent from '../pages/company/event';



import UserList from '../pages/admin/user/List';

import NotFound from '../components/NotFound';

const Path = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Public path="/admin/login" component={Login} exact />
        <Public path="/" component={Login} exact />
        <Private path="/home" component={Home} exact level={Main.LEVEL.ALL} />

        <Private path="/admin/company/kyc" component={CompanyKycListAll} exact />
        <Private path="/admin/company/kyc/info" component={CompanyKycInfoAll} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/ticket" component={EventTicket} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/list" component={EventList} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/info" component={EventInfo} exact level={Main.LEVEL.ADMIN} />

        <Private path="/admin/user/list" component={UserList} exact level={Main.LEVEL.ADMIN} />

        <Private path="/company/kyc" component={CompanyKyc} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/event" component={CompanyEvent} exact level={Main.LEVEL.COMPANY} />

        <Route path="/404" component={NotFound} exact />
        <Redirect exact from="/*" to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default Path;
