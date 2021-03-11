import React, { useState, useEffect } from 'react';
import {
  Avatar, Button, Divider, Form, Icon, Layout, Menu, Modal, Popconfirm, Table, Tag, Tooltip, Spin, Descriptions, Badge, Image, Row, Col, Input
} from 'antd';
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';
import * as Service from '../../../../core/Service';
import * as UI from '../../../../core/UI';
import AppLayout from '../../../../components/AppLayout';
import ImageModal from '../../../../components/ImageModal';
import { EditOutlined, StopOutlined, CheckOutlined, FileProtectOutlined, FileSearchOutlined, ZoomInOutlined } from '@ant-design/icons';


const debug = require('debug')('app:admin:client:src:AdvertisementList');

const involvedModelName = "company";
const title = "Company KYC";
const selectedKey = 'company_kyc';
const tableIDName = "company_kyc_id";

const CompanyList = (props) => {
  const [dataList, setDataList] = useState([]);
  const app = useSelector(state => state.app);
  const [loading, toggleLoading] = useState(true);
  const [modal, toggleModal] = useState({
    modalVisible: false,
    imageUrl: null
  });

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    let dataList =[];
    try {
      let url = `/api/${involvedModelName}/admin/kyc`;
      let data = await Service.call('get', url);
      dataList = _.orderBy(data, ['ctime'], ['desc']);
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
        dataIndex: 'status',
        render: (value) => UI.displayApplicationStatus(value),
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
      }
    ];
    return columns;
  }

  if (loading) return <AppLayout title={title} selectedKey={selectedKey}><Spin spinning={loading}></Spin></AppLayout>;

  return (
    <AppLayout title={title} selectedKey={selectedKey}>

      <Divider />
      <Table
        className="custom-table"
        rowKey={tableIDName}
        scroll={{x: 'max-content'}}
        dataSource={dataList}
        columns={setTableHeader()}
      />
      

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
