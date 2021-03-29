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
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Row,
  Col,
} from "antd";
import QrReader from 'react-qr-reader'
import { GlobalOutlined, QrcodeOutlined } from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import * as UI from "../../../core/UI";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import AppLayout from "../../../components/AppLayout";
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

const TransactionHistoryList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const sc_events = useSelector((state) => state.smartContract.sc_events);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrCodeResult, setQrCodeResult] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});

  useEffect(() => {
    getAllData();
    setLoading(false)
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

  console.log(dataList);

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
        title: "Status",
        dataIndex: "status",
        render: (value) => UI.displayStatus(value, { "1": 'Confirm', "0": 'Fail', "-1": 'Fail', default: 'Fail' }),
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: "User ID",
        dataIndex: "user_id",
      },
      {
        title: "Admin ID",
        dataIndex: "admin_id",
      },
      {
        title: "User Address",
        dataIndex: "user_address",
      },
      {
        title: "Sender",
        dataIndex: "sender",
      },
      {
        title: "Receiver",
        dataIndex: "receiver",
      },
      {
        title: "Transaction Hash",
        dataIndex: "transaction_hash",
      },
      {
        title: "Transaction Index",
        dataIndex: "transaction_index",
      },
     
      {
        title: "Block Hash",
        dataIndex: "block_hash",
      },
      {
        title: "Block Number",
        dataIndex: "block_number",
      },
     
      {
        title: "Contract Address",
        dataIndex: "contract_address",
      },
      {
        title: "Cumulative Gas Used",
        dataIndex: "cumulative_gas_used",
      },
      {
        title: "Gas Used",
        dataIndex: "gas_used",
      },
      {
        title: "Create Time",
        dataIndex: "ctime",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
      },
    ];
    return columns;
  };

  const handleScan = data => {
    if (data) {
      setQrCodeResult(data);

    }
  }
  const handleError = err => {
    console.error(err)
  }

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Table
        className="custom-table"
        loading={loading}
        rowKey={tableIDName}
        scroll={{ x: "max-content" }}
        dataSource={dataList}
        columns={setTableHeader()}
      />
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
    </AppLayout>
  );
};

export default TransactionHistoryList;
