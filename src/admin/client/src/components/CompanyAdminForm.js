import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import {
  Button, Col, Form, Input, Layout, Modal,
  notification, Radio, Row, Select, Tabs, Upload, message
} from 'antd';
import moment from 'moment';
import * as Service from '../core/Service';
import {formItemLayout, tailLayout} from './ModalLayout'
import { useSelector } from 'react-redux';

const { Option } = Select;

const CompanyAdminForm = (props) => {
  const [form] = Form.useForm();
  const [companyList, setCompanyList] = useState([]);
  const admin = useSelector(state=> state.app.admin);

  useEffect(() => {
    form.resetFields();
  },[props.dataObj]);

  useEffect(() => {
    getAllData();
  }, []);

  const getAllData = async () => {
    let companyList = [];    
    try {
      let companyData = await Service.call('get', `/api/company/list`);
      companyList = _.orderBy(companyData, ['company_id']);
    
    } catch (error) {
      console.error('error >>> ', error);
    } finally {
      setCompanyList(companyList);
    }
  }

  const onFinish = async (postObj) => {
    if (_.isEmpty(postObj.nickname)) {
      postObj.nickname = '-';
      }

    //Patch
    if (props.dataObj.company_admin_id > 0) {
        postObj.company_admin_id = props.dataObj.company_admin_id;
        let data = await Service.call('patch', '/api/patch/company/admin', postObj);
        if (data.errorMessage) {
          message.error(data.errorMessage);
          return props.openModal(true);
        }
        message.success('success');
        return props.openModal(false);
    }

    // POST
    postObj.create_time = moment().unix();
    let data = await Service.call('post', `/api/post/company/admin`, postObj);
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
        label="Company"
        name="company_id"
        rules={[{ required: true, message: 'Please select one.' }]}
      >
        <Select placeholder="- select one -" disabled={props.dataObj.company_id}>
          {companyList.map(({company_id, company_name}) => 
            (<Option key={company_id} value={company_id}>{`(${company_id}) `+company_name}</Option>)
          )}
        </Select>
      </Form.Item>
      <Form.Item
        label="First name"
        name="first_name"
        rules={[{ required: true, message: 'Please input first name.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Last name"
        name="last_name"
        rules={[{ required: true, message: 'Please input last name.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Nickname"
        name="nickname"
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Email"
        name="email"
        rules={[{ required: true, message: 'Please input email.', type:'email' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mobile"
        name="mobile"
        rules={[{ required: true, message: 'Please input phone number.' }]}
      >
        <Input />
      </Form.Item>
      <Form.Item {...tailLayout}>
        <Button
          type="primary"
          htmlType="submit"
        >
          Submit
        </Button>
      </Form.Item>
    </Form>
    )
}

export default CompanyAdminForm;
