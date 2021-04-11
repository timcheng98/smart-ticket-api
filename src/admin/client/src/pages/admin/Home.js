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
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card hoverable title="User" style={{ width: "100%" }}>
              <p>Total No. User: {data.total_user}</p>
              <p><Tag color="#87d068">KYC Status</Tag></p>
              <p>
                Success: {_.filter(data.total_user_kyc, { status: 1 }).length}
              </p>
              <p>
                Failed: {_.filter(data.total_user_kyc, { status: 0 }).length}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable title="Company" style={{ width: "100%" }}>
              <p>Total No. Company: {data.total_company_kyc.length}</p>
              <p> 
              <Tag color="#87d068">KYC Status</Tag>
              </p>
              <p>
                Success:{" "}
                {_.filter(data.total_company_kyc, { status: 2 }).length}
              </p>
              <p>
                Pending:{" "}
                {_.filter(data.total_company_kyc, { status: 1 }).length}
              </p>
              <p>
                Draft:{" "}
                {_.filter(data.total_company_kyc, { status: 0 }).length}
              </p>
              <p>
                Failed:{" "}
                {_.filter(data.total_company_kyc, { status: -1 }).length}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable title="Event" style={{ width: "100%" }}>
              <p>Total No. Event: {data.total_event.length}</p>
              <p><Tag color="#87d068">Status</Tag></p>
              <p>Success: {_.filter(data.total_event, { status: 2 }).length}</p>
              <p>Pending: {_.filter(data.total_event, { status: 1 }).length}</p>
              <p>Failed: {_.filter(data.total_event, { status: -1 }).length}</p>
            </Card>
          </Col>
        </Row>
        <Row gutter={[24, 24]}>
          <Col span={8}>
            <Card hoverable title="Payment Transaction" style={{ width: "100%" }}>
              <p>
                Total No. Payment Transaction: {data.payment_transaction.length}
              </p>
              <p>
                Total Amount: $
                {_.round(_.sumBy(data.payment_transaction, "amount"), 2)}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable title="Blockchain Transaction" style={{ width: "100%" }}>
              <p>
                Block Number:{" "}
                {
                  data.blockchain_transaction.length > 0 ? data.blockchain_transaction[
                    data.blockchain_transaction.length - 1
                  ].block_number : 0
                }
              </p>
              <p>
                Total Transaction: {data.blockchain_transaction.length}
              </p>
              <p>
                Admin Transaction: {_.filter(data.blockchain_transaction, (item) => {
                  return item.admin_id > 0
                }).length}
              </p>
              <p>
                User Transaction: {_.filter(data.blockchain_transaction, (item) => {
                  return item.user_id > 0
                }).length}
              </p>
            </Card>
          </Col>
          <Col span={8}>
            <Card hoverable title="Entry Logs" style={{ width: "100%" }}>
              <p>
                Total Entry Logs:{" "}
                {
                  data.entry_logs.length
                }
              </p>
              <p>Success: {_.filter(data.entry_logs, { status: 1 }).length}</p>
              <p>Rejected: {_.filter(data.entry_logs, { status: 0 }).length}</p>
            </Card>
          </Col>
        </Row>
      </Content>
    </AppLayout>
  );
};

export default Home;
