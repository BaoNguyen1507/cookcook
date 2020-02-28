
const SettingService = require('../../../services/SettingService');
/**
 * taxonomy/list-taxonomy.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/setting/fee-collection-setting',
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    if (!this.req.me) {
      throw { redirect: '/backend/login' };
    }
    if (!this.req.me.isSuperAdmin && this.req.me.type != 3) {
      throw { redirect: '/backend/dashboard' };
    }
    let _default = await sails.helpers.getDefaultData(this.req);

    // PREPARE DATA FOR GENERAL
    let web = await SettingService.get({ key: 'web' });
    _default.web = web;

    let currencies = await Currency.find({status: _default.STATUS.ACTIVE});
    _default.currencies = currencies;
    
    return exits.success(_default);
  }
};