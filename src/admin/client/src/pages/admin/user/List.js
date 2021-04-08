import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Icon,
  Layout,
  Menu,
  Modal,
  Tabs,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
} from "antd";
import {
  TeamOutlined,
  SolutionOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import { Link } from "react-router-dom";
import * as UI from "../../../core/UI";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import AppLayout from "../../../components/AppLayout";
// import CompanyForm from './Form';
import { EditOutlined, StopOutlined, CheckOutlined } from "@ant-design/icons";
import KycList from "./kyc/List";

const { TabPane } = Tabs;

const involvedModelName = "user";
const title = "User Information";
const selectedKey = "user_list";
const tableIDName = "user_id";

const UserList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [kycDataList, setKycDataList] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const app = useSelector((state) => state.app);
  useEffect(() => {
    getAllData();
    getKycData();
  }, []);

  const getAllData = async () => {
    let dataList = [];
    try {
      let url = `/api/admin/user/list`;
      let data = await Service.call("get", url);
      dataList = _.orderBy(data, ["is_active", 'ctime'], ["desc", 'desc']);
      console.log("datalist", dataList);
    } catch (error) {
      console.error("error >>> ", error);
    } finally {
      setDataList(dataList);
    }
  };

  const getKycData = async () => {
    let kycDataList = [];
    try {
      let data = await Service.call("get", "/api/admin/user/kyc");
      kycDataList = _.orderBy(data, ["ctime"], ["desc"]);
      kycDataList = _.keyBy(kycDataList, "user_id");
    } catch (error) {
      console.error("error >>> ", error);
    } finally {
      setKycDataList(kycDataList);
    }
  };

  const setTableHeader = () => {
    const columns = [
      {
        title: "",
        dataIndex: tableIDName,
        render: (value, record) => {
          let status = record.status === 1;
          let color = "#000000";
          let icon = "";
          let wordings = "";
          if (status) {
            color = "#AA0000";
            icon = "stop";
            wordings = "Disable";
          } else {
            color = "#00AA00";
            icon = "check";
            wordings = "Enable";
          }
          return (
            <span>
              <Button
                shape="circle"
                style={{ color: "#000000" }}
                icon={<EditOutlined />}
                onClick={() => {
                  setModalVisible(true);
                  setSelectedRecord(record);
                }}
              />
              <Tooltip
                title={record.is_active ? "Disable User" : "Enable user"}
              >
                <Button
                  shape="circle"
                  style={{
                    marginLeft: 8,
                    color: record.is_active ? "red" : "green",
                  }}
                  icon={record.is_active ? <StopOutlined /> : <CheckOutlined />}
                  onClick={async () => {
                    let { user_id, is_active } = record;
                    await Service.call("patch", "/api/admin/user", {
                      user_id,
                      is_active: is_active ? 0 : 1,
                    });
                    getAllData();
                  }}
                />
              </Tooltip>
              {!_.isEmpty(kycDataList[record.user_id]) &&
                kycDataList[record.user_id].status === 1 && (
                  <Tooltip title="Validate User">
                    <Link
                      to={{
                        pathname: "/admin/user/kyc/info",
                        state: { dataSource: kycDataList[record.user_id] },
                      }}
                    >
                      <Button
                        shape="circle"
                        style={{ marginLeft: 8, color: "green" }}
                        icon={<SafetyCertificateOutlined />}
                      />
                    </Link>
                  </Tooltip>
                )}
            </span>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "is_active",
        render: (value) => UI.displayStatus(value),
        sorter: (a, b) => a.is_active - b.is_active,
      },
      // {
      //   title: 'User Name',
      //   dataIndex: 'first_name',
      //   render: (val, { first_name, last_name }) => `${first_name} ${last_name}`,
      //   // sorter: (a, b) => a.first_name.localeCompare(b.first_name)
      // },
      // {
      //   title: 'Mobile',
      //   dataIndex: 'mobile',
      //   // sorter: (a, b) => a.mobile.localeCompare(b.mobile)
      // },
      {
        title: "Email",
        dataIndex: "email",
      },
      {
        title: "Wallet Address",
        dataIndex: "wallet_address",
      },
      {
        title: "Receiving Account",
        dataIndex: "credit_card_number",
      },
      {
        title: "Receiving Account Name",
        dataIndex: "credit_card_name",
      },
      {
        title: "Receiving Account Expiry",
        dataIndex: "credit_card_expiry_date",
      },
    ];
    return columns;
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Tabs>
        <TabPane
          tab={
            <span>
              <TeamOutlined />
              User List
            </span>
          }
          key="1"
        >
          <Table
            className="custom-table"
            rowKey={tableIDName}
            scroll={{ x: "max-content" }}
            dataSource={dataList}
            columns={setTableHeader()}
          />
        </TabPane>
        <TabPane
          tab={
            <span>
              <SolutionOutlined />
              KYC List
            </span>
          }
          key="2"
        >
          <KycList />
        </TabPane>
      </Tabs>

      <Modal
        title="Edit"
        visible={modalVisible}
        footer={null}
        style={{ maxWidth: 800 }}
        width={"90%"}
        onCancel={() => {
          setModalVisible(false);
        }}
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
  );
};

export default UserList;
