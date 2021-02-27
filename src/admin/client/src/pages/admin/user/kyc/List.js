import React, { useState, useEffect } from 'react';

// Libraries / Plugins
import { useHistory, Link } from 'react-router-dom';
import moment from 'moment';
import _ from 'lodash';
import { useSelector } from 'react-redux';

// UI Display
import * as UI from '../../../../core/UI';
import {
  Button, Divider, Table, Tooltip, Spin
} from 'antd';
import { FileProtectOutlined, FileSearchOutlined } from '@ant-design/icons';

// Logic
import * as Service from '../../../../core/Service';

// Customized Components
import LoadingScreen from '../../../../components/LoadingScreen'
import ImageModal from '../../../../components/ImageModal';
import AppLayout from '../../../../components/AppLayout';

// Initial States
const debug = require('debug')('app:admin:client:src:AdvertisementList');
const API = {
  GET_ALL: `/api/user/kyc`,
  POST: `/api/user/kyc`,
  PATCH: `/api/user/kyc`,
  PUT: `/api/user/kyc`
}
const metaData = {
  title: 'User KYC',
  selectedKey: 'user_kyc',
  tableID: 'user_kyc_id'
};

const UserKycList = (props) => {
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

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    let dataList =[];
    try {

      let data = await Service.call('get', API.GET_ALL);
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
        dataIndex: metaData.tableID,
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
        render: (value) => UI.displayStatus(value, {1: 'Approved', 0: 'Pending', '-1': 'Rejected', default: 'ERROR'}),
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

  if (loading) {
    return (<><LoadingScreen /></>)
  };

  return (
    <AppLayout title={metaData.title} selectedKey={metaData.selectedKey}>

      <Divider />
      <Table
        className="custom-table"
        rowKey={metaData.tableID}
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



export default UserKycList;
