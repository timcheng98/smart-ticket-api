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
import { CheckCircleOutlined, GlobalOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";
import * as CommonActions from "../../../redux/actions/common";
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
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const sc_event_api = useSelector((state) => state.smartContract.sc_event_api);
  const sc_events = useSelector((state) => state.smartContract.sc_events);
  const [isReject, setReject] = useState(false);
  const [text, setText] = useState("");
  const history = useHistory();
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);
  const [events, setEvent] = useState({});

  useEffect(() => {
    // setLoading(true);
    // if (sc_events) {
    getInitalState();
    // }
    // setLoading(false);
  }, []);

  const getInitalState = async () => {
    setDataSource(history.location.state.dataSource);
  };

  const confirmReject = async (e) => {
    await Service.call("patch", "/api/admin/event", {
      reject_reason: text,
      is_approval_doc_verified: 0,
      is_seat_doc_verified: 0,
      approval_doc: "",
      status: -1,
      event_id: dataSource.event_id,
    });
    history.push("/admin/event/list");
  };

  const confirmApprove = async (e) => {
    await Service.call("patch", "/api/admin/event", {
      event_id: dataSource.event_id,
      is_approval_doc_verified: 1,
      is_seat_doc_verified: 1,
      reject_reason: "",
      status: 2,
    });
    history.push("/admin/event/list");
  };

  const onChainProcess = async (e) => {
    let postObj = dataSource;
    delete postObj.type;
    delete postObj.status;
    delete postObj.reject_reason;
    delete postObj.admin_id;
    delete postObj.is_approval_doc_verified;
    delete postObj.is_seat_doc_verified;
    delete postObj.reject_reason;

    dispatch(CommonActions.setLoading(true));
    await Service.call("post", "/api/sc/event", { event: postObj });
    let events = await Service.call("get", `/api/sc/event`);
    dispatch(CommonActions.setSCEvents(_.keyBy(events, "event_id")));
    dispatch(CommonActions.setLoading(false));
    history.push("/admin/event/info");
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  console.log("sc_events", dataSource.event_id);
  console.log("sc_events", sc_events);
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
          {!_.isEmpty(sc_events[dataSource.event_id]) && (
            <Row gutter={[0, 20]}>
              <Col>
                <Badge
                  status="processing"
                  text={
                    <Tag
                      icon={<GlobalOutlined style={{ fontSize: 12 }} />}
                      style={{
                        padding: "6px 15px",
                        border: "none",
                        borderRadius: 15,
                        fontWeight: "bold",
                        fontSize: 12,
                      }}
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
              {dataSource.name}
            </Descriptions.Item>
            <Descriptions.Item label="Performer">
              {dataSource.performer}
            </Descriptions.Item>
            <Descriptions.Item label="Organization">
              {dataSource.organization}
            </Descriptions.Item>
            <Descriptions.Item label="Target">
              {dataSource.target}
            </Descriptions.Item>
            <Descriptions.Item label="Need KYC?">
              {dataSource.need_kyc === 1 ? "Yes" : "No"}
            </Descriptions.Item>
            <Descriptions.Item label="Categories">
              {dataSource.categories &&
                _.map(JSON.parse(dataSource.categories), (value) => (
                  <Tag color="blue">{value}</Tag>
                ))}
            </Descriptions.Item>
            <Descriptions.Item label="Tags">
              {dataSource.tags &&
                _.map(JSON.parse(dataSource.tags), (value) => (
                  <Tag color="blue">{value}</Tag>
                ))}
            </Descriptions.Item>
            <Descriptions.Item label="Short Description">
              {dataSource.short_desc}
            </Descriptions.Item>
            <Descriptions.Item label="Long Description">
              {dataSource.long_desc}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Location" key="3">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Country">
              {dataSource.country}
            </Descriptions.Item>
            <Descriptions.Item label="Region">
              {dataSource.region}
            </Descriptions.Item>
            <Descriptions.Item label="District">
              {dataSource.district}
            </Descriptions.Item>
            <Descriptions.Item label="Venue">
              {dataSource.venue}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {dataSource.address}
            </Descriptions.Item>
            <Descriptions.Item label="Location">
              <iframe
                src={`https://maps.google.com/maps?q=${dataSource.latitude}, ${dataSource.longitude}&z=19&output=embed&language=zh-HK`}
                width="100%"
                height="400"
                frameborder="0"
              ></iframe>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Contact Method" key="4">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Email">
              {dataSource.email}
            </Descriptions.Item>
            <Descriptions.Item label="Contact Number">
              {dataSource.contact_no}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Date" key="5">
          <Descriptions bordered column={1} layout="vertical">
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
        <TabPane tab="Documents" key="6">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item
              label="Event Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  id="event_doc"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={dataSource.approval_doc}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item
              label="Seat Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  id="seat_doc"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={dataSource.seat_doc}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item label="Thumbnail" contentStyle={{ padding: 20 }}>
              <Image.PreviewGroup>
                <Image
                  id="thumbnail"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={dataSource.thumbnail}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item label="Banner 1" contentStyle={{ padding: 20 }}>
              <Image.PreviewGroup>
                <Image
                  id="banner_1"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={dataSource.banner_1}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item label="Banner 2" contentStyle={{ padding: 20 }}>
              <Image.PreviewGroup>
                <Image
                  id="banner_2"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={dataSource.banner_2}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      <div style={{ marginBottom: 100 }}>
        <Row>
          {sc_events[dataSource.event_id] && (
            <Link
              to={{
                pathname: "/admin/event/ticket",
                state: {
                  dataSource,
                  eventId: sc_events[dataSource.event_id].eventId,
                },
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
          )}
          {dataSource.status === 2 && !sc_events[dataSource.event_id] && (
            <Button
              style={{ margin: 20 }}
              type="primary"
              onClick={onChainProcess}
            >
              Create Event On BlockChain
            </Button>
          )}
          {!isReject && dataSource.status !== 2 && (
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
                  type="dashed"
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
