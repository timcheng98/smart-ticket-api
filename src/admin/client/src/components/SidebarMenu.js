import React, { useState } from 'react'
import { Menu } from 'antd';
import {
  DashboardOutlined,
  BankOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import * as Main from '../core/Main'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SidebarMenu = ({selectedKey}) => {
  const app = useSelector((state) => state.app)
  const renderMenuItem = () => {
    console.log(app)
    const items = [];

    if (app.is_admin.admin) {
      dataList.map((item, i) => {
        if (item.privilege === Main.LEVEL.ADMIN || item.privilege === Main.LEVEL.ALL) {
          items.push((
            <Menu.Item
              key={item.key}
              icon={item.icon}
            >
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          ))
        }  
      })
    }

    if (app.is_admin.company_admin) {
      dataList.map((item, i) => {
        if (item.privilege === Main.LEVEL.COMPANY || item.privilege === Main.LEVEL.ALL) {
          items.push((
            <Menu.Item
              key={item.key}
              icon={item.icon}
            >
              <Link to={item.path}>{item.title}</Link>
            </Menu.Item>
          ))
        }  
      })
    }

    return items;
  }

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      // defaultOpenKeys={['1']}
      selectedKeys={[selectedKey]}
      style={{ height: '100%', paddingBottom: '50px', paddingTop: '20px' }}
    >
      {renderMenuItem()}
    </Menu>
  )
}

const dataList = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/home',
    icon: <DashboardOutlined />,
    display: 'block',
    privilege: Main.LEVEL.ALL
  },
  {
    key: 'company_list',
    title: 'Company List',
    path: '/admin/company/list',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: Main.LEVEL.ADMIN
  },
  {
    key: 'company_kyc',
    title: 'Company Kyc',
    path: '/admin/company/kyc',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: Main.LEVEL.ADMIN
  },
  {
    key: 'user_list',
    title: 'User List',
    path: '/admin/user/list',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: Main.LEVEL.ADMIN
  },
  {
    key: 'company_kyc',
    title: 'Company Kyc',
    path: '/company/kyc/info',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: Main.LEVEL.COMPANY
  },
]

const adminRoutes = [
  '/home',
  '/admin/company/list',
  '/admin/company/admin',
]

export default SidebarMenu;
