import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import { useSelector } from 'react-redux';
import LoadingScreen from '../components/LoadingScreen';

const Private = ({
    component: AppComponent,
    level
  }) => {
    const app = useSelector(state => state.app)
    console.log(app)
    if (app.auth === null) return <LoadingScreen></LoadingScreen>
    return (
      <Route
        render={
          (props) => {
            if(app.auth) {
              if (level === 3 && app.admin.admin_id) {
                return <AppComponent /> 
              }
              if (level === 2 && app.company_admin.admin_id) {
                return <AppComponent /> 
              }
              if (level === 3 && !app.admin.admin_id) {
                return <Redirect to="/home"/> 
              }
              if (level === 2 && !app.company_admin.admin_id) {
                return <Redirect to="/home"/> 
              }
            }
            // if(logoutWay == 'admin'){
            //    return <Redirect to="/admin/login" />
            // } else {
            //   return <Redirect to="/company/login" />
            // }
            
              return (
                app.auth
                ? <AppComponent {...props}/>
                : <Redirect to="/admin/login" />
            )
    }} />
  );
};

export default Private;