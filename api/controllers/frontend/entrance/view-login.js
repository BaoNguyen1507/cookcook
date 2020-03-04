const i18n = require('../../../../config/i18n');
module.exports = {
  friendlyName: 'View login',
  description: 'Display "Login" page.',
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/entrance/login',
    },
    redirect: {
      description: 'The requesting user is already logged in.',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    this.req.setLocale(i18n.i18n.defaultLocale);
    let superAdmin = await User.find({ isSuperAdmin: true });
    if (superAdmin.length == 0) {
      throw { redirect: '/installation/account' };
    }
    if (this.req.me) {
      throw { redirect: '/login' };
    }
  
    return exits.success({
      lang: i18n.i18n.defaultLocale
    });
  }
};
