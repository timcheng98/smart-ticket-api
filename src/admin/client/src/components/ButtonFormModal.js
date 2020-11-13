import React, { Component, Children } from 'react';
import { EditOutlined } from '@ant-design/icons';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Avatar, Button, Divider, Layout, Menu, Modal, Popconfirm, Table } from 'antd';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const { Header, Content, Sider } = Layout;

export default class ButtonFormModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false
    };
  }

  setModalVisible(status) {
    this.setState({modalVisible: status});
  }

  render() {
    let {modalVisible} = this.state;
    let {
      shape="circle", buttonTitle, modalTitle,
      children, okText, cancelText
    } = this.props
    return (
      <span>
        <Button
          shape={shape}
          icon={<EditOutlined />}
          // okText={okText}
          // cancelText={cancelText}
          style={{color: "#0000AA", marginBottom: 15}}
          onClick={() => { this.setModalVisible(true) }}
        >
          {buttonTitle}
        </Button>
        <Modal
          title={modalTitle}
          style={{ maxWidth: 800 }}
          width={'90%'}
          visible={modalVisible}
          footer={null}
          onCancel={() => { this.setModalVisible(false) }}
        >
          {children}
        </Modal>
      </span>
    );
  }
}
