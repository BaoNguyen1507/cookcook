
const SettingService = require('../../../services/SettingService');
//const TaxonomyService = require('../../../services/TaxonomyService');
/**
 * taxonomy/list-taxonomy.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/setting/index',
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
    sails.log.info("================================ controllers/backend/list => TYPE ================================");

    // PREPARE DATA FOR GENERAL
    let web = await SettingService.get({ key: 'web' });
    let app = await SettingService.get({ key: 'app' }); 
    
    _default.web = web;
    _default.app = app; 
    
    return exits.success(_default);
  }
};