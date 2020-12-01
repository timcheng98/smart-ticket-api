import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import * as _ from 'lodash';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { useSelector } from 'react-redux';

const Private = ({
    component: AppComponent,
    level
  }) => {
    // const [auth, setAuth] = useState(false);
    // useEffect(() => {
    const app = useSelector(state => state.app)
    // }, [app.auth])
    if (app.auth === null) {
      const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
      return (
        <div style={{position: 'absolute', top: '50%', left: '50%'}}>
          <Spin indicator={antIcon} />
        </div>
      )
    }

    console.log(app)
    return (
      <Route
        render={
          (props) => {
            // return <AppComponent />
            if(app.auth) {
              console.log('app >>> ', app.auth)
              // return <AppComponent />

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