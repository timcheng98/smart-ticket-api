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
import TicketVerification from '../pages/admin/event/TicketVerification'
import EventList from '../pages/admin/event/List';
import EventInfo from '../pages/admin/event/Info';
import UserKyc from '../pages/admin/user/kyc/List';
import UserKycInfo from '../pages/admin/user/kyc/Info';
import TransactionHistoryList from '../pages/admin/transaction/List';
import TransactionHistory from '../pages/Transaction';

//Company
import CompanyKycList from '../pages/company/kyc/List';
import CompanyKycForm from '../pages/company/kyc/Form';
import CompanyKycInfo from '../pages/company/kyc/Info';
import CompanyEventList from '../pages/company/event/index';
import CompanyEvent from '../pages/company/event/Info';
import CompanyForm from '../pages/company/event/Form';
import CompanyEventTicket from '../pages/company/event/Ticket';



import UserList from '../pages/admin/user/List';

import NotFound from '../components/NotFound';

const Path = (props) => {
  return (
    <BrowserRouter>
      <Switch>
        <Public path="/transaction/history" component={TransactionHistory} exact level={Main.LEVEL.ALL} />
        <Public path="/admin/login" component={Login} exact />
        <Public path="/" component={Login} exact />
        <Private path="/home" component={Home} exact level={Main.LEVEL.ALL} />

        <Private path="/admin/company/kyc" component={CompanyKycListAll} exact />
        <Private path="/admin/company/kyc/info" component={CompanyKycInfoAll} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/ticket" component={EventTicket} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/list" component={EventList} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/ticket/verify" component={TicketVerification} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/event/info" component={EventInfo} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/user/list" component={UserList} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/user/kyc" component={UserKyc} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/user/kyc/info" component={UserKycInfo} exact level={Main.LEVEL.ADMIN} />
        <Private path="/admin/transaction/history" component={TransactionHistoryList} exact level={Main.LEVEL.ADMIN} />

        <Private path="/company/kyc/list" component={CompanyKycList} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/kyc/form" component={CompanyKycForm} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/kyc/info" component={CompanyKycInfo} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/event/list" component={CompanyEventList} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/event/info" component={CompanyEvent} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/event/form" component={CompanyForm} exact level={Main.LEVEL.COMPANY} />
        <Private path="/company/event/ticket" component={CompanyEventTicket} exact level={Main.LEVEL.COMPANY} />

        <Route path="/404" component={NotFound} exact />
        <Redirect exact from="/*" to="/404" />
      </Switch>
    </BrowserRouter>
  )
}

export default Path;
