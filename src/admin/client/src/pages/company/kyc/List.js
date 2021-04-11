import React, { useState, useEffect } from "react";
import { Table, Button, Row, Col, Tooltip, Typography, Divider } from "antd";
import {
  FileProtectOutlined,
  FileSearchOutlined,
  GlobalOutlined,
  EditOutlined,
} from "@ant-design/icons";
import _ from "lodash";
import moment from "moment";
import { useLocation, Link } from "react-router-dom";
import EventForm from "./Form";
import EventInfo from "./Info";
import { useSelector } from "react-redux";
import AppLayout from "../../../components/AppLayout";
import ImageModal from "../../../components/ImageModal";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";

const involvedModelName = "event";
const title = "Company KYC";
const selectedKey = "company_kyc";
const tableIDName = "company_kyc_id";

const { Paragraph } = Typography;

const CompanyKyc = (props) => {
  const location = useLocation();
  const app = useSelector((state) => state.app);
  const [dataSource, setDataSource] = useState([]);
  const [again, setAgain] = useState(false);
  const [isDraft, setDraft] = useState(false);
  const [modal, toggleModal] = useState({
    modalVisible: false,
    imageUrl: null,
  });

  useEffect(() => {
    getInitialValue();

    // if (location.state) {
    //   setAgain(location.state.again);
    // }
  }, []);

  const getInitialValue = async () => {
    let resp = await Service.call("get", `/api/company/admin/kyc/single`);
    console.log(resp);
    if (resp.company_kyc_id > 0) {
      setDataSource([resp]);
    }
  };

  const setTableHeader = () => {
    const columns = [
      {
        title: "",
        dataIndex: tableIDName,
        render: (value, record) => {
          return (
            <Row gutter={[8, 0]}>
              <Col>
                <Link
                  to={{
                    pathname: "/company/kyc/info",
                    state: { company_kyc_id: record.company_kyc_id },
                  }}
                >
                  <Button shape="circle" icon={<EditOutlined />}></Button>
                </Link>
              </Col>
            </Row>
          );
        },
      },
      {
        title: "Status",
        dataIndex: "status",
        render: (value) => UI.displayApplicationStatus(value),
        sorter: (a, b) => a.status - b.status,
      },
      {
        title: "Reference No.",
        dataIndex: "reference_no",
      },
      {
        title: "Company Code",
        dataIndex: "company_code",
      },
      {
        title: "Company Name",
        dataIndex: "name",
      },
      {
        title: "Owner",
        dataIndex: "owner",
      },
      {
        title: "industry",
        dataIndex: "industry",
      },
      {
        title: "company_size",
        dataIndex: "company_size",
        sorter: (a, b) => a.company_size.localeCompare(b.company_size),
      },
      {
        title: "address",
        dataIndex: "address",
        sorter: (a, b) => a.address.localeCompare(b.address),
      },
      {
        title: "Company Doc",
        dataIndex: "company_doc",
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
        title: "Description",
        dataIndex: "description",
        render: (value) => value.substring(0, 20) + "...",
      },
      {
        title: "Found Date",
        dataIndex: "found_date",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
      },
      {
        title: "Update Time",
        dataIndex: "utime",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
      },
      {
        title: "Create Time",
        dataIndex: "ctime",
        render: (value) => UI.momentFormat(value, "YYYY-MM-DD HH:mm"),
      },
    ];
    return columns;
  };

  return (
    <AppLayout selectedKey={selectedKey} title="Company KYC">
      {_.isEmpty(dataSource) && (
        <Row gutter={[0, 20]}>
          <Col>
            <Link
              to={{
                pathname: "/company/kyc/form",
                state: { company_kyc_id: 0 },
              }}
            >
              <Button className="custom-btn" htmlType="submit">
                Create Company
              </Button>
            </Link>
          </Col>
          <Divider />
        </Row>
      )}
      <Table
        className="custom-table"
        rowKey={tableIDName}
        scroll={{ x: "max-content" }}
        dataSource={dataSource}
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
    </AppLayout>
  );
};

export default CompanyKyc;
