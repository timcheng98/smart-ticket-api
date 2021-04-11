const _ = require("lodash");
const uuid = require("uuid");
const shortid = require("shortid");
const moment = require("moment");
const AppError = require("../../lib/app-error");
const helper = require("../../lib/helper");
const transactionModel = require("../../model/smart-contract/transaction");
const middleware = require("./middleware");
// const { DefaultAzureCredential } = require("@azure/identity");
// const { SecretClient } = require("@azure/keyvault-secrets");
const debug = require("debug")(`app:event`);

const ERROR_CODE = {};

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    // router.use('/api/sc/event', middleware.session.authorize());
    router.get("/api/entry/audit_trail/all", getAllTransaction);
    // router.get("/api/payment/transaction/wallet", getTransactionByWallet);
    // router.get("/api/payment/transaction/user", getTransactionByUser);
    router.post("/api/entry/audit_trail", createEntryAuditTrail);
  },
};

const getAllTransaction = async (req, res) => {
  try {
    let result = await transactionModel.selectEntryAuditTrail({ all: true });
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
}

const createEntryAuditTrail = async (req, res) => {
  try {
    let obj = {
      event_id: -1,
      ticket_id: -1,
      message: '',
      status: 0,
      admin_id: req.user.admin_id,
      ...req.body
    }
    let result = await transactionModel.insertEntryAuditTrail(obj);
    res.apiResponse({
      status: 1,
      result,
    });
  } catch (error) {
    console.error(error);
    res.apiError(error);
  }
};
 