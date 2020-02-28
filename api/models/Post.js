/**
 * Video.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs        :: http://sailsjs.org/documentation/concepts/models-and-orm/models
 */

module.exports = {

  attributes: {
    title: {
      type: 'string',
      required: true
    },
    alias: {
      type: 'string',
      defaultsTo: ''
    },
    motto: {
      type: 'string',
      required: true
    },
    description: {
      type: 'string',
      required: true
    },
    metaKeyword: {
      type: 'string'
    },
    metaTitle: {
      type: 'string'
    },
    metaDescription: {
      type: 'string'
    },
    media: {
      model: 'media'
    },
    status: {                           //Integer {"TRASH":,"DRAFT":,"ACTIVE":, SCHEDULE:}
      type: 'number',
      isIn: [sails.config.custom.STATUS.TRASH, sails.config.custom.STATUS.DRAFT, sails.config.custom.STATUS.ACTIVE],
      defaultsTo: sails.config.custom.STATUS.DRAFT
    },
    categories: {
      collection: 'taxonomy',
      via: 'postsOfCat',
      through: 'post_category'
    },
    tags: {
      collection: 'taxonomy',
      via: 'postsOfTag',
      through: 'post_tag'
    },
    author: {
      model: 'user' //For AUTHOR INFO
    }
  }
};
