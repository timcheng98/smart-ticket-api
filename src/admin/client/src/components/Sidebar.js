import React from "react";
import { Layout } from "antd";

import SidebarMenu from "./SidebarMenu";
import _ from "lodash";
const { Sider } = Layout;

const Sidebar = ({ selectedKey }) => {
  return (
    <Sider breakpoint="sm" collapsedWidth="0" width={250}>
      <SidebarMenu selectedKey={selectedKey} />
    </Sider>
  );
};

export default Sidebar;
