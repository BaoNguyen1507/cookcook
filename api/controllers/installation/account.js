const i18n = require('../../../config/i18n');
module.exports = {
  friendlyName: 'View register account super admin',
  description: 'Display "SA Account" page.',
  exits: {
    success: {
      viewTemplatePath: 'installation/account',
    },
    redirect: {
      description: '',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    this.req.setLocale(i18n.i18n.defaultLocale);
    let superAdmin = await User.find({ isSuperAdmin: true });
    let setting = await Setting.find({});
    if (superAdmin.length > 0) {
      if (setting.length == 0) {
        throw { redirect: '/installation/setting' };
      } else {
        throw { redirect: '/backend/login' };
      }
    }
  
    return exits.success({
      lang: i18n.i18n.defaultLocale,
      action: 'installation/account'
    });
  }
};