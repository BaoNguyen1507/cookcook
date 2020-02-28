const i18n = require('../../../config/i18n');
module.exports = {
  friendlyName: 'View add setting',
  description: 'Display "SA Setting" page.',
  exits: {
    success: {
      viewTemplatePath: 'installation/setting',
    },
    redirect: {
      description: '',
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    this.req.setLocale(i18n.i18n.defaultLocale);
    let superAdmin = await User.find({ isSuperAdmin: true });
    let setting = await Setting.find();
    if (superAdmin.length > 0) {
      if (setting.length == 2) {
        throw { redirect: '/backend/login' };
      } else {
        return exits.success({
          lang: i18n.i18n.defaultLocale,
          action: 'installation/setting'
        });
      }
    } else {
      throw { redirect: '/installation/account' };
    }
  
  }
};