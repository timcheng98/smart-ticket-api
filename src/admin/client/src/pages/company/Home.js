import React, { useEffect, useState } from "react";
import "@ant-design/compatible/assets/index.css";
import { Layout, Menu, Row, Col, Card, Upload, message, Button, Spin, Tag } from "antd";
import { InboxOutlined } from "@ant-design/icons";
import AppLayout from "../../components/AppLayout";
import _ from "lodash";
import moment from "moment";
import * as Service from "../../core/Service";

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;

const title = "Home";
const selectedKey = "dashboard";

const Home = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getInitialData();
  }, []);

  const getInitialData = async () => {
    setLoading(true);
    let result = await Service.call("get", "/api/dashboard");
    setData(result);
    setLoading(false);
  };

  if (loading) return <AppLayout title={title} selectedKey={selectedKey}><Spin /></AppLayout>;

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Content
        style={{
          height: "100%",
        }}
      >
        Welcome
      </Content>
    </AppLayout>
  );
};

export default Home;
