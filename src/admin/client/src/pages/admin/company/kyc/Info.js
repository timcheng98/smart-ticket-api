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
  Tabs,
  Descriptions,
  Badge,
  Image,
  Row,
  Col,
  Input,
  message,
} from "antd";
import {
  CheckCircleOutlined,
  GlobalOutlined,
  SafetyCertificateOutlined,
} from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import moment from "moment";
import _ from "lodash";
import { useSelector, useDispatch } from "react-redux";
import * as Service from "../../../../core/Service";
import * as UI from "../../../../core/UI";
import * as CommonActions from "../../../../redux/actions/common";
import AppLayout from "../../../../components/AppLayout";
import * as Main from "../../../../core/Main";
// import { eventAPI } from '../../../smart-contract/api/Event';
import ImageModal from "../../../../components/ImageModal";
import {
  EditOutlined,
  StopOutlined,
  CheckOutlined,
  FileProtectOutlined,
  FileSearchOutlined,
  ZoomInOutlined,
} from "@ant-design/icons";

const { TabPane } = Tabs;
const involvedModelName = "company";
const title = "Company KYC";
const selectedKey = "company_kyc";
const tableIDName = "company_kyc_id";

const KYCInformation = () => {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const [isReject, setReject] = useState(false);
  const [isMatch, setMatch] = useState(false);
  const [companyCredential, setCompanyCredential] = useState("");
  const [text, setText] = useState("");
  const history = useHistory();
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInitalState();
  }, []);

  useEffect(() => {
    if (_.isEmpty(dataSource)) return;
    getCompanyCredential();
    verifyCompanyCredential();
  }, [dataSource]);

  const getInitalState = async () => {
    setDataSource(history.location.state.dataSource);
  };

  const getCompanyCredential = async () => {
    let result = await Service.call(
      "get",
      `/api/sc/kyc/company?admin_id=${dataSource.admin_id}`
    );
    setCompanyCredential(result);
  };

  const verifyCompanyCredential = async () => {
    const {
      company_kyc_id,
      admin_id,
      company_code,
      name,
      owner,
      description,
      industry,
      company_doc,
      company_size,
      address,
      found_date,
    } = dataSource;

    let encryptString = `${admin_id}${company_kyc_id}${company_code}${name}${owner}${description}${industry}${company_doc}${company_size}${address}${found_date}`;

    const digestHex = await Main.sha256(JSON.stringify(encryptString));
    let result = await Service.call("post", `/api/sc/kyc/company/verify`, {
      id: dataSource.admin_id,
      hashHex: digestHex,
    });

    setMatch(result);
  };

  const confirmReject = async (e) => {
    await Service.call("patch", "/api/company/admin/kyc", {
      admin_id: dataSource.admin_id,
      reject_reason: text,
      is_company_doc_verified: 0,
      company_doc: "",
      status: -1,
      check_by: app.admin.admin_id,
    });
    history.push("/admin/company/kyc");
  };

  const confirmApprove = async (e) => {
    await Service.call("patch", "/api/company/admin/kyc", {
      admin_id: dataSource.admin_id,
      reject_reason: "",
      is_company_doc_verified: 1,
      status: 2,
      check_by: app.admin.admin_id,
    });
    history.push("/admin/company/kyc");
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onChainProcess = async () => {
    const {
      company_kyc_id,
      admin_id,
      company_code,
      name,
      owner,
      description,
      industry,
      company_doc,
      company_size,
      address,
      found_date,
      is_company_doc_verified,
      status,
    } = dataSource;
    if (_.isEmpty(dataSource))
      return message.warning("cannot found kyc instance.");
    if (is_company_doc_verified <= 0)
      return message.warning("company document is not verified.");
    if (status <= 0) return message.warning("kyc is not activate.");

    let encryptString = `${admin_id}${company_kyc_id}${company_code}${name}${owner}${description}${industry}${company_doc}${company_size}${address}${found_date}`;

    const digestHex = await Main.sha256(JSON.stringify(encryptString));

    let resp = await Service.call(
      "post",
      "/api/sc/kyc/company/credential/create",
      {
        admin_id: app.admin.admin_id,
        id: dataSource.admin_id,
        hashHex: digestHex,
      }
    );

    getCompanyCredential();
    verifyCompanyCredential();
  };

  return (
    <AppLayout title={`${title}`} selectedKey={selectedKey}>
      <Tabs type="card">
        <TabPane tab="Progress" key="1">
          <Row gutter={[0, 24]} style={{ marginTop: 8 }}>
            <Badge
              status="processing"
              text={UI.displayApplicationStatus(dataSource.status)}
            />
          </Row>
          {dataSource.reject_reason && (
            <Descriptions bordered column={1} layout="vertical">
              <Descriptions.Item label="Reject Reason">
                {dataSource.reject_reason}
              </Descriptions.Item>
            </Descriptions>
          )}
        </TabPane>
        <TabPane tab="Basic Information" key="2">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item label="Name">
              {dataSource.name}
            </Descriptions.Item>
            <Descriptions.Item label="Owner">
              {dataSource.owner}
            </Descriptions.Item>
            <Descriptions.Item label="Company Code">
              {dataSource.company_code}
            </Descriptions.Item>
            <Descriptions.Item label="Description">
              {dataSource.description}
            </Descriptions.Item>
            <Descriptions.Item label="Industry">
              {dataSource.industry}
            </Descriptions.Item>
            <Descriptions.Item label="Company Size">
              {dataSource.company_size}
            </Descriptions.Item>
            <Descriptions.Item label="Address">
              {dataSource.address}
            </Descriptions.Item>
            <Descriptions.Item label="Found Date">
              {dataSource.found_date}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Documents" key="3">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item
              label="Company Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  style={{ width: "100%", maxWidth: 300 }}
                  src={`${app.config.STATIC_SERVER_URL}/media/${dataSource.company_doc}`}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Blockchain Information" key="4">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item
              label={
                <>
                  Credential
                  {isMatch ? (
                    <Button
                      shape="circle"
                      style={{ marginLeft: 8, color: "green" }}
                      icon={<SafetyCertificateOutlined />}
                    />
                  ) : null}
                </>
              }
            >
              {companyCredential}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      <div style={{ marginBottom: 100 }}>
        <Row>
          {dataSource.status === 2 && companyCredential === "" && (
            <Button
              style={{ margin: 20 }}
              type="primary"
              onClick={onChainProcess}
            >
              Create KYC On BlockChain
            </Button>
          )}
          {!isReject && dataSource.status === 1 && !dataSource.reject_reason && (
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
                  type="dashed"
                  onClick={() => setReject(false)}
                >
                  Cancel
                </Button>
              </Row>
            </Descriptions.Item>
          </Descriptions>
        )}
      </div>
    </AppLayout>
  );
};

export default KYCInformation;
