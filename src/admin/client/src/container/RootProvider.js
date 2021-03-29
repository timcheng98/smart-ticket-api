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


const RootProvider = () => {
  const loading = useSelector((state) => state.app.loading);
  const [loadingSc, setLoadingSc] = useState(true);
  const dispatch = useDispatch();

  useEffect(() => {
    init();
  }, []);

  const loadBlockchain = async () => {
    setLoadingSc(true)
    let events = await Service.call("get", `/api/sc/event`);
    dispatch(setSCEvents(_.keyBy(events, 'event_id')));
    setLoadingSc(false);
  };

  const init = async () => {
    dispatch(setLoading(true));
    await loadBlockchain();
    let resp = await Service.call("get", "/api/config");
    if (resp && resp.status > 0) {
      dispatch(setConfig(resp));
    } else {
      throw new Error("failed to get app config");
    }

    resp = await Service.call("get", `/api/admin`);

    if (!resp || resp.status <= 0) {
      dispatch(setSCEvents({}));
      dispatch(setLoading(false));
      dispatch(setAuth(false));
      return;
    }


    if (resp.userData[0].role === 'admin') {
      dispatch(setAdmin(resp.userData[0]));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      dispatch(setAuth(true));
      return;
    }

    if (resp.userData[0].role === 'company') {
      dispatch(setCompanyAdmin(resp.userData[0]));
      dispatch(setIsAdmin(resp.userData[0]));
      dispatch(setLoading(false));
      dispatch(setAuth(true));
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
