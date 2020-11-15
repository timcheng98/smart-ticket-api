import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Layout, Menu, Row, Col, Card, Spin } from 'antd';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import AppLayout from '../../components/AppLayout';
import _ from 'lodash';
import moment from 'moment';

const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;

const title = "Home";
const selectedKey = "dashboard";

const data = [
  {
    name: '10/7', door1: 4000, door2: 2400,
  },
  {
    name: '11/7', door1: 3000, door2: 1398,
  },
  {
    name: '12/7', door1: 2000, door2: 9800,
  },
  {
    name: '13/7', door1: 2780, door2: 3908,
  },
  {
    name: '14/7', door1: 1890, door2: 4800,
  },
  {
    name: '15/7', door1: 2390, door2: 3800,
  },
  {
    name: '16/7', door1: 3490, door2: 4300,
  },
];

const styles = {
  chartCol: {
    height: "400px",
    textAlign: "center",
    // border: 'solid 1px #ccc',
    padding: '30px 10px 60px',
    borderRadius: '5px',
    boxShadow: '0 2px 8px 0 rgba(0, 0, 0, 0.15)'
  },
}

const Home = () => {

  const [data, setData] = useState([]);

  const renderChart = () => {
    return (
        <Col xs={24} sm={24} md={12} lg={12} xl={12} style={styles.chartCol}>
          <h2> Access Logs </h2>
          <ResponsiveContainer>
            <LineChart
              data={data}
              margin={{
                top: 25, right: 30, left: 20, bottom: 5,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="door" stroke="#006ABF" />
              {/* <Line type="monotone" dataKey="door2" stroke="#FFA31F" /> */}
            </LineChart>
          </ResponsiveContainer>
        </Col>
    )
  }

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Content
      style={{
        height:'100%',
      }}
      >
        <Row>
          {
            renderChart()
          }
        </Row>
      </Content>
    </AppLayout>
  )
}


export default Home;