import React, { Component } from 'react';
import { Form } from '@ant-design/compatible';
import '@ant-design/compatible/assets/index.css';
import { Avatar, Button, Divider, Layout, Menu, Modal, Popconfirm, Table } from 'antd';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';

const { Header, Content, Sider } = Layout;

export default class ButtonImageModal extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      modalURI: '',
    };
  }

  render() {
    let {modalVisible} = this.state;
    let {modalURI, modalTitle} = this.props
    return (
      <span>
        <Button
          block
          style={{width: 100}}
          type="primary"
          onClick={() => {
            this.setState({modalVisible: true});
          }}
        >
          檢閱
        </Button>
        <Modal
          title={modalTitle}
          style={{ maxWidth: 800 }}
          width={'90%'}
          visible={modalVisible}
          footer={null}
          onCancel={() => {
            this.setState({modalVisible: false});
          }}
        >
          <Avatar
            align="center"
            shape="square"
            style={{width: '100%', height: '100%'}}
            src={modalURI}
            onCancel={() => {
              this.setState({modalVisible: false});
            }}
          />
        </Modal>
      </span>
    )
  }
}
