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

const { Option } = Select;

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
  const location = useLocation();
  const form_data = useSelector(state => state.form.form_data)
  const [eventId, setEventId] = useState(0)
  const [eventCode, setEventCode] = useState('');
  const dispatch = useDispatch();

  useEffect(() => {
    getEventId();
  }, []);

  const getEventId = () => {
    if (!location.state) {
      return setEventId(0);
    }
    setEventId(location.state.event_id)
  }

  useEffect(() => {
    setEventCode(form_data.event_code)
  }, [form_data])

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
              eventId={eventId}
            />
          </Col>
        )}
        {step === 2 && (
          <Col span={24}>
            <SupportDocument
              setStep={setStep}
              eventId={eventId}
            />
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
                <CheckCircleFilled style={{ fontSize: 68, color: '#52c41a' }} />
              </Col>
              <Col span={24} style={{fontSize: 20, fontWeight: 'bold'}}>Application Submitted Successfully.</Col>
              <Col span={24} style={{fontSize: 18, fontWeight: 'bold'}}>Reference No. {eventCode}</Col>
              <Col span={24}>
                <Button
                  className="custom-btn"
                  onClick={() => {
                    dispatch(CommonActions.setFormData({}))
                    history.push("/company/event/list")
                  }}
                >
                  Go Back Home
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
  const [mapLocation, setMapLocation] = useState({
    lng: '',
    lat: ''
  })

  useEffect(() => {
    dispatch(CommonActions.setFormData({}));
    getInitialValue();
  }, [props.eventId]);

  useEffect(() => {
    infoForm.setFieldsValue({
      ...form_data
    })
  }, [form_data])

  const getInitialValue = async () => {

    let resp = await Service.call("get", `/api/event?event_id=${props.eventId}`);
    if (_.isEmpty(resp.eventRc)) {
      return dispatch(CommonActions.setFormData({}));
    }

    let eventRc = resp.eventRc[0];
    let formData = {
      ...eventRc,
      tags: JSON.parse(eventRc.tags),
      categories: JSON.parse(eventRc.categories),
      start_end_time: [moment.unix(eventRc.start_time), moment.unix(eventRc.end_time)],
      released_close_date: [moment.unix(eventRc.released_date), moment.unix(eventRc.close_date)]
    }
    infoForm.setFieldsValue(formData);
    setMapLocation({ lng: formData.longitude, lat: formData.latitude })
    return dispatch(CommonActions.setFormData(formData));
  };

  console.log(mapLocation);
  return (
    <Form
      form={infoForm}
      {...formItemLayout}
      onFinishFailed={({ values, errorFields, outOfDate }) => notification.warning(errorFields)}
    >
      <Form.Item
        label="Event Name"
        name="name"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Performer"
        name="performer"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Organization"
        name="organization"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Contact Number"
        name="contact_no"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input placeholder="Format: +Code-Tel" />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Categories"
        name="categories"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Select mode="tags" style={{ width: '100%' }} placeholder="Multiple Select/Add by yourself">
          <Option value="sing">Sing</Option>
          <Option value="dance">Dance</Option>
          <Option value="music">Music</Option>
          <Option value="gaming">Gaming</Option>
          <Option value="sport">Sport</Option>
          <Option value="charity">charity</Option>
          <Option value="band">Band</Option>
          <Option value="talk">Talk</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Short Description"
        name="short_desc"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input.TextArea autoSize={{ minRows: 3 }} />
      </Form.Item>
      <Form.Item
        label="Long Description"
        name="long_desc"
        rules={[{ required: true, message: "Please input Company Owner." }]}
      >
        <Input.TextArea autoSize={{ minRows: 5 }} />
      </Form.Item>
      <Form.Item
        label="Event Period"
        name="start_end_time"
        rules={[{ required: true, message: "Please input Found Date." }]}
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
        rules={[{ required: true, message: "Please input Found Date." }]}
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
        label="Country"
        name="country"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input placeholder="if no, fill N/A" />
      </Form.Item>
      <Form.Item
        label="Region"
        name="region"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input placeholder="if no, fill N/A" />
      </Form.Item>
      <Form.Item
        label="District"
        name="district"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Venue"
        name="venue"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Geolocation: Latitude"
        name="latitude"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <InputNumber onChange={(value) => setMapLocation({ ...mapLocation, lat: value })} style={{ width: '100%' }} />
      </Form.Item>
      <Form.Item
        label="Geolocation: Longitude"
        name="longitude"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <InputNumber onChange={(value) => setMapLocation({ ...mapLocation, lng: value })} style={{ width: '100%' }} />
      </Form.Item>
      {
        (mapLocation.lat !== '' && mapLocation.lng !== '') && <Form.Item label="Map Preview">
          <iframe src={`https://maps.google.com/maps?q=${mapLocation.lat}, ${mapLocation.lng}&z=18&output=embed&language=zh-HK`} width="100%" height="400" frameborder="0" ></iframe>
        </Form.Item>
      }
      <Form.Item
        label="Tags"
        name="tags"
        rules={[{ required: true, message: "Please input Company Name." }]}
      >
        <Select mode="tags" style={{ width: '100%' }} placeholder="Multiple Select/Add by yourself">
          <Option value="famous">Famous</Option>
          <Option value="hot">Hot</Option>
          <Option value="dance">Dance</Option>
          <Option value="sing">Sing</Option>
          <Option value="gaming">Gaming</Option>
          <Option value="esports">E-sports</Option>
          <Option value="compeition">Competition</Option>
          <Option value="band">Band</Option>
          <Option value="charity">charity</Option>
          <Option value="sport">sport</Option>
          <Option value="hk">HK</Option>
          <Option value="uk">UK</Option>
          <Option value="live">Live</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Target"
        name="target"
        rules={[{ required: true, message: "Please input Company Code." }]}
      >
        <Select style={{ width: '100%' }} placeholder="Please Select">
          <Option value="adult or above">Adult or above</Option>
          <Option value="teenage or above">Teengages or above</Option>
          <Option value="children or above">Children or above</Option>
        </Select>
      </Form.Item>
      <Form.Item
        label="Need KYC?"
        name="need_kyc"
        rules={[{ required: false, message: "Please input Company Code." }]}
      >
        <Select style={{ width: '100%' }} placeholder="Please Select">
          <Option value={0}>No</Option>
          <Option value={1}>Yes</Option>
        </Select>
      </Form.Item>
      <Divider style={{ border: "none" }} />
      <Row justify="space-between" style={{ padding: "0 5%" }}>
        <Col></Col>
        <Col>
          <Form.Item>
            <Button className="custom-btn" onClick={() => {
              let errors = []
              _.each(infoForm.getFieldsValue(), (value, key) => {
                console.log(value)
                if (_.isUndefined(value)) {
                  errors.push(key)
                }
              })
              
              console.log(errors)
              if (!_.isEmpty(errors)) {
                _.map(errors, (value) => {
                  return notification.warning({ message: `${value} is required` })
                });
                return;
              }
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
  const [imageURL, setImageURL] = useState({
    approval_doc: '',
    banner_1: '',
    banner_2: '',
    thumbnail: '',
    seat_doc: ''
  });
  const form_data = useSelector((state) => state.form.form_data);
  const dispatch = useDispatch();
  const location = useLocation();

  useEffect(() => {
    getInitialValue();
  }, [form_data]);

  const getInitialValue = async () => {
    setImageURL({
      seat_doc: form_data.seat_doc,
      approval_doc: form_data.approval_doc,
      banner_1: form_data.banner_1,
      banner_2: form_data.banner_2,
      thumbnail: form_data.thumbnail
    });
  }

  const uploadOnChange = async (info, key_field) => {
    const { status, response } = info.file;
    if (status === "done") {
      if (response.status > 0) {
        let reader = new FileReader();
        reader.readAsArrayBuffer(info.file.originFileObj);
        reader.onload = async (e) => {
          let result = await ipfs.add(Buffer(e.target.result))
          let patchObj = {
            [key_field]: `https://ipfs.io/ipfs/${result.path}`,
          };

          dispatch(CommonActions.setFormData({ ...form_data, ...patchObj }))
        }

        message.success("Upload Success");
        let path = info.file.response.url;
        setImageURL({
          ...imageURL,
          [key_field]: path
        });
      } else {
        message.error("Upload Failed");
      }
    }
  };

  const onRemove = () => {
    setImageURL({});
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
          <Form.Item
            label="Approval Document"
          >
            <FormUploadFile
              type="one"
              data={{ scope: "private" }}
              onChange={(file) => uploadOnChange(file, 'approval_doc')}
              onRemove={onRemove}
              imageURL={imageURL.approval_doc}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={24}>
          <Form.Item
            label="Banner 1"
          >
            <FormUploadFile
              type="one"
              data={{ scope: "private" }}
              onChange={(file) => uploadOnChange(file, 'banner_1')}
              onRemove={onRemove}
              imageURL={imageURL.banner_1}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={24}>
          <Form.Item
            label="Seat Document "
          >
            <FormUploadFile
              type="one"
              data={{ scope: "private" }}
              onChange={(file) => uploadOnChange(file, 'seat_doc')}
              onRemove={onRemove}
              imageURL={imageURL.seat_doc}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={24}>
          <Form.Item
            label="Banner 2"
          >
            <FormUploadFile
              type="one"
              data={{ scope: "private" }}
              onChange={(file) => uploadOnChange(file, 'banner_2')}
              onRemove={onRemove}
              imageURL={imageURL.banner_2}
            />
          </Form.Item>
        </Col>
      </Row>
      <Row justify="center" style={{ padding: 50 }}>
        <Col span={24}>
          <Form.Item
            label="Thumbnail"
          >
            <FormUploadFile
              type="one"
              data={{ scope: "private" }}
              onChange={(file) => uploadOnChange(file, 'thumbnail')}
              onRemove={onRemove}
              imageURL={imageURL.thumbnail}
            />
          </Form.Item>
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
                let { start_end_time, released_close_date } = form_data;
                let dataObj = {
                  ...form_data,
                  event_id: props.eventId,
                  start_time: start_end_time[0],
                  end_time: start_end_time[1],
                  released_date: released_close_date[0],
                  close_date: released_close_date[1],
                  status: 1
                }
                if (!dataObj.approval_doc || !dataObj.banner_1 || !dataObj.banner_2 || !dataObj.thumbnail || !dataObj.seat_doc) {
                  dataObj = {
                    ...dataObj,
                    status: 0
                  }
                }
                if (props.eventId === 0) {
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
