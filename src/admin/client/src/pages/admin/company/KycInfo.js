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
import { useHistory, Link } from "react-router-dom";
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
  const [isReject, setReject] = useState(false);
  const [text, setText] = useState("");
  const history = useHistory();
  const [company, setCompany] = useState({});

  useEffect(() => {
    getInitalState()
  }, [])

  const getInitalState = async () => {
    if (app.is_admin.admin) {
      setCompany(history.location.state.company)
    }

    if (app.is_admin.company_admin) {
      let data = await Service.call('get', '/api/company/admin/kyc/single');
      if (data.company_kyc_id) {
        setCompany(data);
      }
    }

  }

  const confirmReject = async (e) => {
    await Service.call("patch", "/api/company/admin/kyc/single", {
      reject_reason: text,
      admin_id: company.admin_id,
      is_company_doc_verified: 0,
      status: -1
    });
    history.push("/admin/company/kyc");
  };

  const confirmApprove = async (e) => {
    await Service.call("patch", "/api/company/admin/kyc/single", {
      admin_id: company.admin_id,
      is_company_doc_verified: 1,
      status: 1
    });
    history.push("/admin/company/kyc");
  };

  const applyKycAgain = async (e) => {
    await Service.call("patch", "/api/company/admin/kyc/single", {
      admin_id: company.admin_id,
      is_company_doc_verified: 0
    });
    history.push("/company/kyc/form");
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };
  console.log('test', _.isEmpty(company))
  console.log('test', company)

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      {_.isEmpty(company) &&
        <Button
          // type="primary"
          className="custom-btn"
          onClick={() => {
            history.push('/company/kyc/form')
            // setModalVisible(true);
            // setSelectedRecord({company_id: 0})
          }}
        >
          Apply KYC
        </Button>
      }
      {!_.isEmpty(company) && (<div style={{ marginBottom: 100 }}>
        <Descriptions
          title="Company Information"
          bordered
          column={1}
          layout="vertical"
        >
          <Descriptions.Item label="Status">
            <Badge
              status="processing"
              text={UI.displayStatus(company.is_company_doc_verified)}
            />
          </Descriptions.Item>
          {company.status === -1 && (
            <Descriptions.Item label="Reject Reason(s)" style={{color: 'black', fontWeight: 'bold'}}>
            <span style={{color: 'black', fontWeight: 'bold'}}>{ company.reject_reason}</span>
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
            <Image.PreviewGroup>
              <Image
                id="company_doc"
                width={300}
                src={`${app.config.STATIC_SERVER_URL}/media/${company.company_doc}`}
              />
            </Image.PreviewGroup>
          </Descriptions.Item>
        </Descriptions>
        {!app.is_admin.company_admin && (<>
       <Row>
          {!isReject && (
            <>
              <Button
                style={{ margin: 20 }}
                type="primary"
                onClick={confirmApprove}
              >
                Approval
              </Button>
              <Button
                type="danger"
                style={{ margin: 20 }}
                onClick={() => setReject(true)}
              >
                Reject
              </Button>
            </>
          )}
        </Row>
        {isReject && (
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Reject Reason(s)">
              <Input.TextArea
                rows={4}
                placeholder="Reasons...."
                onChange={onTextChange}
              />
              <Row gutter={[24, 0]}>
                <Button
                  style={{ margin: 20 }}
                  type="primary"
                  onClick={confirmReject}
                >
                  Confirm
                </Button>
                <Button
                  style={{ margin: 20 }}
                  type="primary"
                  onClick={() => setReject(false)}
                >
                  Cancel
                </Button>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        )}
        </>)}

        {(company.status === -1 && !app.is_admin.admin ) && (<Button onClick={applyKycAgain} style={{margin: 20}} type="primary">Apply again</Button>)}

      </div>)}
    </AppLayout>
  );
};

export default KycInformation;
