
/**
 * gallery/detail.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
let moment = require('moment');
module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'frontend/pages/gallery/detail',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      sails.log.info("================================ controllers/frontend/gallery/detail ================================");
      
    let _default = await sails.helpers.getDefaultData(this.req);
    let params = this.req.allParams();	
        let albumID = params.id ? params.id : null;
        
        let albumObj = await AlbumService.get({ id: albumID })
        if (albumObj.photos.length > 0) {
            let arrayPhotos = [];
            for (let photo of albumObj.photos){
                let photoObj = await MediaService.get({ id: photo });
                if (photoObj) {
                    arrayPhotos.push(photoObj)
                }
            }
            albumObj.photos = arrayPhotos;
        }    
        sails.log(albumObj.photos);
        _default.albumObj = albumObj;
        _default.moment = moment;  
      return exits.success(_default);
    }
  };