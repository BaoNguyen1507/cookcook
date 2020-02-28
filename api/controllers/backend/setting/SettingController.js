/**
 * SettingController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

module.exports = { 

  edit: async (req, res) => {
    const params = req.allParams();
    //DATA GENERAL SETTING
    let rangeTimeMenu = params.rangeTimeMenu ? params.rangeTimeMenu : [];
    let weekend = params.weekend ? params.weekend : [];
    let maximumUploadSize = params.maximumUploadSize ? parseFloat(params.maximumUploadSize) : 1;
    let allowShuttlePersonInfo = params.allowShuttlePersonInfo == 1 ? true : false;

    // PREPARE DATA FOR WEB SETTINGS
    let webName = params.webName ? params.webName : '';
    let webDescription = params.webDescription ? params.webDescription : '';
    let webVersion = params.webVersion ? params.webVersion : '1.0';
    let webDateFormat = params.webDateFormat ? params.webDateFormat : 'F j, Y';
    // CHANGE VALUE TO UPDATE WEB SETTINGS
    let webSettings = await SettingService.get({ key: 'web' });
    webSettings.value.name = webName;
    webSettings.value.description = webDescription;
    webSettings.value.version = webVersion;
    webSettings.value.dateFormat = webDateFormat;
    webSettings.value.rangeTimeMenu = rangeTimeMenu;
    webSettings.value.weekend = weekend;
    webSettings.value.maximumUploadSize = maximumUploadSize;
    webSettings.value.allowShuttlePersonInfo = allowShuttlePersonInfo;
    await SettingService.edit({ id: webSettings.id }, { value: webSettings.value });
    // END PREPARE DATA FOR WEB SETTINGS

    // PREPARE DATA FOR APP SETTINGS
    let appName = params.appName ? params.appName : '';
    let appDescription = params.appDescription ? params.appDescription : '';
    let appVersion = params.appVersion ? params.appVersion : '';
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
    let appSettings = await SettingService.get({ key: 'app' });
    appSettings.value.name = appName;
    appSettings.value.description = appDescription;
    appSettings.value.version = appVersion;
    appSettings.value.reinstall = appReinstall;
    appSettings.value.mailTechnical = appMailTechnical;
    appSettings.value.mailSales = appMailSales;
    appSettings.value.phoneTechnical = appPhoneTechnical;
    appSettings.value.phoneSales = appPhoneSales;
    appSettings.value.hotline = appHotline;
    appSettings.value.maxAlbum = appMaxAlbum;
    // appSettings.value.maxNotification = appMaxNotification;
    appSettings.value.notificationMenu = appNotificationNews;
    // appSettings.value.notificationTuition = appNotificationTuition;
    appSettings.value.notificationAlbum = appNotificationAlbum;
    appSettings.value.notificationMenu = appNotificationMenu; 
    appSettings.value.notificationSchedule = appNotificationSchedule;
    appSettings.value.rangeTimeMenu = rangeTimeMenu;
    appSettings.value.maximumUploadSize = maximumUploadSize;
    appSettings.value.allowShuttlePersonInfo = allowShuttlePersonInfo;
    await SettingService.edit({ id: appSettings.id }, { value: appSettings.value });
    // END PREPARE DATA FOR WEB SETTINGS

    return res.ok();
  },

  editFeeCollectionSetting: async (req, res) => {
    const params = req.allParams();
    //DATA GENERAL SETTING
    let currency = params.currency ? params.currency : null;
    let allowTransfer = params.allowTransfer == 1 ? true : false;
    let transferInfo = params.transferInfo ? params.transferInfo : [];
    let transferNote = params.transferNote ? params.transferNote : '';

    // CHANGE VALUE TO UPDATE WEB SETTINGS
    let webSettings = await SettingService.get({ key: 'web' });
    webSettings.value.currency = currency;
    webSettings.value.allowTransfer = allowTransfer;
    webSettings.value.transferInfo = transferInfo;
    webSettings.value.transferNote = transferNote;
    await SettingService.edit({ id: webSettings.id }, { value: webSettings.value });
    // END PREPARE DATA FOR WEB SETTINGS
    
    // CHANGE VALUE TO UPDATE WEB SETTINGS
    let appSettings = await SettingService.get({ key: 'app' });
    appSettings.value.currency = currency;
    appSettings.value.allowTransfer = allowTransfer;
    appSettings.value.transferInfo = transferInfo;
    appSettings.value.transferNote = transferNote;
    await SettingService.edit({ id: appSettings.id }, { value: appSettings.value });
    // END PREPARE DATA FOR WEB SETTINGS

    return res.ok();
  },
};

