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
import { GlobalOutlined } from "@ant-design/icons";
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

const involvedModelName = "event";
const title = "Events";
const selectedKey = "event_list";
const tableIDName = "event_id";

const EventList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(true);
  const sc_events = useSelector((state) => state.smartContract.sc_events);

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

  const setTableHeader = () => {
    const columns = [
      {
        title: "",
        dataIndex: tableIDName,
        render: (value, record) => {
          let button;
          // console.log('sc_events', sc_events);
          if (!_.isEmpty(sc_events)) {
            if (sc_events[record.event_id])
              button = (
                <Col>
                  <Tooltip title={"On the Blochain Already"}>
                    <Button shape="circle" icon={<GlobalOutlined style={{color: '#1890ff'}}/>} />
                  </Tooltip>
                </Col>
              )
          }
          let color = "#000000";
          let icon = "";
          let wordings = "";
          if (record.status === 1) {
            color = "#AA0000";
            icon = "stop";
            wordings = "Disable";
          } else {
            color = "#00AA00";
            icon = "check";
            wordings = "Enable";
          }
          return (
            <Row gutter={[8, 0]}>
              <Col>
                <Link
                  to={{
                    pathname: "/admin/event/info",
                    state: { dataSource: record },
                  }}
                >
                  <Tooltip
                    title={
                      record.is_approval_doc_verified
                        ? "Verified"
                        : "Check verification"
                    }
                  >
                    <Button
                      shape="circle"
                      style={{
                        marginLeft: 8,
                        color: record.is_approval_doc_verified
                          ? "green"
                          : "black",
                      }}
                      icon={
                        record.is_approval_doc_verified ? (
                          <FileProtectOutlined />
                        ) : (
                            <FileSearchOutlined />
                          )
                      }
                    />
                  </Tooltip>
                </Link>
              </Col>
              {button}
            </Row>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value) => UI.displayApplicationStatus(value),
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: "Event Name",
        dataIndex: "name",
        sorter: (a, b) => a.name.localeCompare(b.name),
      },
      {
        title: "Start Time",
        dataIndex: "start_time",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
        sorter: (a, b) => a.start_time.localeCompare(b.start_time),
      },
      {
        title: "End Time",
        dataIndex: "end_time",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
        sorter: (a, b) => a.end_time.localeCompare(b.end_time),
      },
      {
        title: "Start Sell Date",
        dataIndex: "released_date",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
        sorter: (a, b) => a.released_date.localeCompare(b.released_date),
      },
      {
        title: "End Sell Date",
        dataIndex: "close_date",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
        sorter: (a, b) => a.close_date.localeCompare(b.close_date),
      },
    ];
    return columns;
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Table
        loading={loading}
        rowKey={tableIDName}
        scroll={{ x: "max-content" }}
        dataSource={dataList}
        columns={setTableHeader()}
      />
    </AppLayout>
  );
};

export default EventList;
