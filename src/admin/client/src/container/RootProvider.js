import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setConfig, setAdmin, setAuth, setCompanyAdmin } from '../redux/actions/common'
import * as Service from '../core/Service';
import _ from 'lodash';
import Path from '../routes/Path';

const RootProvider = () => {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    // init();
  }, [])

  const init = async () => {
    // setLoading(true);

    let resp = await Service.call('get', '/api/config');

    if (resp && resp.status > 0) {
      dispatch(setConfig(resp));
    } else {
      throw new Error('failed to get app config');
    }

    resp = await Service.call('get', `/api/admin`);
    if (resp && resp.status > 0) {
      dispatch(setAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      setLoading(false);
      return;
    }

    resp = await Service.call('get', `/api/login/get_company_admin`);
    if (resp && resp.status > 0) {
      dispatch(setCompanyAdmin(resp.userData));
      dispatch(setAuth(true));
      setLoading(false);
      return;
    }

    dispatch(setAuth(false));
    setLoading(false);
  }
 
  // if (loading) {
  //   const antIcon = <LoadingOutlined style={{ fontSize: 24 }} spin />;
  //   return (
  //     <div style={{position: 'absolute', top: '50%', left: '50%'}}>
  //       <Spin indicator={antIcon} />
  //     </div>
  //   );
  // }

  return (
    <>
      <Path />
    </>
  );
}

export default RootProvider;