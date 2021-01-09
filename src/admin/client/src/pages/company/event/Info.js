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
} from "antd";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";
import AppLayout from "../../../components/AppLayout";
import ImageModal from "../../../components/ImageModal";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

const involvedModelName = "event";
const title = "event KYC";
const selectedKey = "event_kyc";
const tableIDName = "event_kyc_id";

const EventInfo = () => {
  const app = useSelector((state) => state.app);
  const history = useHistory();
  const [event, setEvent] = useState({});

  useEffect(() => {
    getInitalState()
  }, [])

  const getInitalState = async () => {
    let resp = await Service.call('get', '/api/event');
    if (resp.eventRc.event_id > 0) {
      setEvent(resp.eventRc);
    }
  }

  const applyKycAgain = async (e) => {
    await Service.call("patch", "/api/event", {
      admin_id: event.admin_id,
      is_approval_doc_verified: 0,
      is_seat_doc_verified: 0
    });
    history.push("/company/event", {again: true});
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <div style={{ marginBottom: 100 }}>
        <Descriptions
          title="Event Information"
          bordered
          column={1}
          layout="vertical"
        >
          <Descriptions.Item label="Status">
            <Badge
              status="processing"
              text={UI.displayApplicationStatus(event.status)}
            />
          </Descriptions.Item>
          {event.status === -1 && (
            <Descriptions.Item label="Reject Reason(s)" style={{color: 'black', fontWeight: 'bold'}}>
            <span style={{color: 'black', fontWeight: 'bold'}}>{ event.reject_reason}</span>
            </Descriptions.Item>
          )}
          {/* {event.check_by !== 0 && (
            <Descriptions.Item label="Check By">
              {event.check_by}
            </Descriptions.Item>
          )} */}
          <Descriptions.Item label="event Name">
            {event.name}
          </Descriptions.Item>
          <Descriptions.Item label="Short Description">{event.short_desc}</Descriptions.Item>
          <Descriptions.Item label="Long Description">{event.long_desc}</Descriptions.Item>
          <Descriptions.Item label="event Code">
            {event.event_code}
          </Descriptions.Item>
          <Descriptions.Item label="type">
            {event.type}
          </Descriptions.Item>
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
          <Descriptions.Item label="event Size">
            {event.event_size}
          </Descriptions.Item>
          <Descriptions.Item
            label="event Document(Click to zoom)"
            contentStyle={{ padding: 20 }}
          >
            <Image.PreviewGroup>
              <Image
                id="event_doc"
                width={300}
                src={`${app.config.STATIC_SERVER_URL}/media/${event.approval_doc}`}
              />
            </Image.PreviewGroup>
          </Descriptions.Item>
        </Descriptions>
        {event.status === -1 && (<Button onClick={applyKycAgain} style={{margin: 20}} type="primary">Apply again</Button>)}
      </div>
    </AppLayout>
  );
};

export default EventInfo;