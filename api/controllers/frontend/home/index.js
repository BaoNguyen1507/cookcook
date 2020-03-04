let moment = require('moment');

module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/home/index',
      description: 'Display the dashboard for authenticated users.'
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    // if (!this.req.me) {
    //   sails.log('Not have this.req.me');
    //   throw { redirect: '/frontend/login' };
    // }
    sails.log('Have this.req.me');
    let _default = await sails.helpers.getDefaultData(this.req);
   
    // webSettings
    let webSettings = this.res.locals.webSettings;
    
    // let teachers = await UserService.find({ status: sails.config.custom.STATUS.ACTIVE, userType: { in: [sails.config.custom.TYPE.TEACHER ] }});
    let news = await PostService.find({ status: sails.config.custom.STATUS.ACTIVE });


    _default.webSettings = webSettings;
    // _default.teachers = teachers;
    _default.news = news;
    _default.moment = moment;

    //http://oskarhane.com/create-a-nested-array-recursively-in-javascript/
    return exits.success(_default);

  }
};
