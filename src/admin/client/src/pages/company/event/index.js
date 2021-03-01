import React, { useState, useEffect } from 'react';
import { Table, Button, Row, Col, Tooltip } from 'antd';
import {
  FileProtectOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  EditOutlined
} from "@ant-design/icons";
import _ from 'lodash';
import moment from 'moment';
import { useLocation, Link } from "react-router-dom";
import EventForm from './Form';
import EventInfo from './Info'
import { useSelector } from "react-redux";
import AppLayout from "../../../components/AppLayout";

import * as Service from '../../../core/Service';
import * as UI from "../../../core/UI";

const involvedModelName = "event";
const title = "Events";
const selectedKey = "company_event";
const tableIDName = "event_id";

const CompanyEvent = (props) => {
  const location = useLocation();
  const [dataSource, setDataSource] = useState([]);
  const [again, setAgain] = useState(false);
  const [isDraft, setDraft] = useState(false);
  const sc_events = useSelector((state) => state.smartContract.sc_events);

  useEffect(() => {
    getInitalState();

    // if (location.state) {
    //   setAgain(location.state.again);
    // }
  }, [])

  const getInitalState = async () => {
    let resp = await Service.call('get', '/api/company/event');
    setDataSource(resp.eventRc);
  }


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
            <Row gutter={[8, 0]}>
              {record.status === 0 &&
                <Col>
                  <Link
                    to={{
                      pathname: "/company/event/form",
                      state: { event_id: record.event_id },
                    }}
                  >
                    <Tooltip
                      title="Revise"
                    >
                      <Button
                        shape="circle"
                        style={{
                          marginLeft: 8,
                          color: '#000'
                        }}
                        icon={<EditOutlined />}
                      />
                    </Tooltip>
                  </Link>
                </Col>
              }
              {(record.status > 0 || record.status === -1) &&
                <Col>
                  <Link
                    to={{
                      pathname: "/company/event/info",
                      state: { dataSource: record, event_id: 0 },
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
              }
              {sc_events[record.event_id] && (
                <Col>
                  <Tooltip title={"On the Blochain Already"}>
                    <Button shape="circle" icon={<GlobalOutlined />} />
                  </Tooltip>
                </Col>
              )}
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
      // {
      //   title: 'Mobile',
      //   dataIndex: 'mobile',
      //   sorter: (a, b) => a.mobile.localeCompare(b.mobile)
      // },
      // {
      //   title: 'Email',
      //   dataIndex: 'email',
      //   sorter: (a, b) => a.email.localeCompare(b.email)
      // },
      // {
      //   title: 'Wallet',
      //   dataIndex: 'wallet',
      //   sorter: (a, b) => a.wallet.localeCompare(b.wallet)
      // }
    ];
    return columns;
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Row gutter={[0, 20]}>
        <Col>
          <Link to="/company/event/form">
            <Button className="custom-btn" htmlType="submit">
              Create Event
          </Button>
          </Link>
        </Col>
      </Row>
      <Table
        rowKey={tableIDName}
        scroll={{ x: "max-content" }}
        dataSource={dataSource}
        columns={setTableHeader()}
      />
    </AppLayout>
  );
}

export default CompanyEvent;
