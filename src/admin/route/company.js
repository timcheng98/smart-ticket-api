const _ = require('lodash');
const uuidv4 = require('uuid/v4');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const middleware = require('./middleware');
const moment = require('moment');
const kycModel = require('../../model/company/kyc');


const ERROR_CODE = {
  [-60001]: 'Company user RFID exists',
  [-60002]: 'Exceed maximum company admin account creation',
  [-60003]: 'RFID record cannot find, it maybe deleted or removed by admin',
}
AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
  initRouter: (router) => {
    /* Authorize */
    router.use('/api/company', middleware.session.authorize());

    /* Company Admin KYC */
    router.get('/api/company/admin/kyc', getKycList);
    router.get('/api/company/admin/kyc/single', getKycById);
    router.post('/api/company/admin/kyc', postKyc);
    router.patch('/api/company/admin/kyc', patchKyc);
    router.patch('/api/company/admin/kyc/single', patchKycById);

  }
};

const getKycList = async (req, res) => {
  try {
    let result = await kycModel.selectKyc({
      all: true
    });
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
} 

const getKycById = async (req, res) => {
  try {
    let result = await kycModel.selectKyc(req.user.admin_id);
    console.log('test_test', result );

    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
} 

const postKyc = async (req, res) => {
  try {
    let postData = {
      admin_id: req.user.admin_id,
      check_by: 0,
      is_company_doc_verified: 0,
      status: 0, // draft
      company_size: '',
      company_code: '',
      company_doc: '',
      name: '',
      description: '',
      owner: '',
      address: '',
      industry: '',
      found_date: moment().unix(),
    }
 
    postData = helper.validateFormData(req.body, postData);
    let postObj = postData;
    postObj.reference_no = `${moment().format('YYMMDD')}-${uuidv4().split('-')[1]}`
    let result = await kycModel.insertKyc(postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchKyc = async (req, res) => {
  try {
    const postData = { status: 0 };

    _.each(_.pick(req.body, [
      'description', 'owner', 'address', 'name', 'company_code', 'company_doc', 'company_size', 'industry', 'reject_reason'
    ]), (val, key) => {
      postData[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'status', 'is_company_doc_verified'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });

    _.each(_.pick(req.body, [
      'found_date'
    ]), (val, key) => {
      postData[key] = _.toInteger(moment(val).unix());
    });
 
    let postObj = postData;
    let result = await kycModel.updateKyc(req.user.admin_id, postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}

const patchKycById = async (req, res) => {
  try {
    const postData = {};

    _.each(_.pick(req.body, [
      'reject_reason', 'company_doc'
    ]), (val, key) => {
      postData[key] = _.toString(val);
    });

    _.each(_.pick(req.body, [
      'is_company_doc_verified', 'admin_id', 'status', 'check_by'
    ]), (val, key) => {
      postData[key] = _.toInteger(val);
    });
 
    let postObj = postData;
    let result = await kycModel.updateKyc(postObj.admin_id, postObj);
    res.apiResponse({
      status: 1, result
    })
  } catch (error) {
    res.apiError(error)
  }
}