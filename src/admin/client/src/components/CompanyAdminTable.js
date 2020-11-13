import React, { Component, useState, useEffect } from 'react';
import {
    Avatar, Button, Divider, Form, Icon, Layout, Menu, Modal, Popconfirm, Table, Tag, Tooltip
} from 'antd';
import {
    EditOutlined,
    StopOutlined,
    CheckOutlined
} from '@ant-design/icons';
import { useSelector } from 'react-redux';
import 'antd/dist/antd.css';
import moment from 'moment';
import _ from 'lodash';
import * as Service from '../core/Service';
import CompanyAdminForm from './CompanyAdminForm';

const CompanyAdminTale = (props) => {
    const [dataList, setDataList] = useState([]);
    const [selectedRecord, setSelectedRecord] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const tableIDName = "company_admin_id";
    const admin = useSelector(state => state.app.admin);
    const company_admin = useSelector(state => state.app.company_admin);

    useEffect(() => {
        setDataList(props.dataObj)
    }, [props.dataObj]);

    const setTableHeader = () => {
        const columns = [
            {
                title: 'Operation',
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
                            <Tooltip title="Edit">
                                <Button
                                    shape="circle"
                                    icon={<EditOutlined />}
                                    onClick={() => {
                                        setSelectedRecord(record);
                                        setModalVisible(true);
                                    }}
                                    style={{ marginRight: 8, color: '#000000' }}
                                />
                            </Tooltip>
                        {
                            record.company_admin_id == company_admin.company_admin_id?'':
                            <Tooltip title={record.is_active ? 'Disable User' : 'Enable User'}>
                            <Button
                                shape="circle"
                                style={{ color: record.is_active ? 'red' : 'green' }}
                                icon={record.is_active ? (<StopOutlined />) : (<CheckOutlined />)}
                                onClick={async () => {
                                    let { company_admin_id, is_active } = record;
                                    await Service.call('patch', '/api/patch/company/admin/status', { company_admin_id, is_active });
                                    if (admin.admin_id == null)
                                    {props.companyChangeData();
                                    }
                                    else
                                    {props.adminChangeData();
                                    }
                                }}
                            />
                        </Tooltip>
                        }
                        </span>
                    )
                }
            },
            {
                title: 'Admin ID',
                dataIndex: 'company_admin_id',
                sorter: (a, b) => a.company_admin_id - b.company_admin_id,
            },
            {
                title: 'Status',
                dataIndex: 'is_active',
                render: (value) => displayIsActive(value),
                sorter: (a, b) => a.is_active - b.is_active,
            },
            checkDisplayPermission({
                title: `Company`,
                dataIndex: `company_name`,
                sorter: (a, b) => a.company_name - b.company_name,
            }),
            // {title: `Controller`, dataIndex: `controller_name`},
            {
                title: 'Name',
                dataIndex: 'first_name',
                render: (value, record) => `${record.first_name} ${record.last_name} (${record.nickname})`,
                sorter: (a, b) => a.first_name.localeCompare(b.first_name)
            },
            {
                title: `Email`,
                dataIndex: 'email',
                // render: (data, record) => `(${record.controller_device_id}) ${record.controller_name}`,
                sorter: (a, b) => a.email.localeCompare(b.email),
            },
            {
                title: 'Mobile',
                dataIndex: 'mobile',
                sorter: (a, b) => a.mobile.localeCompare(b.mobile),
            },
        ];
        return columns;
    }
    
    const checkDisplayPermission = (value) => {
        if(admin.admin_id == null)
            return {}
        else 
            return value
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
            case -1:
                displayStr = "Disable";
                tagColor = '#9A9A9A';
                break;
            default:
                displayStr = "Error"
                tagColor = '#f50';
                break;
        }
        return <Tag color={tagColor}>{displayStr}</Tag>;
    }

    return (
        <Layout>
            <Table
                rowKey={tableIDName}
                scroll={{ x: 'max-content' }}
                dataSource={dataList}
                columns={setTableHeader()}
            />

            <Modal
                destroyOnClose
                title="Edit"
                visible={modalVisible}
                footer={null}
                style={{ maxWidth: 800 }}
                width={'90%'}
                onCancel={() => { setModalVisible(false) }}
            >
                <CompanyAdminForm
                    dataObj={
                        selectedRecord
                    }
                    openModal={
                        (value) => {
                            if (admin.admin_id == null)
                                {props.companyChangeData();
                                }
                            else
                                {props.adminChangeData();
                                }
                            setModalVisible(value)
                        }
                    }
                />
            </Modal>
        </Layout>
    )
}

export default CompanyAdminTale;