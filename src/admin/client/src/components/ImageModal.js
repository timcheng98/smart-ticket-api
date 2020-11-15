import React from 'react';
import {
  Modal
} from 'antd';
import _ from 'lodash';

const ImageModal = ({
  title,
  visible,
  setVisible,
  url
}) => {

  return (
    <Modal
      title={title}
      style={{ maxWidth: 800 }}
      width={'90%'}
      visible={visible}
      footer={null}
      onCancel={() => { setVisible(false) }}
    >
      <div style={{width: '100%', textAlign: 'center'}}>
        <img src={url} alt="" style={{width: '100%'}} />
      </div>
    </Modal>
  );
}

export default ImageModal;
