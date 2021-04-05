const fs = require("fs");
const path = require("path");
const config = require("config");
const _ = require("lodash");
const express = require("express");
const passport = require("passport");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const model = require("../../model");
const middleware = require("./middleware");

// const ERROR_CODE = {
//   [-40001]: 'Invalid user account'
// };
// AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    router.use("/api/dashboard", middleware.session.authorize());
    router.get("/api/dashboard/client", getClientInfo);
  },
};

const getClientInfo = async (req, res) => {
  try {
    let result = await model.client.selectClient({
      all: true,
      fields: ["client_id", "ctime", "utime", "client_status", "user_id"],
    });
    res.apiResponse({ status: 1, result });
  } catch (error) {
    res.apiError(error);
  }
};
