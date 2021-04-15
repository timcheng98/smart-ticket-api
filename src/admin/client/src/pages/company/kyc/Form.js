import React, { useState, useEffect } from "react";
import _ from "lodash";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Layout,
  Modal,
  Avatar,
  notification,
  Radio,
  Row,
  Select,
  Tabs,
  Upload,
  message,
  Divider,
  DatePicker,
  Progress,
} from "antd";
import { CheckCircleFilled, RightOutlined } from "@ant-design/icons";
import { useHistory, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import moment from "moment";
import * as Service from "../../../core/Service";
import AppLayout from "../../../components/AppLayout";
import FormUploadFile from "../../../components/FormUploadFile";
import { formItemLayout, tailLayout } from "../../../components/ModalLayout";

const involvedModelName = "company";
const title = "Company KYC";
const selectedKey = "company_kyc";
// const tableIDName = "company_kyc_id";

const CompanyKycForm = (props) => {
  const [step, setStep] = useState(1);
  const [referenceNumber, setReferenceNumber] = useState("");
  const history = useHistory();

  return (
    <AppLayout title={title} selectedKey={selectedKey}>
      <Row>
        {step !== 3 && (
          <Col span={24}>
            <ProgressBar step={step} />
          </Col>
        )}
        <Divider />
        {step === 1 && (
          <Col span={24}>
            <BasicInformation
              setStep={(val) => setStep(val)}
              setReferenceNumber={(value) => setReferenceNumber(value)}
            />
          </Col>
        )}
        {step === 2 && (
          <Col span={24}>
            <SupportDocument setStep={(val) => setStep(val)} />
          </Col>
        )}
        {step === 3 && (
          <Col span={24}>
            <Row
              justify="center"
              style={{ textAlign: "center", paddingTop: 100 }}
              gutter={[0, 20]}
            >
              <Col span={24}>
                <CheckCircleFilled style={{ fontSize: 48 }} />
              </Col>
              <Col span={24}>Application Submitted Successfully.</Col>
              <Col span={24}>Reference No. {referenceNumber}</Col>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={() => history.push("/company/kyc/list")}
                >
                  Back
                </Button>
              </Col>
            </Row>
          </Col>
        )}
      </Row>
    </AppLayout>
  );
};

const ProgressBar = ({ step }) => {
  return (
    <Row
      justify="center"
      align="middle"
      style={{ paddingTop: 0, marginBottom: 30 }}
    >
      <Avatar
        style={{
          backgroundColor: step === 1 ? "#3E3E3E" : "#DBDBDB",
          verticalAlign: "middle",
        }}
        className="responsive-text progress-icon"
      >
        1
      </Avatar>
      <span
        style={{ color: step === 1 ? "#3E3E3E" : "#DBDBDB", padding: "0 8px" }}
        className="responsive-text"
      >
        Basic Information
      </span>
      <RightOutlined
        style={{ color: "#2B2B2B", paddingRight: 8 }}
        className="responsive-text"
      />
      <Avatar
        style={{
          backgroundColor: step === 2 ? "#3E3E3E" : "#DBDBDB",
          verticalAlign: "middle",
        }}
        className="responsive-text progress-icon"
      >
        2
      </Avatar>
      <span
        style={{ color: step === 2 ? "#3E3E3E" : "#DBDBDB", padding: "0 8px" }}
        className="responsive-text"
      >
        Support Docuements
      </span>
    </Row>
  );
};

const BasicInformation = (props) => {
  const [form] = Form.useForm();
  const history = useHistory();

  useEffect(() => {
    getInitialValue();
  }, []);

  const getInitialValue = async () => {
    let resp = await Service.call("get", `/api/company/admin/kyc/single`);
    if (resp.company_kyc_id > 0) {
      // pending or success
      if (resp.status > 1) return history.push("/company/kyc");

      resp.found_date = moment.unix(_.toInteger(resp.found_date));
      form.setFieldsValue(resp);
    }
  };

  const onFinish = async (dataObj) => {
    let url = `/api/company/admin/kyc`;

    // Patch
    let resp = await Service.call("get", `/api/company/admin/kyc/single`);
    // if (data.)
    if (resp.company_kyc_id) {
      await Service.call("patch", url, {
        ...dataObj,
        status: 0,
      });
      message.success("success");
      props.setReferenceNumber(resp.reference_no);
      return props.setStep(2);
    }

    // POST
    resp = await Service.call("post", url, {
      ...dataObj,
      status: 0,
    });
    if (resp.errorMessage) {
      return message.error(resp.errorMessage);
      // return props.openModal(true);
    }
    message.success("success");
    props.setReferenceNumber(resp.reference_no);
    // return props.openModal(false);
    props.setStep(2);
  };

  return (
    <Form
      {...formItemLayout}
      form={form}
      name="time_related_controls"
      onFinish={onFinish}
      initialValues={props.dataObj}
    >
      <Form.Item
        label="Company Code"
        name="company_code"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Owner"
        name="owner"
        rules={[{ required: true, message: "Please input Company Owner." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Description"
        name="description"
        rules={[
          { required: true, message: "Please input Company Description." },
        ]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Size"
        name="company_size"
        rules={[{ required: true, message: "Please input Company Size." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input Address." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Industry"
        name="industry"
        rules={[{ required: true, message: "Please input Industry." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Found Date"
        name="found_date"
        rules={[{ required: true, message: "Please input Found Date." }]}
      >
        <DatePicker />
      </Form.Item>
      <Divider style={{ border: "none" }} />
      <Row justify="space-between" style={{ padding: "0 5%" }}>
        <Col></Col>
        <Col>
          <Form.Item>
            <Button className="custom-btn" htmlType="submit">
              Next
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

const SupportDocument = (props) => {
  const [imageURL, setImageURL] = useState("");
  const [fileInfo, setFileInfo] = useState({});
  const [proress, setProgress] = useState(0);
  const app = useSelector((state) => state.app);

  useEffect(() => {
    getInitialValue();
  }, []);

  const getInitialValue = async () => {
    let data = await Service.call("get", `/api/company/admin/kyc/single`);
    console.log("data");
    if (!_.isEmpty(data.company_doc)) {
      setFileInfo(data.company_doc)
      setImageURL(`${app.config.STATIC_SERVER_URL}/media/${data.company_doc}`);
    }
  };

  const uploadOnChange = async (info) => {
    const { status, response } = info.file;
    if (status === "done") {
      if (response.status > 0) {
        message.success("成功上載");
        let patchObj = {
          company_doc: info.file.response.filename,
        };

        let path = info.file.response.url;
        setImageURL(
          `${app.config.STATIC_SERVER_URL}/media/${info.file.response.filename}`
        );
        setFileInfo(info.file.response.filename);
      } else {
        message.error("上載失敗");
      }
    }
  };

  const onRemove = () => {
    setFileInfo({});
    setImageURL("");
  };

  console.log(imageURL);

  return (
    <Form>
      <Row justify="center">
        <Col>
          <h2>公司證明</h2>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={12}>
          <FormUploadFile
            type="one"
            data={{ scope: "public" }}
            onChange={uploadOnChange}
            onRemove={onRemove}
            imageURL={imageURL}
          />
        </Col>
      </Row>
      <Divider style={{ border: "none" }} />
      <Row justify="space-between" style={{ padding: "0 5%" }}>
        <Col>
          <Form.Item>
            <Button
              className="custom-btn"
              // htmlType="submit"
              onClick={() => props.setStep(1)}
            >
              Previous
            </Button>
          </Form.Item>
        </Col>
        <Col>
          <Form.Item>
            <Button
              className="custom-btn"
              onClick={async () => {
                let status = 0;
                if (fileInfo) {
                  status = 1;
                }
                await Service.call("patch", "/api/company/admin/kyc", {
                  status,
                  reject_reason: '',
                  company_doc: fileInfo,
                });
                props.setStep(3);
              }}
            >
              Next
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default CompanyKycForm;
