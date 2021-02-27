import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setConfig,
  setAdmin,
  setAuth,
  setCompanyAdmin,
  setIsAdmin,
  setSCEventAPI,
  setSCEvents,
  setLoading,
} from "../redux/actions/common";
import { ReloadOutlined  } from "@ant-design/icons";
import { Spin, Skeleton, Layout, Menu, Row, Col } from "antd";
import * as Service from "../core/Service";
import _ from "lodash";
import Path from "../routes/Path";
import { EventAPI } from "../smart-contract/api/Event";

const eventAPI = new EventAPI();

const RootProvider = () => {
  // const [loading, setLoading] = useState(true);
  const loading = useSelector((state) => state.app.loading);
  const [loadingSc, setLoadingSc] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    init();
  }, []);

  const loadBlockchain = async () => {
    let event = await eventAPI.init();

    console.log("init blockchain", eventAPI);
    dispatch(setSCEventAPI(eventAPI));
    let events = await eventAPI.getEventAll();
    let tickets = await eventAPI.getTicketAll();
    console.log("tickets", tickets);
    dispatch(setSCEvents(_.keyBy(events, "event_id")));
    setLoadingSc(false);
  };

  const init = async () => {
    // setLoading(true);

    let resp = await Service.call("get", "/api/config");
    if (resp && resp.status > 0) {
      dispatch(setConfig(resp));
    } else {
      throw new Error("failed to get app config");
    }

    resp = await Service.call("get", `/api/admin`);

    if (!resp || resp.status <= 0) {
      dispatch(setAuth(false));
      dispatch(setLoading(false));
      return;
    }
    setLoadingSc(true)
    loadBlockchain();

    if (resp.userData[0].role === 1) {
      dispatch(setAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      return;
    }

    if (resp.userData[0].role === 2) {
      dispatch(setCompanyAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      return;
    }
  };

  if (loading || loadingSc) {
    const antIcon = <ReloadOutlined  style={{ fontSize: 36, color: '#2b2b2b' }} spin />;
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
          <Row
            justify="space-between"
            align="middle"
            style={{ height: "100%" }}
          >
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
            <div
            
            style={{ position: "absolute", top: "50%", left: "50%" }}
            >
               <Spin
              size="large"
              // style={{ position: "absolute", top: "50%", left: "50%" }}
              indicator={antIcon}
            />
            <p style={{color: '#2b2b2b', fontSize: 16, transform: 'translate(-35%, 0%)', marginTop: 20}}>Data Processing ...</p>
            </div>
           
          </div>
      </Layout>
    );
  }

  return (
    <>
      <Path />
    </>
  );
};

export default RootProvider;
