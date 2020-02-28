/**
 * MobileSettingsController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const ErrorMessage = require('../../../config/errors');

module.exports = {
  get: async (req, res) => {
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK KEY PARAMS
    if (!params.key) {
      return res.badRequest(ErrorMessage.SETTINGS_KEY_IS_REQUIRED);
    }
    //GET SETTING
    let setting = await SettingService.get({ key: params.key });
    return res.json(setting);
  }
};
