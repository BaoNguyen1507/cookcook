
/**
 * gallery/index.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

module.exports = {
  inputs: {},
  exits: {
    success: {
      viewTemplatePath: 'frontend/pages/gallery/index',
    },
    redirect: {
      responseType: 'redirect'
    }
  },

  fn: async function (inputs, exits) {
    sails.log.info("================================ controllers/frontend/gallery ================================");
    
    let _default = await sails.helpers.getDefaultData(this.req);
    let listAlbum = await AlbumService.find({ status: _default.STATUS.ACTIVE, isWeb: true })
    if (listAlbum.length > 0) {
      for (let i = 0; i < listAlbum.length; i++ ){
        let mediaObj = await MediaService.get(listAlbum[i].photos[0]);
        let classObj = await ClassService.get({ id: listAlbum[i].classObj });
        if (mediaObj) {
          listAlbum[i].photos[0] = mediaObj;
        }
        if (classObj) {
          listAlbum[i].classObj = classObj;
        }
      }
    }
    
    _default.listAlbum = listAlbum;
    return exits.success(_default);
  }
};