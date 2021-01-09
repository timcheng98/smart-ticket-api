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
const title = "Event Form";
const selectedKey = "event_form";
// const tableIDName = "company_kyc_id";

const openNotification = () => {
  notification.open({
    message: 'Notification Title',
    description:
      'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
    onClick: () => {
      console.log('Notification Clicked!');
    },
  });
};

const EventForm = (props) => {
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
                  onClick={() => history.push("/")}
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
    let resp = await Service.call("get", `/api/event`);
    console.log('test_>>>', resp.eventRc)
    console.log(resp.eventRc);
                                                                                                                              
    if (resp.eventRc.event_id > 0) {
      // pending or success
      // if (resp.status > 0) return history.push("/company/kyc/info");
      // resp.found_date = moment.unix(_.toInteger(resp.found_date));
      let { eventRc } =resp;
      let formData = {
        ...eventRc,
        start_end_time: [moment.unix(eventRc.start_time), moment.unix(eventRc.end_time)],
        released_close_date: [moment.unix(eventRc.released_date), moment.unix(eventRc.close_date)]
      }
      console.log(formData)
      form.setFieldsValue(formData);
    }
  };

  const onFinish = async (dataObj) => {
    let url = `/api/event`;
    let { start_end_time, released_close_date } = dataObj;
    let obj = {
      ...dataObj,
      start_time: start_end_time[0],
      end_time: start_end_time[1],
      released_date: released_close_date[0],
      close_date: released_close_date[1]
    }
  
    // Patch
    let resp = await Service.call("get", `/api/event`);
    // if (data.)
    console.log(resp);
    if (resp.eventRc.event_id) {
      await Service.call("patch", url, {...obj, event_id: resp.eventRc.event_id});
      message.success("success");
      
      props.setReferenceNumber(resp.eventRc.event_code);
      return props.setStep(2);
    }

    // POST
    resp = await Service.call("post", url, obj);
    if (resp.errorMessage) {
      return message.error(resp.errorMessage);
      // return props.openModal(true);
    }
    message.success("success");
    props.setReferenceNumber(resp.eventRc.event_code);
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
        label="Name"
        name="name"
        rules={[{ required: false, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Short Description"
        name="short_desc"
        rules={[{ required: false, message: "Please input Company Name." }]}
      >
        <Input.TextArea autoSize={{ minRows: 3}}/>
      </Form.Item>
      <Form.Item
        label="Long Description"
        name="long_desc"
        rules={[{ required: false, message: "Please input Company Owner." }]}
      >
        <Input.TextArea autoSize={{ minRows: 5}} />
      </Form.Item>
      <Form.Item
        label="Event Period"
        name="start_end_time"
        rules={[{ required: false, message: "Please input Found Date." }]}
      >
        <DatePicker.RangePicker
          disabledDate={(current) => current && current < moment().subtract(1, 'day')}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [
              moment("00:00:00", "HH:mm:ss"),
              moment("11:59:59", "HH:mm:ss"),
            ],
          }}
          format="YYYY-MM-DD HH:mm:ss"
        />
      </Form.Item>
      <Form.Item
        label="Sell Period"
        name="released_close_date"
        rules={[{ required: false, message: "Please input Found Date." }]}
      >
        <DatePicker.RangePicker
          disabledDate={(current) => current && current < moment().subtract(1, 'day')}
          showTime={{
            hideDisabledOptions: true,
            defaultValue: [
              moment("00:00:00", "HH:mm:ss"),
              moment("11:59:59", "HH:mm:ss"),
            ],
          }}
          format="YYYY-MM-DD HH:mm:ss"
        />
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
    let resp = await Service.call("get", `/api/event`);
    if (resp.eventRc) {
      setImageURL(`${app.config.STATIC_SERVER_URL}/media/${resp.eventRc.approval_doc}`);
    }
  };

  const uploadOnChange = async (info) => {
    const { status, response } = info.file;
    if (status === "done") {
      if (response.status > 0) {
        message.success("成功上載");
        let patchObj = {
          approval_doc: info.file.response.filename,
          status: 0 // pending
        };
        await Service.call("patch", "/api/event", patchObj);

        let path = info.file.response.url;
        setImageURL(path);
        setFileInfo(info.file);
      } else {
        message.error("上載失敗");
      }
    }
  };

  const onRemove = () => {
    setFileInfo({});
    setImageURL("");
  };

  console.log(fileInfo);

  return (
    <Form>
      <Row justify="center">
        <Col>
          <h2>相關文件證明</h2>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={12}>
          <FormUploadFile
            type="one"
            data={{ scope: "private" }}
            onChange={uploadOnChange}
            onRemove={onRemove}
            imageURL={imageURL}
          />
        </Col>
      </Row>
      <Divider style={{ border: "none" }} />
      {/* <Row>
        <Col>
          {fileInfo.name}
          {(((fileInfo.size) / 1024 )/ 1024).toFixed(2)} MB
          <Progress percent={proress} />
        </Col>
      </Row> */}
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
            <Button className="custom-btn" onClick={async () => {
              let resp = await Service.call("get", "/api/event");
              console.log('test_>>>', resp.eventRc)
              if (resp.eventRc.approval_doc === '') {
                return openNotification()
              }
              await Service.call("patch", "/api/event", { status: 1 });
              props.setStep(3)
            }}>
              Next
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </Form>
  );
};

export default EventForm;
