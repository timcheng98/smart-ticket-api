import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setConfig, setAdmin, setAuth, setCompanyAdmin } from '../redux/actions/common';
import { LoadingOutlined } from '@ant-design/icons';
import { Spin, Skeleton } from 'antd';
import * as Service from '../core/Service';
import _ from 'lodash';
import Path from '../routes/Path';
import AppLayout from '../components/AppLayout';

const RootProvider = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    init();
  }, [])

  const init = async () => {
    // setLoading(true);

    let resp = await Service.call('get', '/api/config');
    console.log(resp)
    if (resp && resp.status > 0) {
      dispatch(setConfig(resp));
    } else {
      throw new Error('failed to get app config');
    }

    resp = await Service.call('get', `/api/admin`);
    console.log(resp)
    if (resp && resp.status > 0) {
      dispatch(setAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      setLoading(false);
      return;
    }
    
    dispatch(setAuth(false));
    setLoading(false);
  }
 
  if (loading) {
    const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
    return (
      <div style={{position: 'absolute', top: '50%', left: '50%'}}>
        <Spin indicator={antIcon} />
      </div>
    );
  }

  return (
    <>
      <Path />
    </>
  );
}

export default RootProvider;