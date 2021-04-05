import React from "react";
import { ReloadOutlined } from "@ant-design/icons";
import { Spin, Skeleton, Layout, Menu, Row, Col } from "antd";

const LoadingScreen = () => {
  const antIcon = (
    <ReloadOutlined style={{ fontSize: 36, color: "#2b2b2b" }} spin />
  );
  return (
    <Layout>
      <Layout.Header
        style={{
          background: "#FFFFFF",
          boxShadow: "0 4px 2px -2px rgba(0,0,0,.2)",
          marginBottom: 4,
          height: 80,
        }}
      >
        <Row justify="space-between" align="middle" style={{ height: "100%" }}>
          <Col>
            <Skeleton.Avatar size="large" active style={{ marginTop: 12 }} />
          </Col>
          <Col>
            <Menu
              theme="light"
              mode="horizontal"
              style={{ background: "transparent" }}
            >
              <Menu.Item>
                <Skeleton.Avatar active style={{ marginTop: 18 }} />
              </Menu.Item>
              <Menu.Item>Logout</Menu.Item>
            </Menu>
          </Col>
        </Row>
      </Layout.Header>
      <Layout style={{ minHeight: 700 }}>
        <Layout.Sider style={{ backgroundColor: "#fff" }}>
          <Row justify="center">
            <Col span={18}>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </Col>
          </Row>
        </Layout.Sider>
        <Layout.Content>
          <Row justify="center">
            <Col span={18}>
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
              <Skeleton active />
            </Col>
          </Row>
        </Layout.Content>
      </Layout>
      <div
        style={{
          // opacity: 0.8,
          width: "100%",
          height: "100%",
          position: "absolute",
          backgroundColor: "rgb(255, 255, 255, 0.8)",
        }}
      >
        <div style={{ position: "absolute", top: "50%", left: "50%" }}>
          <Spin size="large" indicator={antIcon} />
          <p
            style={{
              color: "#2b2b2b",
              fontSize: 16,
              transform: "translate(-35%, 0%)",
              marginTop: 20,
            }}
          >
            Data Processing ...
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default LoadingScreen;
