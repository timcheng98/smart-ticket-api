import React, { useState, useEffect } from 'react';
import {
  Avatar, Button, Divider, Form, Icon, Layout, Menu, Modal, Popconfirm, Table, Tag, Tooltip
} from 'antd';
import 'antd/dist/antd.css';
import moment from 'moment';
import _ from 'lodash';
import * as Service from '../../core/Service';
import AppLayout from '../../components/AppLayout';
import CompanyForm from './CompanyForm';
import { EditOutlined, StopOutlined, CheckOutlined } from '@ant-design/icons';


const debug = require('debug')('app:admin:client:src:AdvertisementList');

const involvedModelName = "company";
const title = "Company Info";
const selectedKey = 'company_list';
const tableIDName = "company_id";

const CompanyList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  
  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    let dataList =[];
    try {
      let url = `/api/${involvedModelName}/list`;
      let data = await Service.call('get', url);
      dataList = _.orderBy(data, ['ctime'], ['desc']);
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
                style={{ color: '#000000'}}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedRecord(record);
                }}
              />
              <Tooltip title={record.is_active ? 'Disable Company' : 'Enable Company' }>
                 <Button
                  shape="circle"
                  style={{marginLeft: 8, color: record.is_active ? 'red' : 'green'}}
                  icon={record.is_active ? (<StopOutlined />) : (<CheckOutlined />)}
                  onClick={async () => {
                    let { company_id , is_active } = record;
                    await Service.call('patch', '/api/company/status', {company_id, is_active });
                    getAllData();
                  }}
                />
              </Tooltip>

            </span>
          )
        }
      },
      {
        title: 'Company Name',
        dataIndex: 'company_name',
        sorter: (a, b) => a.company_name.localeCompare(b.company_name)
      },
      {
        title: 'Status',
        dataIndex: 'is_active',
        render: (value) => displayIsActive(value),
        sorter: (a, b) => a.is_active - b.is_active
      },
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
      <Button
        // type="primary"
        className="custom-btn"
        onClick={() => {
          setModalVisible(true);
          setSelectedRecord({company_id: 0})
        }}
      >
        Create New
      </Button>
      
      <Divider />

      <Table
        rowKey={tableIDName}
        scroll={{x: 'auto'}}
        dataSource={dataList}
        columns={setTableHeader()}
      />

      <Modal
        title="Edit"
        visible={modalVisible}
        footer={null}
        style={{ maxWidth: 800 }}
        width={'90%'}
        onCancel={() => { setModalVisible(false) }}
      >
        <CompanyForm
          dataObj={
            selectedRecord
          }
          openModal={
            (_visible) => {
              setModalVisible(_visible);
              getAllData()
            }
          }
        />
      </Modal>
    </AppLayout>
  )  
}

export default CompanyList;
