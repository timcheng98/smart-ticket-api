const fs = require('fs');
const path = require('path');
const config = require('config');
const _ = require('lodash');
const express = require('express');
const passport = require('passport');
const AppError = require('../../lib/app-error');
const helper = require('../../lib/helper');
const model = require('../../model');
const middleware = require('./middleware');
const company = require('../../model/company/company');
const controllerModel = require('../../model/controller');
const moment = require('moment');
const ut = require('@ikoala/node-util');
const uuidv4 = require('uuid/v4');
const company_user = require('../../model/company/user');

const ERROR_CODE = {
    [-90001]: 'Door QRCode record cannot find, it maybe deleted or removed by admin',
}

AppError.setErrorCode(ERROR_CODE);

module.exports = exports = {
    initRouter: (router) => {
        router.use('/api/company_door_qrcode/*', middleware.session.authorize());
        router.get('/api/company_door_qrcode/list', getCompanyDoorQRCode);
        router.get('/api/company_door_qrcode/specific/:passcode', getCompanyDoorQRCodeByPasscode);
        router.get('/api/company_door_qrcode/:company_id', getCompanyDoorQRCodeById);
        router.get('/api/getcompanydoor', getCompanyDoor);
        router.post('/api/company_door_qrcode/postdoorqrcoderecord', postDoorQRCodeRecord);
        router.patch('/api/company_door_qrcode/putdoorqrcoderecord', putDoorQRCodeRecord);
        router.patch('/api/company_door_qrcode/putdoorqrcoderecord/status', putDoorQRCodeRecordStatus);
    }
};

const getCompanyDoorQRCode = async (req, res) => {
    try {
        let result = await company.selectQRCode({
            all: true
        });
        res.apiResponse({
            status: 1, result
        })
    } catch (error) {
        res.apiError(error)
    }
}

const getCompanyDoorQRCodeByPasscode = async (req, res) => {
    try {
        let {
            passcode
        } = req.params
        let doorQRCodeData = await company.selectQRCode({ where: { qrcode_door_passcode: passcode } });

        if (_.isEmpty(doorQRCodeData[0])) {
            throw new AppError(-90001);
        };

        doorQRCodeData = doorQRCodeData[0];
        doorQRCodeData.passcode = doorQRCodeData.qrcode_door_passcode;
        let companyDoorData = await company.selectDoor(doorQRCodeData.company_door_id);
        let userData = await company_user.selectUser(doorQRCodeData.company_user_id);
        let companyData = await company.selectCompany(userData.company_id);

        let result = {doorQRCodeData, userData, companyData, companyDoorData};

        res.apiResponse({
            status: 1, result
        });

    } catch (error) {
        res.apiError(error);
    }
}

const getCompanyDoorQRCodeById = async (req, res) => {
    try {
        let {
            company_id
        } = req.params
        let companyDoorIds = await company.selectDoor({ where: { company_id }, fields: ['company_door_id'] });
        let numArray = []
        for (let len in companyDoorIds) {
            numArray.push(companyDoorIds[len].company_door_id);
        }
        let result = await company.selectQRCode({
            where: { company_door_id: numArray }
        });
        res.apiResponse({
            result
        });
    } catch (error) {
        console.error(error)
    }
}

const getCompanyDoor = async (req, res) => {
    try {
        let result = await company.selectDoor({
            where: { company_id: 5 }
        })
        res.apiResponse({
            status: 1, result
        })
    }
    catch (error) {
        res.apiError(error)
    }
}

const postDoorQRCodeRecord = async (req, res) => {
    try {
        let CreateQRCodeFormat = {
            ctime: 0,
            utime: 0,
            company_door_id: 0,
            company_user_id: 0,
            first_name: '',
            last_name: '',
            gender: '',
            usage_count: 0,
            qrcode_door_passcode: '',
            start_date: '',
            expire_date: '',
            start_time: '',
            end_time: '',
            company_door_qrcode: '',
            identity: '',
            remark: '',
            is_active: 0,
            create_time: moment().unix(),
        };
        CreateQRCodeFormat = ut.form.validate(req.body, CreateQRCodeFormat);

        let {
            company_door_id,
            start_date,
            expire_date,
            start_time,
            end_time,
            usage_count,
            is_active,
        } = CreateQRCodeFormat;
        CreateQRCodeFormat.is_active = 1;
        let startTime = moment(start_time, 'HHmm').diff(moment().startOf('day'), 'seconds');
        let endTime = moment(end_time, 'HHmm').diff(moment().startOf('day'), 'seconds');
        const [companyDoor] = await company.selectDoor({
            fields: ['controller_device_id', 'door'],
            where: {
                company_door_id,
            },
        });
        const {
            controller_device_id,
            door,
        } = companyDoor;
        let passcodeData = {
            controller_device_id,
            passcode: uuidv4().replace(/-/g, ''),
            passcode_type: 0,
            passcode_time_start: moment(start_date, 'YYYY-MM-DD').unix() + startTime,
            passcode_time_end: moment(expire_date, 'YYYY-MM-DD').unix() + endTime,
            start_date,
            expire_date,
            start_time,
            end_time,
            usage_count,
            is_active: 1,
            door,
            signature: '',
        };
        let passcodeRc = await controllerModel.createPasscode(passcodeData);
        CreateQRCodeFormat.controller_passcode_id = passcodeRc.controller_passcode_id;
        CreateQRCodeFormat.qrcode_door_passcode = passcodeData.passcode;
        CreateQRCodeFormat.company_door_qrcode = ``;
        await company.insertQRCode(CreateQRCodeFormat);

        res.apiResponse({
            status: 1,
        })
    }
    catch (error) {
        res.apiError(error)
    }

}

const putDoorQRCodeRecord = async (req, res) => {
    try {
        let patchData = {
            company_door_id: 0,
            company_user_id: 0,
            first_name: '',
            last_name: '',
            // gender: '',
            usage_count: 0,
            // qrcode_door_passcode: '',
            start_date: '',
            expire_date: '',
            start_time: '',
            end_time: '',
            // company_door_qrcode: '',
            identity: '',
            remark: '',
            create_time: ''
        }
        let passcode_time_start = req.body.unix_start;
        let passcode_time_end = req.body.unix_end;
        patchData = helper.validateFormData(req.body, patchData);
        // patchData.first_name = req.body.receiver_first_name;
        // patchData.last_name = req.body.receiver_last_name;
        let {
            company_door_id,
            company_user_id,
            first_name,
            last_name,
            // gender,
            usage_count,
            start_date,
            expire_date,
            start_time,
            end_time,
            identity,
            remark,
        } = patchData
        let patchObj = {
            utime: moment().unix(),
            company_door_id,
            company_user_id,
            first_name,
            last_name,
            // gender,
            usage_count,
            start_date,
            expire_date,
            start_time,
            end_time,
            identity,
            remark,
        }
        let patchPasscode = {
            passcode_time_start,
            passcode_time_end,
            start_date,
            expire_date,
            start_time,
            end_time,
        }
        let qrcodeData = await company.selectQRCode(req.body.company_door_qrcode_id, { fields: ['qrcode_door_passcode'] });
        let passcodeData = await controllerModel.selectPasscode({ where: { passcode: qrcodeData.qrcode_door_passcode } });
        let passcodeResult = await controllerModel.updatePasscode(passcodeData[0].controller_passcode_id, patchPasscode);
        let result = await company.updateQRCode(req.body.company_door_qrcode_id, patchObj);

        res.apiResponse({
            result
        })
    }
    catch (error) {
        res.apiError(error)
    }

}

const putDoorQRCodeRecordStatus = async (req, res) => {
    try {
        let patchFormat = {
            is_active: 0
        };
        req.body.is_active = req.body.is_actived;
        let patchData = helper.validateFormData(req.body, patchFormat);
        // patchData.is_active = patchData.is_actived;
        if (patchData.is_active == 0) {
            patchData.is_active = 1;
        } else {
            patchData.is_active = 0;
        }
        let result = await company.updateQRCode(req.body.company_door_qrcode_id, patchData);
        result = await controllerModel.updatePasscode(req.body.controller_passcode_id, patchData);
        res.apiResponse({
            status: 1,
        })
    } catch (error) {
        res.apiError(error);
    }
}