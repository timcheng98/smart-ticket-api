import React from "react";
import { Modal, Image } from "antd";
import _ from "lodash";

const ImageModal = ({ title, visible, setVisible, url }) => {
  return (
    <Modal
      title={title}
      style={{ maxWidth: 800 }}
      width={"90%"}
      visible={visible}
      footer={null}
      onCancel={() => {
        setVisible(false);
      }}
    >
      <Image.PreviewGroup>
        <Image width={"100%"} src={url} />
      </Image.PreviewGroup>
    </Modal>
  );
};

export default ImageModal;
