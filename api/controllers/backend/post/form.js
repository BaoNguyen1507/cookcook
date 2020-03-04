

/**
 * New/view-New-add.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

const moment = require('moment');
const PostService = require('../../../services/PostService');
const TaxonomyService = require('../../../services/TaxonomyService');
module.exports = {
  friendlyName: 'View Edit Post',
  description: 'Display "Edit Post" page.',
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/post/form',
    },
    error: {
      description: 'Error.',
      responseType: 'badRequest'
    }
  },

  fn: async function (inputs, exits) {
    let posts = {};
    let _default = await sails.helpers.getDefaultData(this.req);
    let params = this.req.allParams();
    let postActive = await PostService.get({ id: params.postId });
    if (!postActive) return ('Bab Request');
    let medias = await MediaService.find({ post: postActive.id });
    postActive.media = medias;
    _default.postsData = postActive;
    return exits.success(_default);
  }
};