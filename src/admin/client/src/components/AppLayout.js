import React from "react";
import { Layout, PageHeader } from "antd";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const { Content } = Layout;

const AppLayout = ({ children, noSidebar = false, title, selectedKey }) => {
  return (
    <Layout>
      {/* Top Nav Bar*/}
      <Navbar />

      <Layout style={{ minHeight: 700 }}>
        {/* Sider Bar */}
        {!noSidebar && <Sidebar selectedKey={selectedKey} />}

        {/*main body */}
        <Layout>
          {/* Title */}
          <PageHeader title={title} style={styles.title} />

          {/* Content */}
          <Content style={styles.body}>{children}</Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

const styles = {
  title: {
    backgroundColor: "#FFFFFF",
  },
  body: {
    backgroundColor: "#FFFFFF",
    padding: 20,
    // marginBottom: 80,
    paddingBottom: 80,
  },
};

export default AppLayout;
