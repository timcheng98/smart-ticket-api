import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as _ from 'lodash';

const Private = ({
    component: AppComponent,
    privilege,
    app
  }) => {
    return (
      <Route
        render={
          (props) => {
            return <AppComponent />
            // if(app.auth) {
            //   if (privilege=='admin' && app.admin.admin_id) {
            //     return <AppComponent />
            //   }
            //   if (privilege=='company' && app.company_admin.company_admin_id) {
            //     return <AppComponent /> 
            //   }
            //   if (privilege=='admin' && !app.admin.admin_id) {
            //     return <Redirect to="/company/home"/> 
            //   }
            //   if (privilege=='company' && !app.company_admin.company_admin_id) {
            //     return <Redirect to="/admin/home"/> 
            //   }
            // }
            // if(logoutWay == 'admin'){
            //    return <Redirect to="/admin/login" />
            // } else {
            //   return <Redirect to="/company/login" />
            // }
            
            //   return (
            //     app.auth
            //     ? <AppComponent {...props}/>
            //     : <Redirect to="/admin/login" />
            // )
    }} />
  );
};

export default Private;