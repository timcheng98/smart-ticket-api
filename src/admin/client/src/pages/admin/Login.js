import React, { useEffect } from 'react';
import { Button, Col, Input, Layout, Row, message, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setAdmin, setCompanyAdmin, setIsAdmin } from '../../redux/actions/common'
import * as Service from '../../core/Service';
import logo from '../../assets/Logo_Black.png';
import _ from 'lodash';
import { useHistory, Link } from 'react-router-dom';


const Login = () => {
    const [form] = Form.useForm();
    const dispatch = useDispatch();
    const history = useHistory();
    const config = useSelector(state => state.app.config);
    const auth = useSelector(state => state.app.auth);
    
    useEffect(() => {
      if (auth) history.push('/home');
    }, [auth]);

    const onFinish =  async (formData) => {
      let {email, password} = formData;
      let data = await Service.call('post', `/api/login/admin`, {
        email, password
      });
      if (data.errorMessage) return message.error(data.errorMessage);
      
      let adminData = await Service.call('get', `/api/admin`);
      if (adminData.errorMessage) return dispatch(setAuth(false));
      if (_.isEmpty(adminData.userData)) return dispatch(setAuth(false));
      if (adminData.userData[0].role === 1) {
        dispatch(setAdmin(adminData.userData[0]));
        dispatch(setIsAdmin(adminData.userData[0]));
        dispatch(setAuth(true))
      }

      if (adminData.userData[0].role === 2) {
        dispatch(setCompanyAdmin(adminData.userData[0]));
        dispatch(setIsAdmin(adminData.userData[0]));
        dispatch(setAuth(true));
      }
      history.push('/home')
    }

    const displayLogin = () => {
      return (
        <div className="" style={{display: 'flex', justifyContent: 'center'}}>
          <Form 
            className="login-form col-12 mt-2"
            style={{width: '100%'}}
            layout="vertical"
            form={form}
            onFinish={onFinish}
          >
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: false, message: 'Please input email.', type: 'email' }]}
            >
              <Input
                // prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: false, message: 'Please input password.' }]}
            >
              <Input.Password
                // prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
                className="password"
              />
            </Form.Item>
            <Button
              style={{
                width: "100%", backgroundColor: '#24a0ed', color: '#FFFFFF', height: 40, borderRadius: 4
              }}
              // type="primary"
              htmlType="submit"
              shape="square"
              className="login-form-button"
            >
              Sign Up
            </Button>
            {/* <p className="forgot-password text-right">
                Login with <a href="#" onClick={(e) => this.changeLoginType(e)}>{this.state.isMobile ? 'email' : 'mobile'}</a>
            </p> */}
          </Form>
        </div>
      );
    }

  return (
      <Layout style={{minHeight: '100vh', background: '#FFFFFF'}} >
        <Layout.Content style={{padding: 50}}>
          <Row type="flex" justify="center" align="middle">
            <Col xs={20} sm={16} md={14} lg={10} xl={8} className="pt-5 pb-3" style={{alignItems: 'center', justifyContent: 'center'}}>
              <div style={{textAlign: 'center', marginTop: '15px'}}>
                <div>
                  <img alt="" src={logo} style={{width: '100%', maxWidth: '300px', marginBottom: '30px'}} className="company-logo" />
                </div>
                {/* <h2>Smart Ticket</h2> */}
                <h1 style={{marginBottom: 20}}>Admin Panel</h1>
                <h2 style={{marginBottom: 20}}>Welcome Back!</h2>
              </div>
            </Col>
          </Row>
          <Row type="flex" justify="center" style={{marginTop: '15px'}}>
            <Col
              xs={22}
              sm={16}
              md={14}
              lg={10}
              xl={8}
              style={{alignItems: 'center', justifyContent: 'center'}}
            >
              {
                displayLogin()
              }
            </Col>
          </Row>
          {/* <Row type="flex" justify="center">
            <Col xs={20} sm={16} md={14} lg={10} xl={8} className="pt-5 pb-3" style={{alignItems: 'center', justifyContent: 'center'}}>
              <Link to="/company/login">Company admin login</Link>
            </Col>
          </Row> */}
        </Layout.Content>
      </Layout>
    )
}

export default Login;

