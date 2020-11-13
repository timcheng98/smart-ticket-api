const fs = require('fs');
const crypto = require('crypto');
const querystring = require('querystring');
const _ = require('lodash');
const moment = require('moment');
// const uuid = require('uuid');
// const shortid = require('shortid');
const uuidv4 = require('uuid/v4');
const config = require('config');
const admin = require("firebase-admin");
const db = require('@ikoala/node-mysql-promise');
const helper = require('../lib/helper');
const models = require('./index');

// let serviceAccountFile = config.get('FIREBASE.SERVICE_ACCOUNT_FILE');

// firebase cloud message setting
// const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountFile));

admin.initializeApp({
  // credential: admin.credential.cert(serviceAccount),
  databaseURL: config.get('FIREBASE.DATABASE_URL')
});

const TABLE = {
  DRIVER_FCM_TOKEN: 'driver_fcm_token'
};

exports.selectFCM = models.createSelect(TABLE.DRIVER_FCM_TOKEN, 'driver_fcm_token_id')
exports.insertFCM = models.createInsert(TABLE.DRIVER_FCM_TOKEN, 'driver_fcm_token_id');
exports.updateFCM = models.createUpdate(TABLE.DRIVER_FCM_TOKEN, 'driver_fcm_token_id');


// exports.getFCM = async() => {
//   let stmt = 'SELECT * FROM `staff_fcm_token` WHERE `receive_fcm` = 1;';
//   return await db.query(stmt)
// };

// exports.getAllFCMToken = async() => {
//   let stmt = 'SELECT `token_id` FROM `staff_fcm_token` WHERE `receive_fcm` = 1;';
//   return await db.query(stmt)
// }
//
// exports.getFCMById = async(staff_id) => {
//   let stmt = 'SELECT * FROM `staff_fcm_token` WHERE `staff_id` = ? AND `receive_fcm` = 1;';
//   let params = [staff_id]
//   return await db.query(stmt, params)
// }

exports.writeFCMToken = async(staff_id, fcmToken) => {
  let res = await this.getFCM({where: {staff_id}})
  // let res = await this.getFCMById(staff_id);
  let timenow = moment().unix();
  if (Object.keys(res).length) {
    let obj = {
      token_id: fcmToken,
      last_update: timenow
    }
    if (fcmToken === res[0].token_id){
      return ;
    }
    // let record = await this.updateFCM(cm_id, obj)
    await this.updateFCM(staff_id, obj);
  } else {
    let timenow = moment().unix();
    let obj = {
      staff_id,
      token_id: fcmToken,
      receive_fcm: 1,
      last_update: timenow,
      ctime: timenow,
      utime: timenow
    }
    let record = await this.insertFCM(obj);
  }
}

exports.insertFCM = async(obj) => {
  let stmt = 'INSERT INTO `staff_fcm_token` SET ?'
  let params = [obj]
  return await db.query(stmt, params)
}

exports.updateFCM = async(staff_id, obj) => {
  let stmt = 'UPDATE `staff_fcm_token` SET ? WHERE staff_id = ?;'
  let params = [obj, staff_id]
  return await db.query(stmt, params)
}

exports.fcmByTopic = async(title, body, topic) => {
  try {
    let payload = {
      notification: {
        title,
        body
      }
    }
    admin.messaging().sendToTopic(topic, payload)
    .then((response) => {
      return {status: 1, result: response}
    })
    .catch((error) => {
      throw new AppError(-101, error)
    });
  } catch(error) {
    throw new AppError(-1, error)
  }
}

exports.fcmByToken = async (title, body, boardList) => {
  let toTarget = boardList;
  if (boardList === 'all') {
    toTarget = [];
    let all = await this.getFCM();
    // let all = await this.getAllFCMToken();
    _.each(all, (rc) => {
      if (_.toString(rc.token_id).length > 0) {
        toTarget.push(rc.token_id);
      }
    });
  }
  // console.log(`toTarget >> `, toTarget);
  let message = {
    notification: {
      title,
      body
    },
    tokens: toTarget
  };
  let response = await admin.messaging().sendMulticast(message);
  // console.log('Successfully sent message:', response);
  // TODO :: maybe mark down the failed count for send notification
  return {
    status: 1,
    result: response
  };
}

exports.fcmToPersonal = async (fcmToken, title, body) => {
  let payload = {
    notification: {
      title,
      body
    }
  };
  console.log('fcmToken >>> ', fcmToken);
  console.log('payload >>> ', payload);
  let response = await admin.messaging().sendToDevice(`${fcmToken}`, payload)
  console.log('response >>> ', response);
  // console.log(response)
  // console.log('Successfully sent message:', response);
  return {status: 1, result: response};
}
