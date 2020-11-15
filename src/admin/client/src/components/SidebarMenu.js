import React, { useState } from 'react'
import { Menu } from 'antd';
import {
  DashboardOutlined,
  BankOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import { Link } from 'react-router-dom';

const SidebarMenu = ({selectedKey}) => {
  const renderMenuItem = () => {
    const items = [];
    dataList.map((pathData, i) => {
      items.push((
        <Menu.Item
          key={pathData.key}
          icon={pathData.icon}
        >
          <Link to={pathData.path}>{pathData.title}</Link>
        </Menu.Item>
      ))
    })
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
    path: '/admin/home',
    icon: <DashboardOutlined />,
    display: 'block',
    privilege: 'all'
  },
  {
    key: 'company_list',
    title: 'Company List',
    path: '/admin/company/list',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: 'admin'
  },
  {
    key: 'company_kyc',
    title: 'Company Kyc',
    path: '/admin/company/kyc',
    icon: <BankOutlined />,
    display: 'block',
    className: ['p_company'],
    privilege: 'admin'
  },
]

const adminRoutes = [
  '/admin/home',
  '/admin/company/list',
  '/admin/company/admin',
]

export default SidebarMenu;
