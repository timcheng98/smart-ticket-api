import React, { useState, useEffect } from "react";

// Libraries / Plugins
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";

// UI Display
import * as UI from "../../../../core/UI";
import { Button, Divider, Table, Tooltip, Spin, Col, Row } from "antd";
import {
  FileProtectOutlined,
  FileSearchOutlined,
  GlobalOutlined,
} from "@ant-design/icons";

// Logic
import * as Service from "../../../../core/Service";

// Customized Components
import LoadingScreen from "../../../../components/LoadingScreen";
import ImageModal from "../../../../components/ImageModal";
import AppLayout from "../../../../components/AppLayout";

// Initial States
const debug = require("debug")("app:admin:client:src:AdvertisementList");
const API = {
  GET_ALL: `/api/admin/user/kyc`,
  POST: `/api/user/kyc`,
  PATCH: `/api/user/kyc`,
  PUT: `/api/user/kyc`,
};
const metaData = {
  title: "User KYC",
  selectedKey: "user_kyc",
  tableID: "user_kyc_id",
};

const UserKycList = (props) => {
  const [dataList, setDataList] = useState([]);
  const [kycData, setKycData] = useState({});
  const history = useHistory();
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState({});
  const app = useSelector((state) => state.app);
  const [loading, toggleLoading] = useState(true);
  const [modal, toggleModal] = useState({
    modalVisible: false,
    imageUrl: null,
  });

  useEffect(() => {
    getAllData();
  }, []);

  useEffect(() => {
    getKycData();
  }, [dataList]);

  const getAllData = async () => {
    let dataList = [];
    try {
      let data = await Service.call("get", "/api/admin/user/kyc");
      dataList = _.orderBy(data, ["ctime"], ["desc"]);
      toggleLoading(false);
    } catch (error) {
      console.error("error >>> ", error);
    } finally {
      setDataList(dataList);
    }
  };

  const getKycData = async () => {
    let data = await Service.callBlockchain("post", "/api/sc/kyc/user/target", {
      ids: _.map(dataList, "user_id"),
    });
    console.log(data);
    setKycData(_.keyBy(data, "user_id"));
  };

  const setTableHeader = () => {
    const columns = [
      {
        title: "",
        dataIndex: metaData.tableID,
        render: (value, record) => {
          let status = record.status === 1;
          let color = "#000000";
          let icon = "";
          let wordings = "";
          if (status) {
            color = "#AA0000";
            icon = "stop";
            wordings = "Disable";
          } else {
            color = "#00AA00";
            icon = "check";
            wordings = "Enable";
          }

          return (
            <Row gutter={[12, 0]}>
              <Col>
                <Link
                  to={{
                    pathname: "/admin/user/kyc/info",
                    state: { dataSource: record },
                  }}
                >
                  <Tooltip
                    title={
                      record.is_company_doc_verified
                        ? "Verified"
                        : "Check verification"
                    }
                  >
                    <Button
                      shape="circle"
                      style={{
                        marginLeft: 8,
                        color: record.is_company_doc_verified
                          ? "green"
                          : "black",
                      }}
                      icon={
                        record.is_company_doc_verified ? (
                          <FileProtectOutlined />
                        ) : (
                          <FileSearchOutlined />
                        )
                      }
                    />
                  </Tooltip>
                </Link>
              </Col>
              {!_.isEmpty(kycData) &&
                kycData[record.user_id].user_credential !== "" && (
                  <Col>
                    <Tooltip title={"On the Blochain Already"}>
                      <Button
                        shape="circle"
                        icon={<GlobalOutlined style={{ color: "#1890ff" }} />}
                      />
                    </Tooltip>
                  </Col>
                )}
            </Row>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value) =>
          UI.displayStatus(value, {
            1: "Activate",
            0: "Pending",
            "-1": "Reject",
            default: "Reject",
          }),
      },
      {
        title: "First Name",
        dataIndex: "first_name",
      },
      {
        title: "Last Name",
        dataIndex: "last_name",
      },
      {
        title: "National ID",
        dataIndex: "national_id",
      },
      {
        title: "Birthday",
        dataIndex: "birthday",
        render: (value) => UI.momentFormat(value),
      },
      {
        title: "Update@",
        dataIndex: "utime",
        render: (value) => UI.momentFormat(value),
      },
      {
        title: "Create@",
        dataIndex: "ctime",
        render: (value) => UI.momentFormat(value),
      },
      {
        title: "Face Doc",
        dataIndex: "face_doc",
        render: (value) => {
          const imageUrl = `${app.config.STATIC_SERVER_URL}/media/${value}`;
          return (
            <Button
              type="primary"
              onClick={() => {
                toggleModal({
                  modalVisible: true,
                  imageUrl,
                });
              }}
            >
              Show
            </Button>
          );
        },
      },
      {
        title: "National Doc",
        dataIndex: "national_doc",
        render: (value) => {
          const imageUrl = `${app.config.STATIC_SERVER_URL}/media/${value}`;
          return (
            <Button
              type="primary"
              onClick={() => {
                toggleModal({
                  modalVisible: true,
                  imageUrl,
                });
              }}
            >
              Show
            </Button>
          );
        },
      },
    ];
    return columns;
  };

  if (loading) {
    return (
      <>
        <Spin />
      </>
    );
  }

  return (
    <>
      <Table
        className="custom-table"
        rowKey={metaData.tableID}
        scroll={{ x: "max-content" }}
        dataSource={dataList}
        columns={setTableHeader()}
      />

      <ImageModal
        title="Company Document"
        visible={modal.modalVisible}
        setVisible={(_visible) => {
          toggleModal({
            modalVisible: _visible,
            imageUrl: null,
          });
        }}
        url={modal.imageUrl}
      />
    </>
  );
};

export default UserKycList;
