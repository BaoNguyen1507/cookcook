
/**
 * news/index.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
let moment = require('moment');
module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/post/index',
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    sails.log.info("================================ controllers/frontend/news ================================");
    
    let _default = await sails.helpers.getDefaultData(this.req);

    let params = this.req.allParams();	
    let page = params.page ? parseInt(params.page) : 1;
    let catID = params.category ? params.category : null;
    let limit = _default.PAGING.LIMIT;
    let skip = (page - 1) * limit;
    let where = {};
    let listTaxonomies = await TaxonomyService.find({ status: _default.STATUS.ACTIVE, type: 'category' });
    if (catID != null) {
      where = {
        category : catID
      }
    }
    
    let listNews = await PostCategoryService.find(where, limit, skip);
    if (listNews.length > 0) {
      for (let i = 0; i < listNews.length; i++){
        if (listNews[i].postsOfCat) {
          let userObj = await UserService.get({ id: listNews[i].postsOfCat.author });
          listNews[i].postsOfCat.author = userObj;
          let mediaObj = await MediaService.get({ id: listNews[i].postsOfCat.media });
          listNews[i].postsOfCat.media = mediaObj;
        }
      }
    }
    
    _default.listTaxonomies = listTaxonomies;
    _default.listNews = listNews;
    _default.moment = moment;
    return exits.success(_default);
  }
};