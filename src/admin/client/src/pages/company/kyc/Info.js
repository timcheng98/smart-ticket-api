import React, { useState, useEffect } from "react";
import {
  Avatar,
  Button,
  Divider,
  Form,
  Icon,
  Layout,
  Menu,
  Modal,
  Popconfirm,
  Table,
  Tag,
  Tooltip,
  Spin,
  Descriptions,
  Badge,
  Image,
  Row,
  Col,
  Input,
} from "antd";
import { useHistory, useLocation } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector } from "react-redux";
import * as Service from "../../../core/Service";
import * as UI from "../../../core/UI";
import AppLayout from "../../../components/AppLayout";
import ImageModal from "../../../components/ImageModal";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

const involvedModelName = "company";
const title = "Company KYC";
const selectedKey = "company_kyc";
const tableIDName = "company_kyc_id";

const KycInformation = () => {
  const app = useSelector((state) => state.app);
  const history = useHistory();
  const [company, setCompany] = useState({});

  useEffect(() => {
    getInitalState();
  }, []);

  const getInitalState = async () => {
    let data = await Service.call("get", "/api/company/admin/kyc/single");
    if (data.company_kyc_id) {
      console.log(data);
      setCompany(data);
    }
  };

  // console.log("company.company_doc", company.company_doc);
  const applyKycAgain = async (e) => {
    // await Service.call("patch", "/api/company/admin/kyc/single", {
    //   admin_id: company.admin_id,
    //   is_company_doc_verified: 0,
    //   // company_doc: "",
    // });
    history.push("/company/kyc/form");
  };

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <div style={{ marginBottom: 100 }}>
        <Descriptions
          title="Company Information"
          bordered
          column={1}
          layout="vertical"
        >
          <Descriptions.Item label="Status">
            <Badge
              status="processing"
              text={UI.displayApplicationStatus(company.status)}
            />
          </Descriptions.Item>
          {company.status === -1 && (
            <Descriptions.Item
              label="Reject Reason(s)"
              style={{ color: "black", fontWeight: "bold" }}
            >
              <span style={{ color: "black", fontWeight: "bold" }}>
                {company.reject_reason}
              </span>
            </Descriptions.Item>
          )}
          {company.check_by !== 0 && (
            <Descriptions.Item label="Check By">
              {company.check_by}
            </Descriptions.Item>
          )}
          <Descriptions.Item label="Company Name">
            {company.name}
          </Descriptions.Item>
          <Descriptions.Item label="Owner">{company.owner}</Descriptions.Item>
          <Descriptions.Item label="Company Code">
            {company.company_code}
          </Descriptions.Item>
          <Descriptions.Item label="Industry">
            {company.industry}
          </Descriptions.Item>
          <Descriptions.Item label="Found Date">
            {moment.unix(company.found_date).format("YYYY-MM-DD")}
          </Descriptions.Item>
          <Descriptions.Item label="Address">
            {company.address}
          </Descriptions.Item>
          <Descriptions.Item label="Description">
            {company.description}
          </Descriptions.Item>
          <Descriptions.Item label="Company Size">
            {company.company_size}
          </Descriptions.Item>
          <Descriptions.Item
            label="Company Document(Click to zoom)"
            contentStyle={{ padding: 20 }}
          >
            {company.company_doc && (
              <Image.PreviewGroup>
                <Image
                  id="company_doc"
                  width={300}
                  src={`${app.config.STATIC_SERVER_URL}/media/${company.company_doc}`}
                />
              </Image.PreviewGroup>
            )}
          </Descriptions.Item>
        </Descriptions>
        {company.status === -1 && (
          <Button onClick={applyKycAgain} style={{ margin: 20 }} type="primary">
            Apply again
          </Button>
        )}
      </div>
    </AppLayout>
  );
};

export default KycInformation;
