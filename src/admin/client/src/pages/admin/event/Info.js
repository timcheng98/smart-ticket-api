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
  Tabs,
  Descriptions,
  Badge,
  Image,
  Row,
  Col,
  Input,
} from "antd";
import {
  CheckCircleOutlined, GlobalOutlined
} from '@ant-design/icons';
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";
import AppLayout from "../../../components/AppLayout";
// import { eventAPI } from '../../../smart-contract/api/Event';
import ImageModal from "../../../components/ImageModal";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const involvedModelName = "event";
const title = "Events";
const selectedKey = "event_list";
const tableIDName = "event_id";
// const eventAPI = new EventAPI();

const EventInfo = () => {
  const app = useSelector((state) => state.app);
  const sc_event_api = useSelector((state) => state.smartContract.sc_event_api);
  const sc_events = useSelector((state) => state.smartContract.sc_events);
  const [isReject, setReject] = useState(false);
  const [text, setText] = useState("");
  const history = useHistory();
  const [dataSource, setDataSource] = useState({});

  const [events, setEvent] = useState({})

  useEffect(() => {
    getInitalState();
  }, [])

  const getInitalState = async () => {
    setDataSource(history.location.state.dataSource)
  }


  const confirmReject = async (e) => {
    await Service.call("patch", "/api/admin/event", {
      reject_reason: text,
      admin_id: dataSource.admin_id,
      is_approval_doc_verified: 0,
      is_seat_doc_verified: 0,
      status: -1
    });
    history.push("/admin/event/list");
  };

  console.log('events', events)

  const confirmApprove = async (e) => {
    await Service.call("patch", "/api/admin/event", {
      admin_id: dataSource.admin_id,
      is_approval_doc_verified: 1,
      is_seat_doc_verified: 1,
      status: 2
    });
    history.push("/admin/event/list");
  };

  const onChainProcess = async (e) => {

    await sc_event_api.autoSignEventTransaction(dataSource)
  }

  const onTextChange = (e) => {
    setText(e.target.value);
  };


  return (
    <AppLayout title={title} selectedKey={selectedKey}>

      <Tabs type="card">
        <TabPane tab="Progress" key="1">
          <Row gutter={[0, 12]}>
            <Badge
              status="processing"
              text={UI.displayApplicationStatus(dataSource.status)}
            />
          </Row>
          {sc_events[dataSource.event_id] && (
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
          >
            {dataSource.status === -1 && (
              <Descriptions.Item label="Reject Reason(s)" style={{ color: 'black', fontWeight: 'bold' }}>
                <span style={{ color: 'black', fontWeight: 'bold' }}>{dataSource.reject_reason}</span>
              </Descriptions.Item>
            )}
            {/* {dataSource.check_by !== 0 && (
            <Descriptions.Item label="Check By">
              {dataSource.check_by}
            </Descriptions.Item>
          )} */}
            <Descriptions.Item label="Event Name">
              {dataSource.name}
            </Descriptions.Item>
            <Descriptions.Item label="Short Description">{dataSource.short_desc}</Descriptions.Item>
            <Descriptions.Item label="Long Description">{dataSource.long_desc}</Descriptions.Item>
            <Descriptions.Item label="Event Code">
              {dataSource.event_code}
            </Descriptions.Item>
            <Descriptions.Item label="type">
              {dataSource.type}
            </Descriptions.Item>

            <Descriptions.Item label="Address">
              {dataSource.address}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {dataSource.region}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              {dataSource.location}
            </Descriptions.Item>
            <Descriptions.Item label="Country">
              {dataSource.country}
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
              {moment.unix(dataSource.start_time).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="End Time">
              {moment.unix(dataSource.end_time).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Released Sell Date">
              {moment.unix(dataSource.released_date).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
            <Descriptions.Item label="Close Sell Date">
              {moment.unix(dataSource.close_date).format("YYYY-MM-DD HH:mm")}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Documents" key="4">
          <Descriptions
            bordered
            column={1}
          >
            <Descriptions.Item
              label="Event Document(Click to zoom)"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  id="event_doc"
                  width={300}
                  src={`${app.config.STATIC_SERVER_URL}/media/${dataSource.approval_doc}`}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      <div style={{ marginBottom: 100 }}>

        <Row>
          {
            sc_events[dataSource.event_id] && (
              <Link
                to={{
                  pathname: "/admin/event/ticket",
                  state: { dataSource, eventId: sc_events[dataSource.event_id].eventId },
                }}
              >
                <Button
                  style={{ margin: 20 }}
                  type="primary"
                // onClick={onChainProcess}
                >
                  Create Tickets
              </Button>
              </Link>

            )
          }
          {
            dataSource.status === 2 && !sc_events[dataSource.event_id] && (
              <Button
                style={{ margin: 20 }}
                type="primary"
                onClick={onChainProcess}
              >
                Create Event On BlockChain
              </Button>
            )
          }
          {(!isReject && dataSource.status !== 2) && (
            <>
              <Button
                style={{ margin: 20 }}
                type="primary"
                onClick={confirmApprove}
              >
                Approval
               </Button>
              <Button
                type="danger"
                style={{ margin: 20 }}
                onClick={() => setReject(true)}
              >
                Reject
              </Button>
            </>
          )}
        </Row>
        {isReject && (
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Reject Reason(s)">
              <Input.TextArea
                rows={4}
                placeholder="Reasons...."
                onChange={onTextChange}
              />
              <Row gutter={[24, 0]}>
                <Button
                  style={{ margin: 20 }}
                  type="primary"
                  onClick={confirmReject}
                >
                  Confirm
                </Button>
                <Button
                  style={{ margin: 20 }}
                  type="primary"
                  onClick={() => setReject(false)}
                >
                  Cancel
                </Button>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    </AppLayout>
  );
};

export default EventInfo;
