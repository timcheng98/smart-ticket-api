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
const involvedModelName = "user_kyc";
const title = "Kyc Information";
const selectedKey = "user_list";
const tableIDName = "user_id";
// const eventAPI = new EventAPI();

const KYCInformation = () => {
  const dispatch = useDispatch();
  const app = useSelector((state) => state.app);
  const [isReject, setReject] = useState(false);
  const [isMatch, setMatch] = useState(false);
  const [userCredential, setUserCredential] = useState("");
  const [text, setText] = useState("");
  const history = useHistory();
  const [dataSource, setDataSource] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getInitalState();
  }, []);

  useEffect(() => {
    if (_.isEmpty(dataSource)) return;
    getUserCredential();
    verifyUserCredential();
  }, [dataSource]);

  const getInitalState = async () => {
    setDataSource(history.location.state.dataSource);
  };

  const getUserCredential = async () => {
    let result = await Service.call(
      "get",
      `/api/sc/kyc/user?user_id=${dataSource.user_id}`
    );
    setUserCredential(result);
  };

  const verifyUserCredential = async () => {
    const {
      user_id,
      user_kyc_id,
      national_doc,
      face_doc,
      birthday,
      first_name,
      last_name,
      national_id,
    } = dataSource;

    let encryptString = `${user_id}${user_kyc_id}${national_id}${first_name}${last_name}${birthday}${national_doc}${face_doc}`;

    const digestHex = await Main.sha256(JSON.stringify(encryptString));
    let result = await Service.call("post", `/api/sc/kyc/user/verify`, {
      id: dataSource.user_id,
      hashHex: digestHex,
    });

    setMatch(result);
  };

  const confirmReject = async (e) => {
    await Service.call("patch", "/api/admin/user/kyc", {
      user_id: dataSource.user_id,
      reject_reason: text,
      national_doc_verified: 0,
      face_doc_verified: 0,
      national_doc: "",
      face_doc: "",
      status: -1,
    });
    history.push("/admin/user/list");
  };

  const confirmApprove = async (e) => {
    await Service.call("patch", "/api/admin/user/kyc", {
      user_id: dataSource.user_id,
      is_approval_doc_verified: 1,
      is_seat_doc_verified: 1,
      reject_reason: "",
      national_doc_verified: 1,
      face_doc_verified: 1,
      status: 1,
    });
    history.push("/admin/user/list");
  };

  const onTextChange = (e) => {
    setText(e.target.value);
  };

  const onChainProcess = async () => {
    const {
      face_doc_verified,
      national_doc_verified,
      status,
      national_doc,
      face_doc,
      birthday,
      first_name,
      last_name,
      national_id,
    } = dataSource;
    if (_.isEmpty(dataSource))
      return message.warning("cannot found kyc instance.");
    if (face_doc_verified <= 0)
      return message.warning("face document is not verified.");
    if (national_doc_verified <= 0)
      return message.warning("national document is not verified.");
    if (status <= 0) return message.warning("kyc is not activate.");

    let encryptString = `${national_id}${first_name}${last_name}${birthday}${national_doc}${face_doc}`;

    const digestHex = await Main.sha256(JSON.stringify(encryptString));

    let resp = await Service.call(
      "post",
      "/api/sc/kyc/user/credential/create",
      {
        admin_id: app.admin.admin_id,
        id: dataSource.user_id,
        hashHex: digestHex,
      }
    );

    getUserCredential();
    verifyUserCredential();
  };

  return (
    <AppLayout title={`${title}`} selectedKey={selectedKey}>
      <Tabs type="card">
        <TabPane tab="Progress" key="1">
          <Row gutter={[0, 24]} style={{ marginTop: 8 }}>
            <Badge
              status="processing"
              text={UI.displayStatus(dataSource.status, {
                1: "Activate",
                0: "Pending",
                "-1": "Reject",
                default: "Reject",
              })}
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
            <Descriptions.Item label="First Name">
              {dataSource.first_name}
            </Descriptions.Item>
            <Descriptions.Item label="Last Name">
              {dataSource.last_name}
            </Descriptions.Item>
            <Descriptions.Item label="National ID">
              {dataSource.national_id}
            </Descriptions.Item>
            <Descriptions.Item label="Birthday">
              {moment.unix(dataSource.birthday).format("YYYY-MM-DD")}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
        <TabPane tab="Documents" key="3">
          <Descriptions bordered column={1} layout="vertical">
            <Descriptions.Item
              label="National Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  style={{ width: "100%", maxWidth: 300 }}
                  src={`${app.config.STATIC_SERVER_URL}/media/${dataSource.national_doc}`}
                />
              </Image.PreviewGroup>
            </Descriptions.Item>
            <Descriptions.Item
              label="Face Document"
              contentStyle={{ padding: 20 }}
            >
              <Image.PreviewGroup>
                <Image
                  id="face_doc"
                  // width={300}
                  style={{ width: "100%", maxWidth: 300 }}
                  src={`${app.config.STATIC_SERVER_URL}/media/${dataSource.face_doc}`}
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
              {userCredential}
            </Descriptions.Item>
          </Descriptions>
        </TabPane>
      </Tabs>

      <div style={{ marginBottom: 100 }}>
        <Row>
          {dataSource.status === 1 && userCredential === "" && (
            <Button
              style={{ margin: 20 }}
              type="primary"
              onClick={onChainProcess}
            >
              Create KYC On BlockChain
            </Button>
          )}
          {!isReject && dataSource.status !== 1 && !dataSource.reject_reason && (
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
