
/**
 * currency/view-currency.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/currency/index',
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    sails.log.info("================================ controllers/backend/currency ================================");
    if (!this.req.me) {
      throw { redirect: '/backend/login' };
    }
    
    let _default = await sails.helpers.getDefaultData(this.req);
    let params = this.req.allParams();
    let status = (params.status) ? (params.status) : 1;

    _default.status = status;
 
    return exits.success(_default);
  }
};