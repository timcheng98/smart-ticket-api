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
const companyKycModel = require('../../model/company/kyc')
const userKycModel = require('../../model/user/kyc')
const eventModel = require('../../model/event')
const transactionModel = require('../../model/smart-contract/transaction')

// const ERROR_CODE = {
//   [-40001]: 'Invalid user account'
// };
// AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    router.use("/api/dashboard", middleware.session.authorize());
    router.get("/api/dashboard", getOverviewData);
  },
};

const getOverviewData = async (req, res) => {
  try {
    let userRc = await model.user.selectUser({
      all: true
    });
    let companyRc = await companyKycModel.selectKyc({
      all: true
    });
    let userKycRc = await userKycModel.selectKyc({
      all: true
    });
    let eventRc = await eventModel.selectEvent({
      all: true
    });

    let paymentTransaction = await transactionModel.selectPaymentTransaction({
      all: true,
      order: ['ctime', 'DESC']
    })

    let entryTransaction = await transactionModel.selectEntryAuditTrail({
      all: true,
      order: ['ctime', 'DESC']
    })

    let blockchainTransaction = await transactionModel.selectTransaction({
      all: true,
      order: ['ctime', 'DESC']
    })

    let result = {
      total_user: userRc.length,
      total_user_kyc: userKycRc,
      total_company_kyc: companyRc,
      total_event: eventRc,
      payment_transaction: paymentTransaction,
      blockchain_transaction: blockchainTransaction,
      entry_logs: entryTransaction,
    }
    res.apiResponse({ status: 1, result });
  } catch (error) {
    res.apiError(error);
  }
};
