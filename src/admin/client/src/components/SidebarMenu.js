import React, { useState, useEffect } from 'react'
import { Menu } from 'antd';
import {
  DashboardOutlined,
  BankOutlined,
  ShopOutlined,
  TeamOutlined,
  SolutionOutlined,
  CalendarOutlined,
  HistoryOutlined
} from '@ant-design/icons';
import _ from 'lodash';
import * as Main from '../core/Main'
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const SidebarMenu = ({selectedKey}) => {
  const app = useSelector((state) => state.app);
  const [sideBarItems, setSideBarItems] = useState(null);

  useEffect(() => {
    renderMenuItem();
  }, [])

  const renderMenuItem = () => {
    console.log(app)
    const renderItems = [];


    if (app.is_admin.admin) {
      let itemList = [...AllLevelItems, ...AdminLevelItems];
      _.each(itemList, (item, key) => {
        let element = (
          <Menu.Item
            key={item.key}
            icon={item.icon}
          >
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        )
        renderItems.push(element);
      })
    }

    if (app.is_admin.company_admin) {
      let itemList = [...AllLevelItems, ...CompanyLevelItems];
      _.each(itemList, (item, key) => {
        let element = (
          <Menu.Item
            key={item.key}
            icon={item.icon}
          >
            <Link to={item.path}>{item.title}</Link>
          </Menu.Item>
        )
        renderItems.push(element);
      })
    }

    setSideBarItems(renderItems);
  }

  return (
    <Menu
      mode="inline"
      defaultSelectedKeys={[selectedKey]}
      selectedKeys={[selectedKey]}
      style={{ height: '100%', paddingBottom: '50px', paddingTop: '20px' }}
    >
      {sideBarItems}
    </Menu>
  )
}

const AllLevelItems = [
  {
    key: 'dashboard',
    title: 'Dashboard',
    path: '/home',
    icon: <DashboardOutlined />
  }
]

const AdminLevelItems = [
  {
    key: 'company_kyc',
    title: 'Company Kyc',
    path: '/admin/company/kyc',
    icon: <ShopOutlined />
  },
  {
    key: 'user_list',
    title: 'User List',
    path: '/admin/user/list',
    icon: <TeamOutlined />
  },
  // {
  //   key: 'user_kyc',
  //   title: 'User KYC',
  //   path: '/admin/user/kyc',
  //   icon: <SolutionOutlined />
  // },
  {
    key: 'event_list',
    title: 'Event List',
    path: '/admin/event/list',
    icon: <CalendarOutlined />
  },
  {
    key: 'transaction_history',
    title: 'Transaction',
    path: '/admin/transaction/history',
    icon: <HistoryOutlined />
  },
  // {
  //   key: 'event_ticket',
  //   title: 'Event Ticket',
  //   path: '/admin/event/ticket',
  //   icon: <BankOutlined />
  // }
]

const CompanyLevelItems = [
  {
    key: 'company_kyc',
    title: 'Company Kyc',
    path: '/company/kyc/list',
    icon: <ShopOutlined />
  },
  {
    key: 'company_event',
    title: 'Event Application',
    path: '/company/event/list',
    icon: <CalendarOutlined />
  }
]

export default SidebarMenu;
