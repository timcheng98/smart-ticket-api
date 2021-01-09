import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import KycInfo from './Info';
import KycForm from './Form'

import * as Service from '../../../core/Service';

const CompanyKyc = (props) => {
  const location = useLocation();
  const [company, setCompany] = useState(null);
  const [again, setAgain] = useState(false);
  const [isDraft, setDraft] = useState(false);

  useEffect(() => {
    getInitalState();
    if (location.state) {
      setAgain(location.state.again)
    }
  }, [location])

  const getInitalState = async () => {
    let data = await Service.call('get', '/api/company/admin/kyc/single');
    console.log('data', data);

    if (data.company_kyc_id) {
      if (data.status === 0) {
        return setDraft(true)
      }
      setCompany(data);
    }
  }
  
  if (!company || again || isDraft) {
    return (<KycForm />)
  }

  return (<KycInfo />)
}

export default CompanyKyc;
