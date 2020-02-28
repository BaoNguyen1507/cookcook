
const UserService = require('../../../services/UserService');

/**
 * taxonomy/list-taxonomy.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
const moment = require('moment');
module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/user/form',
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    sails.log.info("================================ controllers/backend/user/form => ================================");
    if (!this.req.me) {
      throw { redirect: '/backend/login' };
    }
    let params = this.req.allParams();
    let userId = params.id;
    let _default = await sails.helpers.getDefaultData(this.req);
    _default.manner = (this.req.param('id') == undefined ? 'add' : 'edit');
    let currentDay = moment().format('YYYY-MM-DD');
    let userObj = {};
    if(_default.manner == 'edit') {
      userObj = await UserService.get(userId);
    }
    let Lclass = await Class.find({});
    let status = (params.status) ? (params.status) : -1;
    let type = _default.TYPE.USER; 
    _default.Lclass = Lclass;
    _default.type = type;
    _default.status = status;
    _default.userObj = userObj;
    _default.currentDay = currentDay;
    return exits.success(_default);
  }
};