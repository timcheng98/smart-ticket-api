import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Icon,
  Menu,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Row,
  Typography,
  Col,
  Popover,
  Layout
} from "antd";
import QrReader from "react-qr-reader";
import { GlobalOutlined, QrcodeOutlined, EyeOutlined } from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import * as UI from "../core/UI";
import * as Main from "../core/Main";
import { useSelector } from "react-redux";
import * as Service from "../core/Service";
import AppLayout from "../components/AppLayout";
// import CompanyForm from './Form';
import { Link } from "react-router-dom";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

const debug = require("debug")("app:admin:client:src:AdvertisementList");

const involvedModelName = "transaction";
const title = "Trsanction History";
const selectedKey = "transaction_history";
const tableIDName = "transaction_id";
const { Paragraph, Text } = Typography;

const TransactionHistoryList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [current_eth, setCurrentEth] = useState(0);
  const [loading, setLoading] = useState(true);
  const sc_events = useSelector((state) => state.smartContract.sc_events);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeResult, setQrCodeResult] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    getAllData();
    setLoading(false);
    getCurrentEth();
  }, []);

  const getAllData = async () => {
    let dataList = [];
    try {
      let url = `/api/${involvedModelName}/all`;
      let data = await Service.call("get", url);
      dataList = _.orderBy(data, ["ctime"], ["desc"]);
    } catch (error) {
      console.error("error >>> ", error);
    } finally {
      setDataList(dataList);
    }
  };

  const getCurrentEth = async () => {
    const response = await fetch(
      "https://min-api.cryptocompare.com/data/price?fsym=ETH&tsyms=HKD"
    );
    let result = await response.text();
    let current_eth_hkd = JSON.parse(result);
    setCurrentEth(current_eth_hkd.HKD);
  };

  const setTableHeader = () => {
    const columns = [
      // {
      //   title: "",
      //   dataIndex: tableIDName,
      //   render: (value, record) => {
      //     let button;
      //     // console.log('sc_events', sc_events);
      //     if (!_.isEmpty(sc_events)) {
      //       if (sc_events[record.event_id])
      //         button = (
      //           <Col>
      //             <Tooltip title={"On the Blochain Already"}>
      //               <Button shape="circle" icon={<GlobalOutlined style={{ color: '#1890ff' }} />} />
      //             </Tooltip>
      //           </Col>
      //         )
      //     }
      //     let color = "#000000";
      //     let icon = "";
      //     let wordings = "";
      //     if (record.status === 1) {
      //       color = "#AA0000";
      //       icon = "stop";
      //       wordings = "Disable";
      //     } else {
      //       color = "#00AA00";
      //       icon = "check";
      //       wordings = "Enable";
      //     }
      //     return (
      //       <Row gutter={[8, 0]}>
      //         <Col>
      //           <Link
      //             to={{
      //               pathname: "/admin/event/info",
      //               state: { dataSource: record },
      //             }}
      //           >
      //             <Tooltip
      //               title={
      //                 record.is_approval_doc_verified
      //                   ? "Verified"
      //                   : "Check verification"
      //               }
      //             >
      //               <Button
      //                 shape="circle"
      //                 style={{
      //                   marginLeft: 8,
      //                   color: record.is_approval_doc_verified
      //                     ? "green"
      //                     : "black",
      //                 }}
      //                 icon={
      //                   record.is_approval_doc_verified ? (
      //                     <FileProtectOutlined />
      //                   ) : (
      //                     <FileSearchOutlined />
      //                   )
      //                 }
      //               />
      //             </Tooltip>
      //           </Link>
      //         </Col>
      //         {button}
      //       </Row>
      //     );
      //   },
      // },
      {
        title: "Txn Hash",
        dataIndex: "transaction_hash",
        render: (value, record) => {
          return (
            <>
              <Popover
                placement="right"
                content={
                  <Row gutter={[0, 12]} style={{ width: 300 }}>
                    <Col span={24}>Status</Col>
                    <Col span={24}>
                      {UI.displayStatus(record.status, {
                        1: "Confirm",
                        0: "Fail",
                        "-1": "Fail",
                        default: "Fail",
                      })}
                    </Col>
                    {/* {record.admin_id > 0 && (
                      <>
                        <Col span={24}>Admin ID</Col>
                        <Col span={24}>{record.admin_id}</Col>
                      </>
                    )}
                    {record.user_id > 0 && (
                      <>
                        <Col span={24}>User ID</Col>
                        <Col span={24}>
                          {record.user_id} <br />
                          <Tooltip title={record.user_address}>
                            <span style={{ color: "#3498db" }}>
                              {record.user_address.substring(0, 32)}...
                            </span>
                          </Tooltip>
                        </Col>
                      </>
                    )} */}
                    <Col span={24}>Block Hash</Col>
                    <Col span={24}>
                      <Tooltip title={record.block_hash}>
                        <span style={{ color: "#3498db" }}>
                          {record.block_hash.substring(0, 32)}...
                        </span>
                      </Tooltip>
                    </Col>
                    <Col span={24}>Contract Address</Col>
                    <Col span={24}>
                      <Tooltip title={record.contract_address}>
                        <span style={{ color: "#3498db" }}>
                          {record.contract_address.substring(0, 32)}...
                        </span>
                      </Tooltip>
                    </Col>
                    <Col span={24}>Event</Col>
                    <Col span={24}>
                      <Paragraph
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: "more",
                        }}
                      >
                        {record.event}
                      </Paragraph>
                    </Col>
                    <Col span={24}>Logs</Col>
                    <Col
                      span={24}
                      style={{ width: 280, wordWrap: "break-word" }}
                    >
                      <Paragraph
                        ellipsis={{
                          rows: 2,
                          expandable: true,
                          symbol: "more",
                        }}
                      >
                        {record.logs}
                      </Paragraph>
                    </Col>
                  </Row>
                }
              >
                <EyeOutlined style={{ marginRight: 12 }} />
              </Popover>
              <Tooltip title={value}>
                <span style={{ color: "#3498db" }}>
                  {value.substring(0, 17)}...
                </span>
              </Tooltip>
            </>
          );
        },
      },
      {
        title: "Block",
        dataIndex: "block_number",
      },
      {
        title: "Confirm Block",
        dataIndex: "confirm_block",
        render: (value, record) => {
          return `${value} / 2`;
        },
      },
      // {
      //   title: "Status",
      //   dataIndex: "status",
      //   render: (value) => UI.displayStatus(value, { "1": 'Confirm', "0": 'Fail', "-1": 'Fail', default: 'Fail' }),
      //   sorter: (a, b) => a.status - b.status,
      // },
      {
        title: "Age",
        dataIndex: "ctime",
        render: (value) => {
          return moment(moment.unix(value)).fromNow();
        },
      },
      {
        title: "Sender",
        dataIndex: "sender",
        render: (value) => {
          return (
            <Tooltip title={value}>
              <span style={{ color: "#3498db" }}>
                {value.substring(0, 17)}...
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Receiver",
        dataIndex: "receiver",
        render: (value) => {
          return (
            <Tooltip title={value}>
              <span style={{ color: "#3498db" }}>
                {value.substring(0, 17)}...
              </span>
            </Tooltip>
          );
        },
      },
      {
        title: "Tx Fee",
        dataIndex: "gas_used",
        render: (value) => {
          let price = Main.gasFeeToHKD(current_eth, value);
          return `${value} Gwei ≈ ${price} HKD`;
        },
      },
      // {
      //   title: "User ID",
      //   dataIndex: "user_id",
      // },
      // {
      //   title: "Admin ID",
      //   dataIndex: "admin_id",
      // },
      // {
      //   title: "User Address",
      //   dataIndex: "user_address",
      //   render: (value) => {
      //     return (
      //       <Tooltip title={value}><span style={{ color: '#3498db' }}>{value.substring(0, 17)}...</span></Tooltip>
      //     )
      //   }
      // },
      // {
      //   title: "Transaction Index",
      //   dataIndex: "transaction_index",
      // },

      // {
      //   title: "Block Hash",
      //   dataIndex: "block_hash",
      // },
      // {
      //   title: "Contract Address",
      //   dataIndex: "contract_address",
      // },
      // {
      //   title: "Cumulative Gas Used",
      //   dataIndex: "cumulative_gas_used",
      // },
    ];
    return columns;
  };

  const handleScan = (data) => {
    if (data) {
      setQrCodeResult(data);
    }
  };
  const handleError = (err) => {
    console.error(err);
  };

  return (
    <div className="transaction" style={{ padding: '40px 0px'}}>
    <Layout.Header style={{ height: 120, background: 'white'}}>
         <Row align="center" justify="center" >
           <Col><img src="/etherscan.png" style={{ objectFit: 'cover', width: 80}} />
          <span style={{ fontSize: 24, fontWeight: 'bold' }}>Smart Ticket Scan</span></Col>
           </Row>
        </Layout.Header>
    <Row justify="center" align="center">
      <Col span={24}>
        
      </Col>
      <Col span={22}>
        <Table
          className="custom-table"
          loading={loading}
          rowKey={tableIDName}
          scroll={{ x: "max-content" }}
          dataSource={dataList}
          columns={setTableHeader()}
        />
      </Col>

      {/* <Modal
        visible={modalVisible}
        closable
        // width="400"
        title={selectedEvent.name}
        footer={null}
        onCancel={() => setModalVisible(false)}
      >
        <div>

          <QrReader
            delay={300}
            onError={handleError}
            onScan={handleScan}
            style={{ width: '100%' }}
          />
          <p>{qrCodeResult}</p>
        </div>

      </Modal> */}
    </Row>
    </div>
  );
};

export default TransactionHistoryList;
