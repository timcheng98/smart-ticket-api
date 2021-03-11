import React, { useState, useEffect } from 'react';
import {
  Avatar, Button, Divider, Form, Icon, Layout, Menu, Modal, Tabs, Popconfirm, Table, Tag, Tooltip
} from 'antd';
import {
  TeamOutlined,
  SolutionOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';
import * as UI from '../../../core/UI';
import { useSelector } from 'react-redux';
import * as Service from '../../../core/Service';
import AppLayout from '../../../components/AppLayout';
// import CompanyForm from './Form';
import { EditOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';


const { TabPane } = Tabs;

const involvedModelName = "user";
const title = "User Information";
const selectedKey = 'user_list';
const tableIDName = "user_id";

const UserList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const state = useSelector(state => state.app)
  useEffect(() => {
    getAllData();
    console.log(state)
  }, []);

  const getAllData = async () => {
    let dataList = [];
    try {
      let url = `/api/admin/user/list`;
      let data = await Service.call('get', url);
      dataList = _.orderBy(data, ['ctime'], ['desc']);
      console.log('datalist', dataList);
    } catch (error) {
      console.error('error >>> ', error);
    } finally {
      setDataList(dataList)
    }
  }

  const setTableHeader = () => {
    const columns = [
      {
        title: '',
        dataIndex: tableIDName,
        render: (value, record) => {
          let status = (record.status === 1);
          let color = '#000000';
          let icon = '';
          let wordings = '';
          if (status) {
            color = '#AA0000'
            icon = 'stop';
            wordings = 'Disable';
          } else {
            color = '#00AA00'
            icon = 'check';
            wordings = 'Enable';
          }
          return (
            <span>
              <Button
                shape="circle"
                style={{ color: '#000000' }}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedRecord(record);
                }}
              />
              <Tooltip title={record.is_active ? 'Disable Company' : 'Enable Company'}>
                <Button
                  shape="circle"
                  style={{ marginLeft: 8, color: record.is_active ? 'red' : 'green' }}
                  icon={record.is_active ? (<StopOutlined />) : (<CheckOutlined />)}
                  onClick={async () => {
                    let { company_id, is_active } = record;
                    await Service.call('patch', '/api/company/status', { company_id, is_active });
                    getAllData();
                  }}
                />
              </Tooltip>

            </span>
          )
        }
      },
      {
        title: 'Status',
        dataIndex: 'is_active',
        render: (value) => UI.displayStatus(value),
        sorter: (a, b) => a.is_active - b.is_active
      },
      {
        title: 'User Name',
        dataIndex: 'first_name',
        render: (val, { first_name, last_name }) => `${first_name} ${last_name}`,
        // sorter: (a, b) => a.first_name.localeCompare(b.first_name)
      },
      {
        title: 'Mobile',
        dataIndex: 'mobile',
        // sorter: (a, b) => a.mobile.localeCompare(b.mobile)
      },
      {
        title: 'Email',
        dataIndex: 'email',
        // sorter: (a, b) => a.email.localeCompare(b.email)
      },
      {
        title: 'Wallet Address',
        dataIndex: 'wallet_address',
        // sorter: (a, b) => a.wallet_address.localeCompare(b.wallet_address)
      }
    ];
    return columns;
  }
  const displayIsActive = (value) => {
    let displayStr = '';
    let tagColor = 'green';
    let statusValue = _.toInteger(value);
    switch (statusValue) {
      case 1:
        displayStr = "Active";
        tagColor = 'green';
        break;
      case 0:
        displayStr = "Inactive";
        tagColor = 'red';
        break;
      default:
        displayStr = "Error"
        tagColor = '#f50';
        break;
    }
    return <Tag color={tagColor}>{displayStr}</Tag>;
  }

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Tabs>
        <TabPane tab={<span><TeamOutlined />User List</span>} key="1">
          <Table
            rowKey={tableIDName}
            scroll={{ x: 'auto' }}
            dataSource={dataList}
            columns={setTableHeader()}
          />
        </TabPane>
        <TabPane tab={<span><SolutionOutlined />KYC List</span>} key="2">
          <Table
            rowKey={tableIDName}
            scroll={{ x: 'auto' }}
            dataSource={dataList}
            columns={setTableHeader()}
          />
        </TabPane>
      </Tabs>


      <Modal
        title="Edit"
        visible={modalVisible}
        footer={null}
        style={{ maxWidth: 800 }}
        width={'90%'}
        onCancel={() => { setModalVisible(false) }}
      >
        {/* <CompanyForm
          dataObj={
            selectedRecord
          }
          openModal={
            (_visible) => {
              setModalVisible(_visible);
              getAllData()
            }
          }
        /> */}
      </Modal>
    </AppLayout>
  )
}

export default UserList;
