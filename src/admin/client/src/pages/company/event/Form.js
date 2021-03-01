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
import { useHistory, Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import * as Service from "../../../core/Service";
import AppLayout from "../../../components/AppLayout";
import * as CommonActions from '../../../redux/actions/common';
import FormUploadFile from "../../../components/FormUploadFile";
import { formItemLayout, tailLayout } from "../../../components/ModalLayout";

const ipfsClient = require('ipfs-http-client')
const ipfs = ipfsClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' })

const involvedModelName = "company";
const title = "Event Application Form";
const selectedKey = "company_event";
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
  const history = useHistory();
  const form_data = useSelector(state => state.form.form_data)

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
              setStep={setStep}
            />
          </Col>
        )}
        {step === 2 && (
          <Col span={24}>
            <SupportDocument setStep={setStep} />
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
              <Col span={24}>Reference No. {form_data.event_code}</Col>
              <Col span={24}>
                <Button
                  type="primary"
                  onClick={() => history.push("/company/event/list")}
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
  const form_data = useSelector(state => state.form.form_data);
  const location = useLocation();
  const [infoForm] = Form.useForm();
  const dispatch = useDispatch();

  useEffect(() => {
    getInitialValue();
  }, [location]);

  const getInitialValue = async () => {
    let resp = await Service.call("get", `/api/event?event_id=${location.state.event_id}`);
    if (_.isEmpty(resp.eventRc)) {
      return dispatch(CommonActions.setFormData({}));
    }

    let eventRc = resp.eventRc[0];
    let formData = {
      ...eventRc,
      start_end_time: [moment.unix(eventRc.start_time), moment.unix(eventRc.end_time)],
      released_close_date: [moment.unix(eventRc.released_date), moment.unix(eventRc.close_date)]
    }
    infoForm.setFieldsValue(formData)
    return dispatch(CommonActions.setFormData(formData));
  };

  return (
    <Form
      form={infoForm}
      {...formItemLayout}
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
        <Input.TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>
      <Form.Item
        label="Long Description"
        name="long_desc"
        rules={[{ required: false, message: "Please input Company Owner." }]}
      >
        <Input.TextArea autoSize={{ minRows: 5 }} />
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
              moment("00:00:00", "HH:mm"),
              moment("11:59:59", "HH:mm"),
            ],
          }}
          format="YYYY-MM-DD HH:mm"
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
              moment("00:00:00", "HH:mm"),
              moment("11:59:59", "HH:mm"),
            ],
          }}
          format="YYYY-MM-DD HH:mm"
        />
      </Form.Item>
      <Divider style={{ border: "none" }} />
      <Row justify="space-between" style={{ padding: "0 5%" }}>
        <Col></Col>
        <Col>
          <Form.Item>
            <Button className="custom-btn" onClick={() => {
              dispatch(CommonActions.setFormData({ ...form_data, ...infoForm.getFieldsValue() }))
              props.setStep(2);
            }}>
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
  const form_data = useSelector((state) => state.form.form_data);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    getInitialValue();
  }, []);

  const getInitialValue = async () => {
    setImageURL(form_data.approval_doc);
  };

  const uploadOnChange = async (info) => {
    const { status, response } = info.file;
    if (status === "done") {
      if (response.status > 0) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj);
        reader.onload = async (e) => {
          let result = await ipfs.add(Buffer(e.target.result))
          let patchObj = {
            approval_doc: `https://ipfs.io/ipfs/${result.path}`,
            status: 0 // pending
          };
          dispatch(CommonActions.setFormData({ ...form_data, ...patchObj }))
        }

        message.success("Upload Success");
        let path = info.file.response.url;
        setImageURL(path);
        setFileInfo(info.file);
      } else {
        message.error("Upload Failed");
      }
    }
  };

  const onRemove = () => {
    setFileInfo({});
    setImageURL("");
  };


  return (
    <>
      <Row justify="center">
        <Col>
          <h2>Related Documents</h2>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={24}>
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
                console.log(location)
                let { start_end_time, released_close_date } = form_data;
                let dataObj = {
                  ...form_data,
                  event_id: location.state.event_id,
                  start_time: start_end_time[0],
                  end_time: start_end_time[1],
                  released_date: released_close_date[0],
                  close_date: released_close_date[1],
                  status: 1
                }
                if (!dataObj.approval_doc) {
                  dataObj = {
                    ...dataObj,
                    status: 0
                  }
                }
                if (location.state.event_id === 0) { 
                  const result = await Service.call('post', '/api/event', dataObj);
                  props.setStep(3);
                  return dispatch(CommonActions.setFormData({ ...form_data, ...result.eventRc }));
                }
              
                const result = await Service.call('patch', '/api/event', dataObj);
                props.setStep(3);
                return dispatch(CommonActions.setFormData({ ...form_data, ...result.eventRc }));
              }}
            >
              Next
            </Button>
          </Form.Item>
        </Col>
      </Row>
    </>
  );
};

export default EventForm;
