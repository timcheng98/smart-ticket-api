import React, { useState } from 'react'
import { Layout, Menu } from 'antd';
import {
  BrowserRouter as Router,
  Link
} from "react-router-dom";
import {
  DashboardOutlined,
  UserOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BankOutlined,
  LockOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import SidebarMenu from './SidebarMenu';
import _ from 'lodash';
const { Sider } = Layout;
const { SubMenu } = Menu;

let dataList = [
  { key: 'dashboard', title: 'Dashboard', path: '/home', icon: <DashboardOutlined />, display: 'block', privilege: 'all' },
  { key: 'company', title: 'Company List', path: '/admin/company/list', icon: <BankOutlined />, display: 'block', className: ['p_company'], privilege: 'admin' },
]
let adminRoute = [
  '/home',
  '/admin/company/list',
  '/admin/company/admin',
]

const Sidebar = ({selectedKey}) => {
  return (
    <Sider
      breakpoint="sm"
      collapsedWidth="0"
      width={250}
    >
      <SidebarMenu selectedKey={selectedKey}/>
    </Sider>
  )
}

export default Sidebar;
