import React, { useState, useEffect } from 'react';
import {
  Layout, Menu, Avatar, Row, Col
} from 'antd';
import 'antd/dist/antd.css';
import logo from '../assets/Logo_White.png';
import _ from 'lodash';

const { Header } = Layout;

const Navbar = (props) => {
  return (
    <Header style={styles.container}>
      <Row justify="space-between" align="middle" style={styles.row}>
        <Col>
          <img style={{ maxHeight: 40, height: 40, cursor: 'pointer' }} src={logo} alt="" />
        </Col>
        <Col>
          <Menu
            theme="light"
            mode="horizontal"
            style={styles.menu}
          >
            <Menu.Item>
              <Avatar>TEST</Avatar>
            </Menu.Item>
            <Menu.Item
            >
              Logout
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
