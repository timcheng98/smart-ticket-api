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
  Spin,
  Descriptions,
  Badge,
  Image,
  Row,
  Col,
  Input,
  Tabs
} from "antd";
import { useHistory, Link, useLocation } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";
import AppLayout from "../../../components/AppLayout";
import ImageModal from "../../../components/ImageModal";
import {
  FileProtectOutlined,
  FileSearchOutlined,
  GlobalOutlined
} from "@ant-design/icons";
const { TabPane } = Tabs;

const involvedModelName = "event";
const title = "Event Detail";
const selectedKey = "company_event";
const tableIDName = "event_id";

const EventInfo = () => {
  const app = useSelector((state) => state.app);
  const history = useHistory();
  const location = useLocation();
  const [event, setEvent] = useState({});
  const sc_events = useSelector((state) => state.smartContract.sc_events);

  useEffect(() => {
    getInitalState()
  }, [location])

  const getInitalState = async () => {
    // let resp = await Service.call('get', '/api/event');
    // if (resp.eventRc.event_id > 0) {
    setEvent(location.state.dataSource);
    // }
  }

  const applyKycAgain = async (e) => {
    // await Service.call("patch", "/api/event", {
    //   admin_id: event.admin_id,
    //   is_approval_doc_verified: 0,
    //   is_seat_doc_verified: 0
    // });
    history.push("/company/event/form", { event_id: event.event_id });
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Tabs>
        <TabPane tab="Progress" key="1">
          <Row gutter={[0, 24]} style={{ marginTop: 12 }}>
            <Badge
              status="processing"
              text={UI.displayApplicationStatus(event.status)}
            />
          </Row>
          {event.status === -1 && (
            <Row>
              <Col span={24}>
                <Descriptions
                  // title="Event Information"
                  bordered
                  column={1}
                  layout="vertical"
                >
                  <Descriptions.Item label="Reject Reason(s)" style={{ color: 'black', fontWeight: 'bold' }}>
                    <span style={{ color: 'black', fontWeight: 'bold' }}>{event.reject_reason}</span>
                  </Descriptions.Item>
                </Descriptions>
              </Col>
            </Row>
          )}
          {sc_events[event.event_id] && (
            <Row gutter={[0, 20]}>
              <Col>
                <Badge
                  status="processing"
                  text={
                    <Tag
                      icon={<GlobalOutlined style={{ fontSize: 12 }} />}
                      style={{ padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12 }}
                      color="blue"
                    >
                      On the Blochain Already
                    </Tag>
                  }
                />
              </Col>
            </Row>
          )}
        </TabPane>
        <TabPane tab="Basic Information" key="2">
          <Descriptions
            // title="Event Information"
            bordered
            column={1}
            layout="vertical"
          >
            {/* {event.check_by !== 0 && (
            <Descriptions.Item label="Check By">
              {event.check_by}
            </Descriptions.Item>
          )} */}
            <Descriptions.Item label="Event Name">
              {event.name}
            </Descriptions.Item>
            <Descriptions.Item label="Short Description">{event.short_desc}</Descriptions.Item>
            <Descriptions.Item label="Long Description">{event.long_desc}</Descriptions.Item>
            <Descriptions.Item label="event Code">
              {event.event_code}
            </Descriptions.Item>
            <Descriptions.Item label="Type">
              {event.type}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {event.address}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {event.region}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {event.location}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {event.country}
            </Descriptions.Item>
            <Descriptions.Item label="Event Size">
              {event.event_size}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Date" key="3">
          <Descriptions
            bordered
            column={1}
            layout="vertical"
          >
            <Descriptions.Item label="Start Time">
              {moment.unix(event.start_time).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {moment.unix(event.end_time).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Released Sell Date">
              {moment.unix(event.released_date).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Close Sell Date">
              {moment.unix(event.close_date).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Documents" key="4">
          <Descriptions
            bordered
            column={1}
            layout="vertical"
          >
            <Descriptions.Item
              label="Event Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  id="event_doc"
                  // width={300}
                  style={{width: '100%', maxWidth: 300}}
                  src={event.approval_doc}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      {event.status === -1 && (<Button onClick={applyKycAgain} style={{ margin: 20 }} type="primary">Apply again</Button>)}
    </AppLayout>
  );
};

export default EventInfo;