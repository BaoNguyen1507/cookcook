module.exports.api = {
    /* API WEB  */
    'PUT   /api/v1/backend/account/update-password': { action: 'backend/account/update-password' },
    'PUT   /api/v1/backend/account/logout': { action: 'backend/account/logout' },
    'PUT   /api/v1/backend/account/update-profile': { action: 'backend/account/update-profile' },
    'PUT   /api/v1/backend/entrance/login': { action: 'backend/entrance/login' },
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

    //PARENT API
    'POST /api/v1/backend/parent/add': { controller: 'backend/parent/ParentController', action: 'add' },
    'POST /api/v1/backend/parent/uploadThumbnail': { controller: 'backend/parent/ParentController', action: 'uploadThumbnail' },
    'GET /api/v1/backend/parent/get/:id': { controller: 'backend/parent/ParentController', action: 'get' },
    'PATCH /api/v1/backend/parent/edit/:id': { controller: 'backend/parent/ParentController', action: 'edit' },
    'PATCH /api/v1/backend/parent/trash/:ids': { controller: 'backend/parent/ParentController', action: 'trash' },
    'GET /api/v1/backend/parent/list/search': { controller: 'backend/parent/ParentController', action: 'search' },
    'PUT /api/v1/backend/parent/readNotification': { controller: 'backend/parent/ParentController', action: 'readNotification' },
    'PATCH /api/v1/backend/parent/switchStatus/:id': { controller: 'backend/parent/ParentController', action: 'switchStatus' },

    //POST API
    'GET /api/v1/backend/post/get/:id': { controller: 'backend/post/PostController', action: 'get' },
    'POST /api/v1/backend/post/add': { controller: 'backend/post/PostController', action: 'add' },
    'PATCH /api/v1/backend/post/edit/:id': { controller: 'backend/post/PostController', action: 'edit' },
    'GET /api/v1/backend/post/search': { controller: 'backend/post/PostController', action: 'search' },
    'POST /api/v1/backend/post/uploadThumbnail': { controller: 'backend/post/PostController', action: 'uploadThumbnail' },
    'POST /api/v1/backend/post/trash/:ids': { controller: 'backend/post/PostController', action: 'trash' },
    'PATCH /api/v1/backend/post/switchStatus/:id': { controller: 'backend/post/PostController', action: 'switchStatus' },

    //ALBUM API
    'POST /api/v1/backend/album/add': { controller: 'backend/album/AlbumController', action: 'add' },
    'PATCH /api/v1/backend/album/edit/:id': { controller: 'backend/album/AlbumController', action: 'edit' },
    'GET /api/v1/backend/album/search': { controller: 'backend/album/AlbumController', action: 'search' },
    'POST /api/v1/backend/album/uploadThumbnail': { controller: 'backend/album/AlbumController', action: 'uploadThumbnail' },
    'POST /api/v1/backend/album/trash/:ids': { controller: 'backend/album/AlbumController', action: 'trash' },
    'PATCH /api/v1/backend/album/deleteCmt/:id': { controller: 'backend/album/AlbumController', action: 'deleteCmt' },
    'PATCH /api/v1/backend/album/switchStatus/:id': { controller: 'backend/album/AlbumController', action: 'switchStatus' },

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

    //SCHEDULE API
    'POST /api/v1/backend/schedule/add': { controller: 'backend/schedule/ScheduleController', action: 'add' },
    'GET  /api/v1/backend/schedule/:dateUse': { controller: 'backend/schedule/ScheduleController', action: 'get' },
    'POST /api/v1/backend/schedule/edit/:dateUse': { controller: 'backend/schedule/ScheduleController', action: 'edit' },
    'GET /api/v1/backend/schedule/search': { controller: 'backend/schedule/ScheduleController', action: 'search' },
    'POST /api/v1/backend/schedule/trash/:ids': { controller: 'backend/schedule/ScheduleController', action: 'trash' },
    'PATCH /api/v1/backend/schedule/delete/:id': { controller: 'backend/schedule/ScheduleController', action: 'delete' },

    //CLASS API
    'POST /api/v1/backend/class/add': { controller: 'backend/class/ClassController', action: 'add' },
    'GET  /api/v1/backend/class/:id/': { controller: 'backend/class/ClassController', action: 'get' },
    'POST /api/v1/backend/class/:id/': { controller: 'backend/class/ClassController', action: 'edit' },
    'GET /api/v1/backend/class/search': { controller: 'backend/class/ClassController', action: 'search' },
    'POST /api/v1/backend/class/trash/:ids': { controller: 'backend/class/ClassController', action: 'trash' },
    'PATCH /api/v1/backend/class/switchStatus/:id': { controller: 'backend/class/ClassController', action: 'switchStatus' },

    //STUDENT API
    'POST /api/v1/backend/student/add': { controller: 'backend/student/StudentController', action: 'add' },
    'GET  /api/v1/backend/student/:id/': { controller: 'backend/student/StudentController', action: 'get' },
    'POST /api/v1/backend/student/:id/': { controller: 'backend/student/StudentController', action: 'edit' },
    'GET /api/v1/backend/student/search': { controller: 'backend/student/StudentController', action: 'search' },
    'POST /api/v1/backend/student/trash/:ids': { controller: 'backend/student/StudentController', action: 'trash' },
    'POST /api/v1/backend/student/uploadThumbnail': { controller: 'backend/student/StudentController', action: 'uploadThumbnail' },
    'PATCH /api/v1/backend/student/switchStatus/:id': { controller: 'backend/student/StudentController', action: 'switchStatus' },

    // PICKUP API
    'GET  /api/v1/backend/class-:classId/pickup': { controller: 'backend/pickup/PickUpController', action: 'checkExisted' },
    'GET  /api/v1/backend/class-:classId/pickup/:id/': { controller: 'backend/pickup/PickUpController', action: 'get' },
    'POST /api/v1/backend/class-:classId/pickup/:id/': { controller: 'backend/pickup/PickUpController', action: 'edit' },

    //TUITION API
    'POST /api/v1/backend/tuition/add': { controller: 'backend/tuition/TuitionController', action: 'add' },
    'GET  /api/v1/backend/tuition/:id/': { controller: 'backend/tuition/TuitionController', action: 'get' },
    'POST /api/v1/backend/tuition/:id/': { controller: 'backend/tuition/TuitionController', action: 'edit' },
    'GET /api/v1/backend/tuition/search': { controller: 'backend/tuition/TuitionController', action: 'search' },
    'POST /api/v1/backend/tuition/trash/:ids': { controller: 'backend/tuition/TuitionController', action: 'trash' },
    'PATCH /api/v1/backend/tuition/switchStatus/:id': { controller: 'backend/tuition/TuitionController', action: 'switchStatus' },

    // TUITION CHECK API
    'GET /api/v1/backend/report/tuition/get/:id': { controller: 'backend/report/ReportTuitionController', action: 'get' },
    'PATCH /api/v1/backend/report/tuition/edit/:id': { controller: 'backend/report/ReportTuitionController', action: 'edit' },
    'GET /api/v1/backend/report/tuition/search': { controller: 'backend/report/ReportTuitionController', action: 'search' },

    //FOOD API
    'POST /api/v1/backend/food/add': { controller: 'backend/food/FoodController', action: 'add' },
    'GET /api/v1/backend/food/get/:id': { controller: 'backend/food/FoodController', action: 'get' },
    'PATCH /api/v1/backend/food/edit/:id': { controller: 'backend/food/FoodController', action: 'edit' },
    'GET /api/v1/backend/food/search': { controller: 'backend/food/FoodController', action: 'search' },
    'POST /api/v1/backend/food/trash/:ids': { controller: 'backend/food/FoodController', action: 'trash' },
    'PATCH /api/v1/backend/food/switchStatus/:id': { controller: 'backend/food/FoodController', action: 'switchStatus' },

    //SUBJECT API
    'POST /api/v1/backend/subject/add': { controller: 'backend/subject/SubjectController', action: 'add' },
    'GET /api/v1/backend/subject/get/:id': { controller: 'backend/subject/SubjectController', action: 'get' },
    'PATCH /api/v1/backend/subject/edit/:id': { controller: 'backend/subject/SubjectController', action: 'edit' },
    'GET /api/v1/backend/subject/search': { controller: 'backend/subject/SubjectController', action: 'search' },
    'POST /api/v1/backend/subject/trash/:ids': { controller: 'backend/subject/SubjectController', action: 'trash' },
    'PATCH /api/v1/backend/subject/switchStatus/:id': { controller: 'backend/subject/SubjectController', action: 'switchStatus' },

    // COURSE SESSION
    'POST /api/v1/backend/courseSession/add': { controller: 'backend/courseSession/CourseSessionController', action: 'add' },
    'GET /api/v1/backend/courseSession/get/:id': { controller: 'backend/courseSession/CourseSessionController', action: 'get' },
    'PATCH /api/v1/backend/courseSession/edit/:id': { controller: 'backend/courseSession/CourseSessionController', action: 'edit' },
    'GET /api/v1/backend/courseSession/search': { controller: 'backend/courseSession/CourseSessionController', action: 'search' },
    'POST /api/v1/backend/courseSession/trash/:ids': { controller: 'backend/courseSession/CourseSessionController', action: 'trash' },
    'PATCH /api/v1/backend/courseSession/switchStatus/:id': { controller: 'backend/courseSession/CourseSessionController', action: 'switchStatus' },

    //MENU API
    'GET /api/v1/backend/menu/get/:id': { controller: 'backend/menu/MenuController', action: 'get' },
    'POST /api/v1/backend/menu/add': { controller: 'backend/menu/MenuController', action: 'add' },
    'POST /api/v1/backend/menu/edit': { controller: 'backend/menu/MenuController', action: 'edit' },
    'GET /api/v1/backend/menu/getByDateUse/:dateUse': { controller: 'backend/menu/MenuController', action: 'getByDateUse' },
    'GET /api/v1/backend/menu/search' : { controller: 'backend/menu/MenuController', action: 'search' },
    'PATCH /api/v1/backend/menu/delete/:id' : { controller: 'backend/menu/MenuController', action: 'delete' },

    //ATTENDENT API
    // PICKUP API
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

    // BRANCH API
    'POST /api/v1/backend/branch/add': { controller: 'backend/branch/BranchController', action: 'add' },
    'GET /api/v1/backend/branch/get/:id': { controller: 'backend/branch/BranchController', action: 'get' },
    'PATCH /api/v1/backend/branch/edit/:id': { controller: 'backend/branch/BranchController', action: 'edit' },
    'PATCH /api/v1/backend/branch/trash/:ids': { controller: 'backend/branch/BranchController', action: 'trash' },
    'GET /api/v1/backend/branch/search': { controller: 'backend/branch/BranchController', action: 'search' },
    'PATCH /api/v1/backend/branch/switchStatus/:id': { controller: 'backend/branch/BranchController', action: 'switchStatus' },
    // //PAYMENT API
    // 'POST /api/v1/backend/payment/add': { controller: 'backend/payment/PaymentController', action: 'add' },
}