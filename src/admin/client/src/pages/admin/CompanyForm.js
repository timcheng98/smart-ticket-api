import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Button, Col, Form, Input, InputNumber, Layout, Modal,
  notification, Radio, Row, Select, Tabs, Upload, message
} from 'antd';
import moment from 'moment';
import * as Service from '../../core/Service';
import {formItemLayout, tailLayout} from '../../components/ModalLayout'

const CompanyForm = (props) => {
  const [form] = Form.useForm();

  useEffect(() => {
    form.resetFields();
  },[props.dataObj]);

  const onFinish = async (postObj) => {
    let url = `/api/company`;

    //Patch
    if (props.dataObj.company_id > 0) {
        postObj.company_id = props.dataObj.company_id;
        let data = await Service.call('patch', url, postObj);
        if (data.errorMessage) {
          message.error(data.errorMessage);
          return props.openModal(true);
        }
        message.success('success');
        return props.openModal(false);
    }

    // POST
    postObj.create_time = moment().unix();
    let data = await Service.call('post', url, postObj);
    if (data.errorMessage) {
      message.error(data.errorMessage);
      return props.openModal(true);
    }
    message.success('success');
    return props.openModal(false);
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
        label="Company Key"
        name="company_key"
        rules={[{ required: true, message: 'Please input Company Key.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Company Name"
        name="company_name"
        rules={[{ required: true, message: 'Please input Company Name.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Maximun Admin Account"
        name="admin_account_max"
        rules={[{ required: true, type: 'number' }]}
      >
        <InputNumber />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          className="custom-btn"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
  )
}

export default CompanyForm;
