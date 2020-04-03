let moment = require('moment');

module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/contact/index',
      description: 'Display the contact page.'
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    let _default = await sails.helpers.getDefaultData(this.req);
    let webSettings = this.res.locals.webSettings;

    _default.webSettings = webSettings;
    _default.moment = moment;

    return exits.success(_default);

  }
};
