import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Avatar, Row, Col
} from 'antd';
import { useDispatch } from 'react-redux';
import * as CommonAction from '../redux/actions/common'
import logo from '../assets/Logo_White.png';
import _ from 'lodash';
import { Link } from 'react-router-dom';
import * as Service from '../core/Service';
import { useSelector } from 'react-redux';


const { Header } = Layout;

const Navbar = (props) => {
  const app = useSelector(state => state.app);
  const [name, setName] = useState('');
  const dispatch = useDispatch();
  useEffect(() => {
    if (!_.isEmpty(app.admin.first_name)) {
      setName(app.admin.first_name[0].toUpperCase());
    }

  }, [app])
  return (
    <Header style={styles.container}>
      <Row justify="space-between" align="middle" style={styles.row}>
        <Col>
          <img style={{ maxHeight: 40, height: 40, cursor: 'pointer' }} src={logo} alt="" className="nav-logo" />
        </Col>
        <Col>
          <Menu
            theme="light"
            mode="horizontal"
            style={styles.menu}
          >
            <Menu.Item>
              <Avatar>{name}</Avatar>
            </Menu.Item>
            <Menu.Item
              onClick={async () => {
                dispatch(CommonAction.setAuth(false))
                dispatch(CommonAction.setCompanyAdmin({}))
                dispatch(CommonAction.setAdmin({}))
                dispatch(CommonAction.setIsAdmin({admin_id: 0}))
                Service.logout();
                
              }}
            >
            <Link to="/admin/login">Logout</Link>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
    </Header>
  )

}

const styles = {
  container: {
    background: '#FFFFFF',
    boxShadow: '0 4px 2px -2px rgba(0,0,0,.2)',
    marginBottom: 4,
    height: 80
  },
  row: {
    height: '100%'
  },
  menu: {
    background: 'transparent' 
  }
}

export default Navbar;
