let moment = require('moment');

module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/dashboard/index',
      description: 'Display the dashboard for authenticated users.'
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    if (!this.req.me) {
      sails.log('Not have this.req.me');
      throw { redirect: '/backend/login' };
    }
    sails.log('Have this.req.me');
    let _default = await sails.helpers.getDefaultData(this.req);
    let posts = await PostService.find();
    for (let postObj of posts){
      let medias = await Media.find({ post: postObj.id });
      postObj.media = medias;
    }
    
    let webSettings = this.res.locals.webSettings;


    _default.posts = posts;

    _default.webSettings = webSettings;

    //http://oskarhane.com/create-a-nested-array-recursively-in-javascript/
    return exits.success(_default);

  }
};
