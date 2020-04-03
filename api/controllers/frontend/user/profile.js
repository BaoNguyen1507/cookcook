
/**
 * teacher/index.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

module.exports = {
    inputs: {},
    exits: {
      success: {
        viewTemplatePath: 'frontend/pages/user/profile',
      },
      redirect: {
        responseType: 'redirect'
      }
    },
  
    fn: async function (inputs, exits) {
      sails.log.info("================================ controllers/frontend/teacher ================================");
      
      let _default = await sails.helpers.getDefaultData(this.req);
   
      
      return exits.success(_default);
    }
  };