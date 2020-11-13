const admin = require('../../model/admin');
const middleware = require('./middleware');
const helper = require('../../lib/helper');

module.exports = exports = {
    initRouter: (router) => {

        /*Auth*/
        router.use('/api/admin_account', middleware.session.authorize());

        /*Admin account */ 
        router.patch('/api/admin_account/pw',patchAdminAccountPassword);
    }
 }

 const patchAdminAccountPassword = async (req, res) => {
    try {
      let patchData = {
        email : '',
        admin_id: '',
        password: ''
      };
      patchData = helper.validateFormData(req.body, patchData);
      let {
        admin_id,
        email,
        password,
      } = patchData;
      let postObj = {
        password
      }
      let result = await admin.updateAccount(admin_id, postObj);
      res.apiResponse({
        status: 1,
        result
      })
    }
    catch (error) {
      res.apiError(error);
    }
  }