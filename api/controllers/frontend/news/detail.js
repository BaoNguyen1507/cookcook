
/**
 * news/detail.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
let moment = require('moment');
module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/post/detail',
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    sails.log.info("================================ controllers/frontend/detail ================================");
    
    let _default = await sails.helpers.getDefaultData(this.req);

   
    let params = this.req.allParams();	
    let postId = params.id ? params.id : null;
    let postObj = await PostService.get({id: postId});  
    let listTaxonomies = await TaxonomyService.find({ status: _default.STATUS.ACTIVE, type: 'category' });
    let taxActive = await Post_Category.findOne({ postsOfCat: postId });
    
    //PREPARE DATA LASTEST POSTS
    let listLastestPost = await PostService.find({ status: _default.STATUS.ACTIVE, id: { '!=': postId } }, 10);
   
    _default.postObj = postObj;
    _default.taxActive = taxActive;
    _default.listTaxonomies = listTaxonomies;
    _default.listLastestPost = listLastestPost;
    _default.moment = moment;
    return exits.success(_default);
  }
};