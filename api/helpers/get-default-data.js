const UserService = require('../services/UserService');
var moment = require("moment");
const i18n = require('../../config/i18n');

module.exports = {

  friendlyName: 'Generate default data object',
  description: 'Generate default data object',

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },
  exits: {
    success: {}
  },
  fn: async function (inputs, exits) {
    sails.log.info("=== helper/get-default-data => START ===========");
    // GET CURRENT SESSION OF BRANCH


   
    let _default = await {
      userActive: inputs.req.me,
      moment: moment,
      url: inputs.req.path,
      lang: i18n.i18n.defaultLocale,
      moduleActive: inputs.req.options,
    };
    //set curr language equal with defaultLocale
    inputs.req.setLocale(i18n.i18n.defaultLocale);
    _default = await _.extend(sails.config.custom, _default);

    return exits.success(_default);
  }
};
