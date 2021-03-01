import React, { useEffect, useState } from 'react';
import '@ant-design/compatible/assets/index.css';
import { Layout, Menu, Row, Col, Card, Upload, message, Button } from 'antd';
import { InboxOutlined } from '@ant-design/icons';
import AppLayout from '../../components/AppLayout';
import _ from 'lodash';
import moment from 'moment';
import * as Service from '../../core/Service'
const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })



const { Header, Content, Sider } = Layout;
const { SubMenu } = Menu;
const { Dragger } = Upload;

const title = "Home";
const selectedKey = "dashboard";

const props = {
  name: 'file',
  multiple: false,
  action: '/api/admin/media',

};
const Home = () => {
  const [image, setImage] = useState(null);
  const [ipfsHash, setIpfsHash] = useState(null);

  // useEffect(() => {
  //   init()
  // }, []);

  const postIPFS = async (image) => {
    let result = await ipfs.add(image)
    setIpfsHash(result.path)
    console.log('result.path', result.path);
  }

  const uploadOnChange = async (info) => {
    const { status, response } = info.file;
    if (status === 'done') {
      if (response.status > 0) {
        message.success('成功上載');
        let patchObj = {
          company_doc: info.file.response.filename
        }
        await Service.call('patch', '/api/company/admin/kyc', patchObj);

        let path = info.file.response.url;
        // setImageURL(`${app.config.STATIC_SERVER_URL}/media/${info.file.response.filename}`)
        // setFileInfo(info.file);

        let reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj);
        reader.onload = async (e) => {
          // setImage()
          await postIPFS(Buffer(e.target.result));

          console.log('buffer', e.target.result);
        }

      }
      else {
        message.error('上載失敗')
      }
    }
  }

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Content
        style={{
          height: '100%',
        }}
      >
        <Dragger showUploadList={false} {...props} onChange={uploadOnChange}>
          {ipfsHash !== null ? <img style={{ width: 300 }} src={`https://ipfs.io/ipfs/${ipfsHash}`} /> :
            <div>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Click or drag file to this area to upload</p>
              <p className="ant-upload-hint">
                Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                band files
    </p>
            </div>
          }
        </Dragger>
        {/* <Button onClick={submit}>upload</Button> */}
      </Content>
    </AppLayout>
  )
}


export default Home;