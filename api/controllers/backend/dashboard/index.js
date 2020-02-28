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
    let totalAlbums = await Album.count({});
    //User
    let totalUsers = await User.count({ status: sails.config.custom.STATUS.ACTIVE });
    let totalParents = await Parent.count({});
    //Menu & Classes
    let arrClass = await ClassService.find({});
    // Notifications
    let notifications = await Notifications.find({ status: sails.config.custom.STATUS.ACTIVE, type: {in: [sails.config.custom.TYPE.NEWS_PUBLIC, sails.config.custom.TYPE.NEWS_PRIVATE]} }).limit(10).sort([{ createdAt: 'DESC' }]);
    // Post
    let posts = await PostService.find({ status: sails.config.custom.STATUS.ACTIVE }, null, null, [{ createdAt: 'DESC' }]);
    // Birthday by Month
    let curMonth = moment().format('MM');
    // webSettings
    let webSettings = this.res.locals.webSettings;
    sails.log(webSettings);
    // FILTER STUDENTS HAVE BIRTHDAY INTO CURRENT MONTH
    let listClassStudent = [...arrClass];
    if (listClassStudent.length > 0) {
      for (let i = 0; i < listClassStudent.length; i++) {
        if (listClassStudent[i].students) {
          let studentArr = [];
          for (let y = 0; y < listClassStudent[i].students.length; y++) {
            let month = moment(listClassStudent[i].students[y].dateOfBirth).format('MM');
            if (month == curMonth) {
              studentArr.push(listClassStudent[i].students[y]);
            }
          }
          listClassStudent[i].students = studentArr;
        }
      }
    }
    // END FILTER STUDENTS HAVE BIRTHDAY INTO CURRENT MONTH 

    // Album
    let listAlbum = await Album.find({
      where: {status : 1 },
      limit: 10,
      sort: [{ createdAt: 'DESC' }],
    });
    for (let i = 0; i < listAlbum.length; i++) {
      let numberOfPhoto = 0;
      let firstPhoto = '';
      if (listAlbum[i].photos && listAlbum[i].photos.length > 0) {
        numberOfPhoto = listAlbum[i].photos.length;
        let photo = await Media.findOne({ id: listAlbum[i].photos[0] });
        if (photo) firstPhoto = photo.thumbnail.sizes.thumbnail.path;
      }
      listAlbum[i].numberOfPhoto = numberOfPhoto;
      listAlbum[i].firstPhoto = firstPhoto;
    }

    // let foodList = await Food.find({});
    // let menuByDay = await Menu.find({ dateUse: curDate });
    // let arrMenuList = [];
    // if (menuByDay.length > 0) {
    //   for (let n = 0; n < menuByDay.length; n++) {
    //     let objMenu = {
    //       classId: menuByDay[n].classes,
    //       rangeTime: [
    //         {
    //           start: 6,
    //           end: 10,
    //           name: "Bữa sáng",
    //           timeTitle: "06:00",
    //           list: []
    //         },
    //         {
    //           start: 10,
    //           end: 14,
    //           name: "Bữa trưa",
    //           timeTitle: "10:00",
    //           list: []
    //         },
    //         {
    //           start: 14,
    //           end: 16,
    //           name: "Bữa xế",
    //           timeTitle: "14:00",
    //           list: []
    //         },
    //         {
    //           start: 16,
    //           end: 18,
    //           name: "Bữa chiều",
    //           timeTitle: "16:00",
    //           list: []
    //         },
    //       ]
    //     }
    //     let menuList = menuByDay[n];
    //     let slotFeedLength = menuList.slotFeedings.length;
    //     for (let k = 0; k < slotFeedLength; k++) {
    //       let row = menuList.slotFeedings[k]; //row is array id food
    //       let rowNew = { //row new is repare obj food by id
    //         time: menuList.slotFeedings[k].time,
    //         food: []
    //       }
    //       for (let j = 0; j < menuList.slotFeedings[k].foods.length; j++) {
    //         // rowNew.food.push(foodList[menuList.slotFeedings[k].food[j]]) //push obj by id to array rowNew.food
    //         rowNew.food.push(foodList.find((food) => {
    //           return (menuList.slotFeedings[k].foods.indexOf(food.id) != -1);
    //         }))
    //       }
    //       let time = parseInt(row.time.split(":")[0]);
    //       let findRangeIndex = objMenu.rangeTime.findIndex(
    //         r => r.start <= time && r.end > time
    //       );
    //       objMenu.rangeTime[findRangeIndex].list.push(rowNew);
    //     }
    //     arrMenuList.push(objMenu);
    //   }
    // }


    sails.log('===========rangeTime========');

    //Set to _default
    _default.totalPosts = totalPosts;
    _default.totalPostsThisWeek = 4;
    _default.totalPostsThisMonth = totalPostsThisMonth;
    _default.listPosts = listPosts;
    _default.listTrendings = listPosts;

    _default.totalUsers = totalUsers;
    _default.totalParents = totalParents;

    // _default.arrMenuList = arrMenuList;
    _default.arrClass = arrClass;

    _default.totalAlbums = totalAlbums;

    _default.notifications = notifications;

    _default.posts = posts;

    _default.listStudent = listClassStudent;

    _default.listAlbum = listAlbum;

    _default.webSettings = webSettings;

    //http://oskarhane.com/create-a-nested-array-recursively-in-javascript/
    return exits.success(_default);

  }
};
