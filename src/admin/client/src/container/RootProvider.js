import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setConfig,
  setAdmin,
  setAuth,
  setCompanyAdmin,
  setIsAdmin,
  setSCEventAPI,
  setSCEvents,
  setLoading,
} from "../redux/actions/common";
import * as Service from "../core/Service";
import _ from "lodash";
import Path from "../routes/Path";
import LoadingScreen from '../components/LoadingScreen'
import { EventAPI } from "../smart-contract/api/Event";

const eventAPI = new EventAPI();

const RootProvider = () => {
  const loading = useSelector((state) => state.app.loading);
  const [loadingSc, setLoadingSc] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    init();
  }, []);

  const loadBlockchain = async () => {
    // let event = await eventAPI.init();

    // console.log("init blockchain", eventAPI);
    // dispatch(setSCEventAPI(eventAPI));
    // let events = await eventAPI.getEventAll();
    // let tickets = await eventAPI.getTicketAll();
    let events = await Service.call("get", `/api/sc/event`);
    let tickets = await Service.call("get", `/api/sc/event/ticket`);
    dispatch(setSCEvents(events));
    console.log('events', events)
    console.log('tickets', tickets)
    setLoadingSc(false);
  };

  const init = async () => {
    let resp = await Service.call("get", "/api/config");
    if (resp && resp.status > 0) {
      dispatch(setConfig(resp));
    } else {
      throw new Error("failed to get app config");
    }



    resp = await Service.call("get", `/api/admin`);

    if (!resp || resp.status <= 0) {
      dispatch(setAuth(false));
      dispatch(setLoading(false));
      return;
    }
    setLoadingSc(true)
    loadBlockchain();

    if (resp.userData[0].role === 1) {
      dispatch(setAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      return;
    }

    if (resp.userData[0].role === 2) {
      dispatch(setCompanyAdmin(resp.userData[0]));
      dispatch(setAuth(true));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      return;
    }
  };

  console.log('loading', loading);
  console.log('loadingSc', loadingSc);

  if (loading || loadingSc) return <LoadingScreen></LoadingScreen>

  return (
    <>
      <Path />
    </>
  );
};

export default RootProvider;
