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
    let curDate = moment().format('YYYY-MM-DD');
    //Post
    let totalPosts = await Post.count({});
    let listPosts = await PostService.find({});
    let totalPostsThisMonth = 0;
    for (var i = 0; i < listPosts.length; i++) {
      let month = moment().format('MM');
      if (moment(listPosts[i].updatedAt).format('MM') === month) {
        totalPostsThisMonth = totalPostsThisMonth + 1;
      }
    }
    //Album
    //User
    let totalUsers = await User.count({ status: sails.config.custom.STATUS.ACTIVE });
    //Menu & Classes
    // Notifications
    let notifications = await Notifications.find({ status: sails.config.custom.STATUS.ACTIVE, type: {in: [sails.config.custom.TYPE.NEWS_PUBLIC, sails.config.custom.TYPE.NEWS_PRIVATE]} }).limit(10).sort([{ createdAt: 'DESC' }]);
    // Post
    let posts = await PostService.find({ status: sails.config.custom.STATUS.ACTIVE }, null, null, [{ createdAt: 'DESC' }]);
    // Birthday by Month
    let curMonth = moment().format('MM');
    // webSettings
    let webSettings = this.res.locals.webSettings;
    sails.log(webSettings);
    
    sails.log('===========rangeTime========');

    //Set to _default
    _default.totalPosts = totalPosts;
    _default.totalPostsThisWeek = 4;
    _default.totalPostsThisMonth = totalPostsThisMonth;
    _default.listPosts = listPosts;
    _default.listTrendings = listPosts;

    _default.totalUsers = totalUsers;

    _default.notifications = notifications;

    _default.posts = posts;

    _default.webSettings = webSettings;

    //http://oskarhane.com/create-a-nested-array-recursively-in-javascript/
    return exits.success(_default);

  }
};
