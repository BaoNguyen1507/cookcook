module.exports = { 

  registerSA: async function (req, res) {
    sails.log.info("================================ UserController.registerSA => START ================================");
    let params = req.allParams();
    if (!params.emailAddress) return res.badRequest(ErrorMessages.USER_EMAIL_REQUIRED);
    if (!params.phone) return res.badRequest(ErrorMessages.USER_PHONE_REQUIRED);
    if (!params.password) return res.badRequest(ErrorMessages.USER_PASSWORD_REQUIRED);
    if (!params.firstName) return res.badRequest(ErrorMessages.USER_FIRST_NAME_REQUIRED);
    if (!params.lastName) return res.badRequest(ErrorMessages.USER_LAST_NAME_REQUIRED);

    let data = {
      firstName: params.firstName,
      lastName: params.lastName,
      emailAddress: params.emailAddress,
      password: await sails.helpers.passwords.hashPassword(params.password),
      phone: params.phone,
      birthday: params.birthday,
      isSuperAdmin: true
    };
    let admin = await UserService.get({ emailAddress: params.emailAddress });
    if (admin) {
      return res.badRequest(ErrorMessages.USER_IS_EXISTED);
    }
    let newObj = await UserService.add(data);
    return res.ok(newObj);
  },

  addSetting: async (req, res) => {
    const params = req.allParams();
    //GENERAL SETTING
    let rangeTimeMenu = params.rangeTimeMenu ? params.rangeTimeMenu : [];
    let weekend = params.weekend ? params.weekend : [];
    let maximumUploadSize = params.maximumUploadSize ? params.maximumUploadSize : 20;

    // PREPARE DATA FOR WEB SETTINGS
    let webName = params.webName ? params.webName : '';
    let webDescription = params.webDescription ? params.webDescription : '';
    let webVersion = params.webVersion ? params.webVersion : '1.0';
    let webDateFormat = params.webDateFormat ? params.webDateFormat : 'MMM Do YYYY';

    // CHANGE VALUE TO UPDATE WEB SETTINGS
    let webSettings = {
      key: 'web',
      value: {
        name: webName,
        description: webDescription,
        version: webVersion,
        dateFormat: webDateFormat,
        rangeTimeMenu: rangeTimeMenu,
        weekend: weekend,
        maximumUploadSize: maximumUploadSize,
        extraModules: {
          tuition: false,
          pickup: false
        }
      }
    };
    let webSettingsObj = await SettingService.get({ key: 'web' });
    if (webSettingsObj) {
      await SettingService.edit({id:webSettingsObj.id}, webSettings);
    } else {
      await SettingService.add(webSettings);
    }
    // END PREPARE DATA FOR WEB SETTINGS

    // PREPARE DATA FOR APP SETTINGS
    let appName = params.appName ? params.appName : '';
    let appDescription = params.appDescription ? params.appDescription : '';
    let appVersion = params.appVersion ? params.appVersion : '1.0.0';
    let appReinstall = params.appReinstall && params.appReinstall == 1 ? true : false;
    let appMailTechnical = params.appMailTechnical ? params.appMailTechnical : '';
    let appMailSales = params.appMailSales ? params.appMailSales : '';
    let appPhoneTechnical = params.appPhoneTechnical ? params.appPhoneTechnical : '';
    let appPhoneSales = params.appPhoneTechnical ? params.appPhoneSales : '';
    let appHotline = params.appHotline ? params.appHotline : '';
    let appMaxAlbum = params.appMaxAlbum ? params.appMaxAlbum : 6;
    // let appMaxNotification = params.appMaxNotification ? params.appMaxNotification : '';
    let appNotificationNews = params.appNotificationNews && params.appNotificationNews == 1 ? true : false;
    // let appNotificationTuition = params.appNotificationTuition && params.appNotificationTuition == 1 ? true : false;
    let appNotificationAlbum = params.appNotificationAlbum && params.appNotificationAlbum == 1 ? true : false;
    let appNotificationMenu = params.appNotificationMenu && params.appNotificationMenu == 1 ? true : false;
    let appNotificationSchedule = params.appNotificationSchedule && params.appNotificationSchedule == 1 ? true : false;
    
    // CHANGE VALUE TO UPDATE WEB SETTINGS
    let appSettings = {
      key: 'app',
      value: {
        name: appName,
        description: appDescription,
        version: appVersion,
        reinstall: appReinstall,
        mailTechnical: appMailTechnical,
        mailSales: appMailSales,
        phoneTechnical: appPhoneTechnical,
        phoneSales: appPhoneSales,
        hotline: appHotline,
        maxAlbum: appMaxAlbum,
        notificationAlbum: appNotificationAlbum,
        notificationMenu: appNotificationMenu,
        appNotificationNews: appNotificationNews,
        notificationSchedule: appNotificationSchedule,
        rangeTimeMenu: rangeTimeMenu,
        maximumUploadSize: maximumUploadSize,
        extraModules: {
          tuition: false,
          pickup: false
        }
      }
    };
    let appSettingsObj = await SettingService.get({ key: 'app' });
    if (appSettingsObj) {
      await SettingService.edit({id:appSettingsObj.id}, appSettings);
    } else {
      await SettingService.add(appSettings);
    }
    // END PREPARE DATA FOR WEB SETTINGS

    return res.ok();
  },
};