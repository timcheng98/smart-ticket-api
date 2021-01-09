import React, { useState, useEffect } from 'react';
import _ from 'lodash';
import { useLocation } from "react-router-dom";
import EventForm from './Form';
import EventInfo from './Info'

import * as Service from '../../../core/Service';

const CompanyEvent = (props) => {
  const location = useLocation();
  const [event, setEvent] = useState({});
  const [again, setAgain] = useState(false);
  const [isDraft, setDraft] = useState(false);

  useEffect(() => {
    getInitalState();

    if (location.state) {
      setAgain(location.state.again);
    }
  }, [location])

  const getInitalState = async () => {
    let resp = await Service.call('get', '/api/event');
    if (resp.eventRc.event_id > 0) {
      if (resp.eventRc.status === 0) {
        return setDraft(true)
      }
      setEvent(resp.eventRc);
    }
  }

  if (!event || again || isDraft) {
    return (<EventForm />)
  }


  return (<EventInfo />)
}

export default CompanyEvent;
