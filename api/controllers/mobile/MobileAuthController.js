/**
 * @copyright 2018 @ ZiniMedia Ltd. Co
 * @author thanhvo
 * @create 2017/10/21 20:18
 * @update 2017/10/21 20:18
 * @file api/controllers/AuthController.js
 */
'use strict';

const ErrorMessage = require('../../../config/errors');
const AuthService = require("../../services/AuthService");

const CryptoJS = require("crypto");

const MobileAuthController = {


    getToken: async function (req, res) {
        sails.log.info("====================== AuthController.getToken ==========================");
        let data = {};
        let params = req.allParams();
        let AppInfo = 'EKIDPRO';
        let secret = params.secret;
        let codeVerify = params.codeVerify;

        let myCodeVerify = '';
        try {
            myCodeVerify = CryptoJS.createHash('sha256').update(AppInfo + secret).digest('hex');
        } catch (err) {
            sails.log('check error', err);
        }


        if (!secret) return res.badRequest(ErrorMessage.AUTH_ERR_SECRET_NOT_VALID);
        if (!codeVerify) return res.badRequest(ErrorMessage.AUTH_ERR_CODE_VERIFY_NOT_VALID);

        if (myCodeVerify === codeVerify) {
            data = {
                token: myCodeVerify
            }
            let newObj = await AuthService.add(data);
            return res.ok(myCodeVerify);
        } else {
            return res.badRequest(ErrorMessage.AUTH_ERR_CODE_VERIFY_NOT_VALID);
        }
    },
    sampleToken: async function (req, res) {
        sails.log.info("====================== AuthController.sampleToken ==========================");
        let params = req.allParams();
        let data = {};
        let AppInfo = 'EKIDPRO';
        let secreted = 'bao';

        let codeVerify = CryptoJS.createHash('sha256').update(AppInfo + secreted).digest('hex');

        if (!codeVerify) return res.badRequest(ErrorMessage.AUTH_ERR_SYSTEM_TOKEN_REQUIRE);
        return res.ok(codeVerify);
    },


    updateToken: async function (req, res) {
        sails.log.info("================================ AuthController.updateToken ================================");

        let params = req.allParams();

        if (!params.token) return res.badRequest(ErrorMessage.AUTH_ERR_SYSTEM_TOKEN_REQUIRE);

        //ALWAYS CHECK  OBJECT EXIST BEFORE UPDATE
        let authObj = AuthService.get({ id: params.token });
        if (!authObj) return res.notFound(ErrorMessage.AUTH_ERR_NOT_FOUND);
        //UPDATE DATA
        let time = new Date().getTime();
        let data = {
            expireAt: time + 5 * 60
        }
        let editObj = await AuthService.edit({ id: params.token }, data);
        return res.ok(editObj);

    },

    // login: async (req, res) => {
    //     // GET ALL PARAMS
    //     const params = req.allParams();
    //     sails.log(params);
    //     // Look up by the email address.
    //     // (note that we lowercase it to ensure the lookup is always case-insensitive,
    //     // regardless of which database we're using)
    //     var userRecord = await User.findOne({
    //       emailAddress: params.emailAddress.toLowerCase(),
    //     });
    
    //     // If there was no matching user, respond thru the "badCombo" exit.
    //     if(!userRecord) {
    //       throw 'badCombo';
    //     }
    
    //     // If the password doesn't match, then also exit thru "badCombo".
    //     await sails.helpers.passwords.checkPassword(params.password, userRecord.password)
    //     .intercept('incorrect', 'badCombo');
    
    //     //add token Firebase into user if token is not exist
    //     if (params.fcmToken) {
    //       if (params.platform == 'iOS') {
    //         if (!userRecord.fcmTokeniOS.includes(fcmToken)) {
    //           let fcmTokeniOS = userRecord.fcmTokeniOS.push(params.fcmToken);
    //           await User.update({ id: userRecord.id }, { fcmTokeniOS: fcmTokeniOS });
    //         }
    //       }
    //       if (params.platform == 'android') {
    //         if (!userRecord.fcmTokenAndroid.includes(fcmToken)) {
    //           let fcmTokenAndroid = userRecord.fcmTokenAndroid.push(params.fcmToken);
    //           await User.update({ id: userRecord.id }, { fcmTokenAndroid: fcmTokenAndroid });
    //         }
    //       }
    //     }
    
    //     // Send success response (this is where the session actually gets persisted)
    //     return res.success();
    
    // },

    // logout: async (req, res) => {
    //     // GET ALL PARAMS
    //     const params = req.allParams();
    
    //     // Clear tokenFirebase attribute from user logout
    //     if (params.fcmToken && params.flatform) {
    //       let user = await User.find({ id: this.req.session.userId });
    
    //       let fcmToken = [];
    //       if (params.platform == 'iOS') fcmToken = [...user.fcmTokeniOS];
    //       if (params.platform == 'android') fcmToken = [...user.fcmTokenAndroid];
    
    //       for( let i = 0; i < fcmToken; i++){ 
    //         if ( fcmToken[i] == params.fcmToken) {
    //           fcmToken.splice(i, 1);
    //         }
    //       }
    
    //       if (params.platform == 'iOS') await User.update({ id: user.id }, { fcmTokeniOS: fcmToken });
    //       if (params.platform == 'Android') await User.update({ id: user.id }, { fcmTokenAndroid: fcmToken });
    //     }
    
    //     return res.success();
    
    // }
};

module.exports = MobileAuthController;