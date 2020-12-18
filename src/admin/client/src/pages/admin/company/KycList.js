import React, { useState, useEffect } from 'react';
import {
  Avatar, Button, Divider, Form, Icon, Layout, Menu, Modal, Popconfirm, Table, Tag, Tooltip, Spin, Descriptions, Badge, Image, Row, Col, Input
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import * as Service from '../../../core/Service';
import * as UI from '../../../core/UI';
import AppLayout from '../../../components/AppLayout';
import ImageModal from '../../../components/ImageModal';
import { EditOutlined, StopOutlined, CheckOutlined, FileProtectOutlined, FileSearchOutlined, ZoomInOutlined } from '@ant-design/icons';


const debug = require('debug')('app:admin:client:src:AdvertisementList');

const involvedModelName = "company";
const title = "Company KYC";
const selectedKey = 'company_kyc';
const tableIDName = "company_kyc_id";

const CompanyList = (props) => {
  const [dataList, setDataList] = useState([]);
  const history = useHistory();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const app = useSelector(state => state.app);
  const [loading, toggleLoading] = useState(true);
  const [modal, toggleModal] = useState({
    modalVisible: false,
    imageUrl: null
  });

  const [company, setCompany] = useState({})
  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    let dataList =[];
    try {
      if (app.admin.role === 1) {
        let url = `/api/${involvedModelName}/admin/kyc`;
        let data = await Service.call('get', url);
        console.log(data)
        dataList = _.orderBy(data, ['ctime'], ['desc']);
      }

      if (app.admin.role === 2) {
        let url = `/api/${involvedModelName}/admin/kyc/single`;
        let data = await Service.call('get', url);
        if (data.company_kyc_id > 0) {
          dataList = _.orderBy([data], ['ctime'], ['desc']);
        } 
      }
      toggleLoading(false)
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
              <Link
                to={{
                  pathname: "/admin/company/kyc/info",
                  state: {company: record}
                }}
              >
                <Tooltip title={record.is_company_doc_verified ? 'Verified' : 'Check verification' }>
                  <Button
                    shape="circle"
                    style={{marginLeft: 8, color: record.is_company_doc_verified ? 'green' : 'black'}}
                    icon={record.is_company_doc_verified ? (<FileProtectOutlined />) : (<FileSearchOutlined />)}
                  />
                </Tooltip>
              </Link> 
            </span>
          )
        }
      },
      {
        title: 'Check By',
        dataIndex: 'check_by',
        sorter: (a, b) => a.check_by.localeCompare(b.check_by)
      },
      {
        title: 'Status',
        dataIndex: 'is_company_doc_verified',
        render: (value) => displayIsActive(value),
        sorter: (a, b) => a.status - b.status
      },
      {
        title: 'Owner',
        dataIndex: 'owner',
        sorter: (a, b) => a.owner.localeCompare(b.owner)
      },
      {
        title: 'Industry',
        dataIndex: 'industry',
        sorter: (a, b) => a.industry.localeCompare(b.industry)
      },
      {
        title: 'company_size',
        dataIndex: 'company_size',
        sorter: (a, b) => a.company_size.localeCompare(b.company_size)
      },
      {
        title: 'address',
        dataIndex: 'address',
        sorter: (a, b) => a.address.localeCompare(b.address)
      },
      {
        title: 'Company Doc',
        dataIndex: 'company_doc',
        render: (value) => {
          const imageUrl = `${app.config.STATIC_SERVER_URL}/media/${value}`;
          return (
            <Button
              type="primary"
              onClick={() => {
                toggleModal({
                  modalVisible: true,
                  imageUrl
                })
              }}
            >
              Show
            </Button>
          );
        },
      },
      {
        title: 'Found Date',
        dataIndex: 'found_date',
        render: (value) => UI.momentFormat(value),
        sorter: (a, b) => a.found_date - b.found_date
      },
      // {
      //   title: 'Create@',
      //   dataIndex: 'ctime',
      //   render: (value) => UI.momentFormat(value),
      //   sorter: (a, b) => a.ctime - b.ctime
      // },
      // {
      //   title: 'Update@',
      //   dataIndex: 'utime',
      //   render: (value) => UI.momentFormat(value),
      //   sorter: (a, b) => a.utime - b.utime
      // },
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

  if (loading) return <AppLayout title={title} selectedKey={selectedKey}><Spin spinning={loading}></Spin></AppLayout>;

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      {dataList.length <= 0 &&
      <Button
        // type="primary"
        className="custom-btn"
        onClick={() => {
          history.push('/admin/company/kyc/form')
          // setModalVisible(true);
          // setSelectedRecord({company_id: 0})
        }}
      >
        Apply KYC
      </Button>
      }
      
      <Divider />
      {dataList.length > 0 &&
      <Table
        rowKey={tableIDName}
        scroll={{x: 'max-content'}}
        dataSource={dataList}
        columns={setTableHeader()}
      />
      }

      <ImageModal
        title="Company Document"
        visible={modal.modalVisible}
        setVisible={(_visible) => {
          toggleModal({
            modalVisible: _visible,
            imageUrl: null
          })
        }}
        url={modal.imageUrl}
      />
    </AppLayout>
  )  
}



export default CompanyList;
