const i18n = require('../../../../config/i18n');
module.exports = {
  friendlyName: 'View parent login',
  description: 'Display "Parent Login" page.',
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/entrance/parent',
    },
    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    this.req.setLocale(i18n.i18n.defaultLocale);
    let _default = await sails.helpers.getDefaultData(this.req);

    return exits.success({
      lang: i18n.i18n.defaultLocale,_default
    });
  }
};
