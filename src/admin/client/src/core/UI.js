import _ from 'lodash';
import moment from 'moment';
import React from 'react';
import { Tag } from 'antd';
import {
  CheckCircleOutlined,
  SyncOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  MinusCircleOutlined,
  EditOutlined 
} from '@ant-design/icons';


export const momentFormat = (unixTime, outputFormat = 'YYYY/MM/DD') => {
  if (unixTime === 0) {
    return '-'
  } 
  return moment.unix(unixTime).format(outputFormat);
}


export const displayStatus = (value, opts = { "1": 'Activate', "0": 'Disable', "-1": 'Rejected', default: 'ERROR' }) => {
  let displayStr = '';
  let statusValue = _.toInteger(value);
  switch (statusValue) {
    case 1:
      displayStr = (<Tag icon={<CheckCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="green">{opts[1]}</Tag>);
      break;
    case 0:
      displayStr = (<Tag icon={<ClockCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="blue">{opts[0]}</Tag>);
      break;
    case -1:
      displayStr = (<Tag icon={<CloseCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="red">{opts[-1]}</Tag>);
      break;
    default:
      displayStr = (<Tag icon={<CloseCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="red">{opts.default}</Tag>);
      break;
  }
  return displayStr;
}

export const displayApplicationStatus = (value, opts = {2: 'Activate', 1: 'Pending', 0: 'Draft', "-1": 'Rejected', default: 'ERROR' }) => {
  let displayStr = '';
  let statusValue = _.toInteger(value);
  switch (statusValue) {
    case 2:
      displayStr = (<Tag icon={<CheckCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="green">{opts[2]}</Tag>);
      break;
    case 1:
      displayStr = (<Tag icon={<ClockCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="blue">{opts[1]}</Tag>);
      break;
    case 0:
      displayStr = (<Tag icon={<EditOutlined  style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12, color: '#000'}} color="#f5f5f5">{opts[0]}</Tag>);
      break;
    case -1:
      displayStr = (<Tag icon={<CloseCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="red">{opts[-1]}</Tag>);
      break;
    default:
      displayStr = (<Tag icon={<CloseCircleOutlined style={{fontSize: 12}} />} style={{padding: '6px 15px', border: 'none', borderRadius: 15, fontWeight: 'bold', fontSize: 12}} color="red">{opts.default}</Tag>);
      break;
  }
  return displayStr;
}