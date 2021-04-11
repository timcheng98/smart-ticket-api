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
  Typography,
  message,
} from "antd";
import QrReader from "react-qr-reader";
import {
  CheckCircleOutlined,
  LoadingOutlined,
  CloseCircleOutlined,
} from "@ant-design/icons";
import moment from "moment";
import _ from "lodash";
import * as UI from "../../../core/UI";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import AppLayout from "../../../components/AppLayout";
import logo from "../../../assets/Logo_Black.png";

// import CompanyForm from './Form';
import { Link, useLocation } from "react-router-dom";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";
const queryString = require("query-string");

const debug = require("debug")("app:admin:client:src:AdvertisementList");

const { Title } = Typography;
const involvedModelName = "event";
const title = "Events";
const selectedKey = "event_list";
const tableIDName = "event_id";

const TicketVerification = (props) => {
  const location = useLocation();
  const [error, setError] = useState("");
  const [event, setEvent] = useState({});
  const [loading, setLoading] = useState(true);
  const app = useSelector((state) => state.app);

  useEffect(() => {
    verifyTicket();
  }, []);

  const verifyTicket = async () => {

    if (!app.is_admin)
      return message.warning("Invalid Session. Please Login Again");
    const { user_id, eventId, ticketId, ts } = queryString.parse(
      location.search
    );

    let obj = {
      user_id: user_id || -1,
      event_id: eventId || -1,
      ticket_id: ticketId || -1,
      status: 0,
      message: ''
    }
    let user = await Service.call("get", `/api/admin/user/single/${user_id}`);
    if (
      _.isEmpty(user_id) ||
      _.isEmpty(eventId) ||
      _.isEmpty(ticketId) ||
      _.isEmpty(ts)
    ) {
      obj.message = 'Invalid URL';
      await Service.call("post", `/api/entry/audit_trail`, obj);
      setLoading(false);
      return setError("Invalid URL");
    }
    if (!user) {
      obj.message = 'User do not exist';
      await Service.call("post", `/api/entry/audit_trail`, obj);
      setLoading(false);
      return setError("User do not exist");
    }
    let event = await Service.call(
      "get",
      `/api/sc/event/single?eventId=${eventId}`
    );
    if (!event) {
      obj.message = 'Event NOT Found';
      await Service.call("post", `/api/entry/audit_trail`, obj);
      setLoading(false);
      return setError("Event NOT Found");
    }

    let ticket = await Service.call(
      "get",
      `/api/sc/event/ticket/owner/single?ticketId=${ticketId}`
    );
    if (ticket !== user.wallet_address) {
      obj.message = 'Ticket Owner NOT match';
      await Service.call("post", `/api/entry/audit_trail`, obj);
      setLoading(false);
      return setError("Ticket Owner NOT match");
    }

    setEvent(event);
    obj.message = 'Success';
    obj.status = 1;
    await Service.call("post", `/api/entry/audit_trail`, obj);
    setLoading(false);
    console.log("ticket", ticket);
    console.log("event", event);
    console.log(user);
  };

  if (loading)
    return (
      <Row
        justify="center"
        style={{
          padding: "40px 0px",
          height: "100vh",
          backgroundColor: "rgb(14, 19, 29)",
          color: "#fff",
        }}
      >
        <LoadingOutlined
          style={{
            color: "#fff",
            fontSize: 100,
            display: "absolute",
            marginTop: "30vh",
          }}
        />
      </Row>
    );

  return (
    <Row
      justify="center"
      style={{
        padding: "40px 0px",
        height: "100vh",
        backgroundColor: "rgb(14, 19, 29)",
        color: "#87d068",
      }}
    >
      <Col>
        <img
          alt=""
          className="company-logo"
          src={logo}
          style={{ width: "100%", maxWidth: "200px", marginBottom: "30px" }}
        />
      </Col>
      {!_.isEmpty(event) && (
        <Col span={22} style={{ textAlign: "center" }}>
          <h1 className="company-logo" style={{ color: "#87d068", fontSize: 32 }}>
            {event.name}
          </h1>
        </Col>
      )}
      <Col className="company-logo" span={22} style={{ textAlign: "center" }}>
        {error === "" ? (
          <>
            <CheckCircleOutlined
              style={{ color: "#87d068", fontSize: 120, marginBottom: 30 }}
            />
            <h1 style={{ color: "#87d068", fontSize: 64, wordSpacing: 2 }}>
              PASS
            </h1>
          </>
        ) : (
          <>
            <CloseCircleOutlined
              style={{ color: "red", fontSize: 120, marginBottom: 30 }}
            />
            <h1 style={{ color: "red", fontSize: 64, wordSpacing: 2 }}>
              INVALID
            </h1>
            <p style={{ color: "red", fontSize: 32 }}>{error}</p>
          </>
        )}
      </Col>
    </Row>
  );
};

export default TicketVerification;
