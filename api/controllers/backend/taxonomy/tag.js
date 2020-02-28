
/**
 * taxonomy/view-taxonomy.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

const TaxonomyService = require('../../../services/TaxonomyService');
module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/tag/index',
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    if (!this.req.me) {
      throw { redirect: '/backend/login' };
    }

    let _default = await sails.helpers.getDefaultData(this.req);
    let params = this.req.allParams();
    let status = (params.status) ? (params.status) : 1;

    sails.log.info("================================ controllers/backend/list => TYPE ================================");
    _default.status = status;
    let listTaxonomy = await TaxonomyService.find({ type: sails.config.custom.TYPE.TAG });
    _default.listTaxonomy = listTaxonomy;
    
    return exits.success(_default);
  }

};