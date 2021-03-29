import React, { useEffect, useState } from 'react';
import {
  Upload, message, Button
} from 'antd';
import {
  UploadOutlined, InboxOutlined
} from '@ant-design/icons';
import moment from 'moment';
import _ from 'lodash';

const { Dragger } = Upload;

const FormUploadFile = (
  {
    type,
    imageURL,
    data,
    onChange,
    onPreview,
    onRemove,
    fileList,
  }
  ) => {
  let DisplayContent;

  const uploadProps = {
    name: 'file',
    multiple: false,
    action: '/api/media',
    beforeUpload: (file) => {
      if (file.type !== 'image/png' && file.type !== 'image/jpeg') {
        message.error('Invalid Format');
        return false;
      }
      message.success('Uploading...');
      return true;
    },
    onError(err) {
      console.error(err)
      message.error(`Upload Failed. Try Again.`);
    }
  };

  if (type === 'one') {
    DisplayContent = (
      <UploadOne
        uploadProps={uploadProps}
        fileList={fileList}
        imageURL={imageURL}
        data={data}
        onChange={onChange}
        onPreview={onPreview}
        onRemove={onRemove}
      />
    )
  } else {
    DisplayContent = (
      <UploadWidget
        uploadProps={uploadProps}
        imageURL={imageURL}
        data={data}
        onChange={onChange}
        onPreview={onPreview}
        onRemove={onRemove}
      />)
  }

  return DisplayContent;
}

const UploadOne = ({
  imageURL,
  data,
  onChange,
  onPreview,
  onRemove,
  fileList,
  uploadProps
}) => {
  const [image, setImage] = useState('');
  const [list, setfileList] = useState([]);

  useEffect(() => {
    setImage(imageURL)
  }, [imageURL])

  return (
    <Dragger
      {...uploadProps}
      data={data}
      showUploadList={false}
      onChange={onChange}
      listType="text"
      onPreview={onPreview}
      onRemove={onRemove}
    >
      {
        !_.isEmpty(image)
          ? (
            <div style={{width: '100%', margin: 'auto'}}>
              <img src={imageURL} style={{width: '100%', objectFit: 'contain'}} alt="" />
            </div>
          ) : (
            <div>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">Upload</p>
              <p className="ant-upload-hint">
                Upload Related Docuements
              </p>
            </div>
          )
      }
    </Dragger>
  );
}

function UploadWidget(props) {
  const {
    imageURL,
    data,
    onChange,
    onPreview,
    onRemove,
    uploadProps
  } = props;

  useEffect(() => {}, [imageURL])
  return (
    <Dragger
      {...uploadProps}
      showUploadList={false}
      data={data}
      onChange={onChange}
      listType="picture"
      onPreview={onPreview}
      onRemove={onRemove}
    >
      {
        imageURL
          ? (
            <div>
              <img src={imageURL} style={{maxWidth: '100%'}} alt="" />
            </div>
          ) : (
            <div>
              <p className="ant-upload-drag-icon">
                <InboxOutlined />
              </p>
              <p className="ant-upload-text">upload1</p>
              <p className="ant-upload-hint">
                upload_msg2
              </p>
            </div>
          )
      }
    </Dragger>
  );
}

export default FormUploadFile;
