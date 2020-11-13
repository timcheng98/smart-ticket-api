import React, { Component } from 'react';
import { LockOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Checkbox, Col, Content, Input, Layout, Row, Select, Tabs, message, Form } from 'antd';
import { useDispatch, useSelector } from 'react-redux';
import { setAuth, setAdmin } from '../../redux/actions/common'
import * as Service from '../../core/Service';
import logo from '../../assets/Logo_Black.png';
import _ from 'lodash';
import { useHistory, Link } from 'react-router-dom';


const Login = () => {
    // const [form] = Form.useForm();
    // const dispatch = useDispatch();
    // const history = useHistory();
    // const config = useSelector(state => state.app.config);
    // console.log('Config>>>', config);
    // const onFinish =  async (formData) => {
    //   let {email, password} = formData;
    //   let data = await Service.call('post', `/api/login/admin`, {
    //     email, password
    //   });
    //   if (data.errorMessage) return message.error(data.errorMessage);
      
    //   let adminData = await Service.call('get', `/api/admin`);
    //   if (adminData.errorMessage) return dispatch(setAuth(false));
    //   if (_.isEmpty(adminData.userData)) return dispatch(setAuth(false));

    //   dispatch(setAdmin(adminData.userData[0]));
    //   dispatch(setAuth(true));
    //   history.push('/admin/home')
    // }

    const displayLogin = () => {
      return (
        <div className="" style={{display: 'flex', justifyContent: 'center'}}>
          <Form 
            className="login-form col-12 mt-2"
            style={{width: '100%'}}
            // form={form}
            // onFinish={onFinish}
          >
            <Form.Item
              name="email"
              rules={[{ required: true, message: 'Please input email.', type: 'email' }]}
            >
              <Input
                prefix={<MailOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Email"
              />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: 'Please input password.' }]}
            >
              <Input.Password
                prefix={<LockOutlined style={{ color: 'rgba(0,0,0,.25)' }} />}
                placeholder="Password"
              />
            </Form.Item>
            <Button
              style={{width: "100%"}}
              type="primary"
              htmlType="submit"
              className="login-form-button"
            >
              登入
            </Button>
            {/* <p className="forgot-password text-right">
                Login with <a href="#" onClick={(e) => this.changeLoginType(e)}>{this.state.isMobile ? 'email' : 'mobile'}</a>
            </p> */}
          </Form>
        </div>
      );
    }

  return (
      <Layout>
        <Layout.Content style={{padding: '50px', backgroundColor: 'white'}}>
          <Row type="flex" justify="center">
            <Col xs={20} sm={16} md={14} lg={10} xl={8} className="pt-5 pb-3" style={{alignItems: 'center', justifyContent: 'center'}}>
              <div style={{textAlign: 'center', marginTop: '15px'}}>
                <div>
                  <img alt="" src={logo} style={{width: '100%', maxWidth: '300px', marginBottom: '30px'}} />
                </div>
                <h2>Smart Access</h2>
                <h3>Admin Panel</h3>
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

// function mapStateToProps(state) {
//   return {
//     app: state.app
//   };
// }

// function mapDispatchToProps(dispatch) {
//   return bindActionCreators(ActionCreators, dispatch);
// }

// export default connect(
//   mapStateToProps,
//   mapDispatchToProps
// )(Login);

