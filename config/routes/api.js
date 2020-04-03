module.exports.api = {
    /* API WEB  */
    'PUT   /api/v1/backend/account/update-password': { action: 'backend/account/update-password' },
    'PUT   /api/v1/backend/account/logout': { action: 'backend/account/logout' },
    'PUT   /api/v1/backend/account/update-profile': { action: 'backend/account/update-profile' },
    'PUT   /api/v1/backend/entrance/login': { action: 'backend/entrance/login' },
    'POST   /api/v1/frontend/user/login': { action: 'frontend/user/login' },
    'POST  /api/v1/backend/entrance/signup': { action: 'backend/entrance/signup' },
    'POST  /api/v1/backend/entrance/send-password-recovery-email': { action: 'backend/entrance/send-password-recovery-email' },

    //Media
    'POST  /api/v1/backend/media/add': { controller: 'backend/media/MediaController', action: 'add' },
    'GET   /api/v1/backend/media/get/:id': { controller: 'backend/media/MediaController', action: 'get' },
    'POST /api/v1/backend/media/uploadThumbnail': { controller: 'backend/media/MediaController', action: 'uploadThumbnail' },
    'PATCH /api/v1/backend/media/edit/:id': { controller: 'backend/media/MediaController', action: 'edit' },
    'PATCH /api/v1/backend/media/trash/:ids': { controller: 'backend/media/MediaController', action: 'trash' },
    'PATCH /api/v1/backend/media/delete/:id': { controller: 'backend/media/MediaController', action: 'delete' },
    'GET   /api/v1/backend/media/search': { controller: 'backend/media/MediaController', action: 'search' },
    'GET   /api/v1/backend/media/list': { controller: 'backend/media/MediaController', action: 'list' },
    'GET   /api/v1/backend/media/list/ids': { controller: 'backend/media/MediaController', action: 'listByIds' },

    //INSTALLATION
    'PATCH /api/v1/installation/registerSA': { controller: 'installation/InstallationController', action: 'registerSA' },
    'POST  /api/v1/installation/addSetting': { controller: 'installation/InstallationController', action: 'addSetting' },

    //Setting
    'POST  /api/v1/backend/setting/edit': { controller: 'backend/setting/SettingController', action: 'edit' },
    'POST  /api/v1/backend/setting/editFeeCollectionSetting': { controller: 'backend/setting/SettingController', action: 'editFeeCollectionSetting' },

    //USER API
    'PATCH /api/v1/backend/user/init': { controller: 'backend/user/UserController', action: 'init' },
    'PATCH /api/v1/backend/user/login': { controller: 'backend/user/UserController', action: 'login' },
    'POST /api/v1/backend/user/add': { controller: 'backend/user/UserController', action: 'add' },
    'POST /api/v1/backend/user/uploadThumbnail': { controller: 'backend/user/UserController', action: 'uploadThumbnail' },
    'GET /api/v1/backend/user/get/:id': { controller: 'backend/user/UserController', action: 'get' },
    'PATCH /api/v1/backend/user/edit/:id': { controller: 'backend/user/UserController', action: 'edit' },
    'PATCH /api/v1/backend/user/trash/:ids': { controller: 'backend/user/UserController', action: 'trash' },
    'PATCH /api/v1/backend/user/delete/:title': { controller: 'backend/user/UserController', action: 'delete' },
    'GET /api/v1/backend/user/list/search': { controller: 'backend/user/UserController', action: 'search' },
    'PATCH /api/v1/backend/user/switchStatus/:id': { controller: 'backend/user/UserController', action: 'switchStatus' },

    //POST API
    'GET /api/v1/backend/post/get/:id': { controller: 'backend/post/PostController', action: 'get' },
    'POST /api/v1/backend/post/add': { controller: 'backend/post/PostController', action: 'add' },
    'PATCH /api/v1/backend/post/edit/:id': { controller: 'backend/post/PostController', action: 'edit' },
    'GET /api/v1/backend/post/search': { controller: 'backend/post/PostController', action: 'search' },
    'POST /api/v1/backend/post/uploadThumbnail': { controller: 'backend/post/PostController', action: 'uploadThumbnail' },
    'POST /api/v1/backend/post/trash/:ids': { controller: 'backend/post/PostController', action: 'trash' },
    'PATCH /api/v1/backend/post/switchStatus/:id': { controller: 'backend/post/PostController', action: 'switchStatus' },

    //NOTIFICATION API
    'GET /api/v1/backend/notification/get/:id': { controller: 'backend/notification/NotificationController', action: 'get' },
    'POST /api/v1/backend/notification/add': { controller: 'backend/notification/NotificationController', action: 'add' },
    'PATCH /api/v1/backend/notification/edit/:id': { controller: 'backend/notification/NotificationController', action: 'edit' },
    'GET /api/v1/backend/notification/search': { controller: 'backend/notification/NotificationController', action: 'search' },
    'POST /api/v1/backend/notification/trash/:ids': { controller: 'backend/notification/NotificationController', action: 'trash' },
    'POST /api/v1/backend/notification': { controller: 'backend/notification/NotificationController', action: 'add' },
    'POST /api/v1/backend/notification/pushFirebase/:id' : { controller: 'backend/notification/NotificationController', action: 'pushFirebase' },

    //TAXONOMY API
    'POST /api/v1/backend/taxonomy/add': { controller: 'backend/taxonomy/TaxonomyController', action: 'add' },
    'GET  /api/v1/backend/taxonomy/:id/': { controller: 'backend/taxonomy/TaxonomyController', action: 'get' },
    'POST /api/v1/backend/taxonomy/:id/': { controller: 'backend/taxonomy/TaxonomyController', action: 'edit' },
    'GET /api/v1/backend/taxonomy/search': { controller: 'backend/taxonomy/TaxonomyController', action: 'search' },
    'POST /api/v1/backend/taxonomy/trash/:ids': { controller: 'backend/taxonomy/TaxonomyController', action: 'trash' },
    'PATCH /api/v1/backend/taxonomy/switchStatus/:id': { controller: 'backend/taxonomy/TaxonomyController', action: 'switchStatus' },

    //FOOD API
    'POST /api/v1/backend/food/add': { controller: 'backend/food/FoodController', action: 'add' },
    'GET /api/v1/backend/food/get/:id': { controller: 'backend/food/FoodController', action: 'get' },
    'PATCH /api/v1/backend/food/edit/:id': { controller: 'backend/food/FoodController', action: 'edit' },
    'GET /api/v1/backend/food/search': { controller: 'backend/food/FoodController', action: 'search' },
    'POST /api/v1/backend/food/trash/:ids': { controller: 'backend/food/FoodController', action: 'trash' },
    'PATCH /api/v1/backend/food/switchStatus/:id': { controller: 'backend/food/FoodController', action: 'switchStatus' },

    //MENU API
    'GET /api/v1/backend/menu/get/:id': { controller: 'backend/menu/MenuController', action: 'get' },
    'POST /api/v1/backend/menu/add': { controller: 'backend/menu/MenuController', action: 'add' },
    'POST /api/v1/backend/menu/edit': { controller: 'backend/menu/MenuController', action: 'edit' },
    'GET /api/v1/backend/menu/getByDateUse/:dateUse': { controller: 'backend/menu/MenuController', action: 'getByDateUse' },
    'GET /api/v1/backend/menu/search' : { controller: 'backend/menu/MenuController', action: 'search' },
    'PATCH /api/v1/backend/menu/delete/:id' : { controller: 'backend/menu/MenuController', action: 'delete' },

    //ATTENDENT API
    'GET  /api/v1/backend/class-:classId/attendent': { controller: 'backend/attendent/AttendentController', action: 'checkExisted' },
    'GET  /api/v1/backend/class-:classId/attendent/:id/': { controller: 'backend/attendent/AttendentController', action: 'get' },
    'POST /api/v1/backend/class-:classId/attendent/:id/': { controller: 'backend/attendent/AttendentController', action: 'edit' },
    // 'GET /api/v1/backend/attendent/get/:id': { controller: 'backend/attendent/AttendentController', action: 'get' },
    'POST /api/v1/backend/attendent/checkIn/:id': { controller: 'backend/attendent/AttendentController', action: 'checkIn' },
    // 'POST /api/v1/backend/attendent/pushNotification': { controller: 'backend/attendent/AttendentController', action: 'pushNotification' },

    //IMPORT API
    'POST /api/v1/backend/import/importStudentExcel': { controller: 'backend/import/ImportController', action: 'importStudentExcel' },
    'POST /api/v1/backend/import/importParentExcel': { controller: 'backend/import/ImportController', action: 'importParentExcel' },

    //DASHBOARD
    'GET /api/v1/backend/dashboard/searchSchedule': { controller: 'backend/dashboard/DashBoardController', action: 'searchSchedule' },
    'GET /api/v1/backend/dashboard/searchMenu': { controller: 'backend/dashboard/DashBoardController', action: 'searchMenu' },
    'GET /api/v1/backend/dashboard/searchClassSize': { controller: 'backend/dashboard/DashBoardController', action: 'searchClassSize' },
    'GET /api/v1/backend/dashboard/searchTuition': { controller: 'backend/dashboard/DashBoardController', action: 'searchTuition' },

    //MESSAGE API
    'GET /api/v1/backend/message/joinRoom': { controller: 'backend/message/MessageController', action: 'joinRoom' },
    //'GET /api/v1/backend/message/listGroup': { controller: 'backend/message/MessageController', action: 'listGroup' },
    'POST /api/v1/backend/message/storeMessageData': { controller: 'backend/message/MessageController', action: 'storeMessageData' },
    'GET /api/v1/backend/message-:messageId/getListMessages': { controller: 'backend/message/MessageController', action: 'getListMessages' },
    // 'GET /api/v1/backend/message/getListMessages/:classId': { controller: 'backend/message/MessageController', action: 'getListMessages' },
    'GET /api/v1/backend/message-:messageId/getSeenMessage': { controller: 'backend/message/MessageController', action: 'getSeenMessage' },
    
    //FOOD API
    'POST /api/v1/backend/currency/add': { controller: 'backend/currency/CurrencyController', action: 'add' },
    'GET /api/v1/backend/currency/get/:id': { controller: 'backend/currency/CurrencyController', action: 'get' },
    'PATCH /api/v1/backend/currency/edit/:id': { controller: 'backend/currency/CurrencyController', action: 'edit' },
    'GET /api/v1/backend/currency/search': { controller: 'backend/currency/CurrencyController', action: 'search' },
    'POST /api/v1/backend/currency/trash/:ids': { controller: 'backend/currency/CurrencyController', action: 'trash' },
    'PATCH /api/v1/backend/currency/switchStatus/:id': { controller: 'backend/currency/CurrencyController', action: 'switchStatus' },

    //FEE ITEM API
    'POST /api/v1/backend/feeItem/add': { controller: 'backend/feeItem/FeeItemController', action: 'add' },
    'GET /api/v1/backend/feeItem/get/:id': { controller: 'backend/feeItem/FeeItemController', action: 'get' },
    'PATCH /api/v1/backend/feeItem/edit/:id': { controller: 'backend/feeItem/FeeItemController', action: 'edit' },
    'GET /api/v1/backend/feeItem/search': { controller: 'backend/feeItem/FeeItemController', action: 'search' },
    'PATCH /api/v1/backend/feeItem/delete/:ids': { controller: 'backend/feeItem/FeeItemController', action: 'delete' },
    // 'PATCH /api/v1/backend/feeItem/switchStatus/:id': { controller: 'backend/feeItem/FeeItemController', action: 'switchStatus' },


    //FEE INVOICE API
    'POST /api/v1/backend/feeInvoice/add': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'add' },
    'GET /api/v1/backend/feeInvoice/get/:id': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'get' },
    'PATCH /api/v1/backend/feeInvoice/edit/:id': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'edit' },
    'PATCH /api/v1/backend/feeInvoice/delete/:ids': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'delete' },
    'PATCH /api/v1/backend/feeInvoice/public/:ids': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'public' },
    'PATCH /api/v1/backend/feeInvoice/takePayment/:id': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'takePayment' },
    'GET /api/v1/backend/feeInvoice/search': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'search' },
    'GET /api/v1/backend/feeInvoice/searchStudent': { controller: 'backend/feeInvoice/FeeInvoiceController', action: 'searchStudent' },

}