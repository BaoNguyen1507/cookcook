module.exports.mobile = {
  /************* Auth **************/
  'PUT /api/v1/mobile/auth/token': { controller: 'mobile/MobileAuthController', action: 'getToken' },
  'GET /api/v1/mobile/auth/sampleToken': { controller: 'mobile/MobileAuthController', action: 'sampleToken' },
  'PUT /api/v1/mobile/auth/update-token': { controller: 'mobile/MobileAuthController', action: 'updateToken' },

  //LOGIN
  'PUT /api/v1/mobile/entrance/login/': { controller: 'mobile/MobileLoginController', action: 'login' },
  'PUT /api/v1/mobile/entrance/logout/': { controller: 'mobile/MobileLoginController', action: 'logout' },
  'GET /api/v1/mobile/entrance/checkExpiredToken': { controller: 'mobile/MobileLoginController', action: 'checkExpiredToken' },

  //RESET-PASSWOD
  'PUT /api/v1/mobile/resetpasword/': { controller: 'mobile/MobileResetPasswordController', action: 'resetPassword' },

  //CHANGE-PASSWOD
  'PUT /api/v1/mobile/changepasword/': { controller: 'mobile/MobileChangePassController', action: 'changePassword' },

  // USER
  'PUT /api/v1/mobile/user/': { controller: 'mobile/MobileUserController', action: 'search' },
  'GET /api/v1/mobile/user/get/:id': { controller: 'mobile/MobileUserController', action: 'get' },
  'PUT /api/v1/mobile/user/edit': { controller: 'mobile/MobileUserController', action: 'edit' },
  'PUT /api/v1/mobile/user/upload': { controller: 'mobile/MobileUserController', action: 'upload' },
  'POST /api/v1/mobile/user/addExpoToken': { controller: 'mobile/MobileUserController', action: 'addExpoToken' },
  'GET /api/v1/mobile/class-:classId/user': { controller: 'mobile/MobileUserController', action: 'getListTeacherByClassId' },

  // SETTINGS
  'GET /api/v1/mobile/setting/:key': { controller: 'mobile/MobileSettingsController', action: 'get' },

  // TAXONOMY
  'PUT /api/v1/mobile/taxonomy/': { controller: 'mobile/MobileTaxonomyController', action: 'search' },
  'GET /api/v1/mobile/taxonomy/:id/': { controller: 'mobile/MobileTaxonomyController', action: 'get' },
  'POST /api/v1/mobile/taxonomy/': { controller: 'mobile/MobileTaxonomyController', action: 'add' },
  'PUT /api/v1/mobile/taxonomy/:id/': { controller: 'mobile/MobileTaxonomyController', action: 'edit' },
  'PUT /api/v1/mobile/taxonomy/': { controller: 'mobile/MobileTaxonomyController', action: 'trash' },

  // PARENT
  'PUT /api/v1/mobile/parent/': { controller: 'mobile/MobileParentController', action: 'search' },
  'GET /api/v1/mobile/parent/get/:id': { controller: 'mobile/MobileParentController', action: 'get' },
  'PUT /api/v1/mobile/parent/edit': { controller: 'mobile/MobileParentController', action: 'edit' },
  'PUT /api/v1/mobile/parent/upload': { controller: 'mobile/MobileParentController', action: 'upload' },
  'POST /api/v1/mobile/parent/addExpoToken': { controller: 'mobile/MobileParentController', action: 'addExpoToken' },
  'GET /api/v1/mobile/class-:classId/parent': { controller: 'mobile/MobileParentController', action: 'getParentsFromClass' },

  // MESSAGE
  'GET /api/v1/mobile/message/listGroup': { controller: 'mobile/MobileMessageController', action: 'listGroup' },
  'POST /api/v1/mobile/message/storeMessageData': { controller: 'mobile/MobileMessageController', action: 'storeMessageData' },
  'GET /api/v1/mobile/message-:messageId/getListMessages': { controller: 'mobile/MobileMessageController', action: 'getListMessages' },
  'GET /api/v1/mobile/message-:messageId/getSeenMessage': { controller: 'mobile/MobileMessageController', action: 'getSeenMessage' },

  // STUDENT
  'GET /api/v1/mobile/student/getStudent': { controller: 'mobile/MobileStudentController', action: 'getStudent' },
  'GET /api/v1/mobile/class-:classId/student': { controller: 'mobile/MobileStudentController', action: 'getListStudentByClassId' },
  'PUT /api/v1/mobile/student/getStudentThumb': { controller: 'mobile/MobileStudentController', action: 'getStudentThumb' },
  'PUT /api/v1/mobile/student/updateWHHistory': { controller: 'mobile/MobileStudentController', action: 'updateWHHistory' },
  'PUT /api/v1/mobile/student/updateHealthHistory': { controller: 'mobile/MobileStudentController', action: 'updateHealthHistory' },
  'PUT /api/v1/mobile/student/edit/:id': { controller: 'mobile/MobileStudentController', action: 'edit' },
  'PUT /api/v1/mobile/student/upload': { controller: 'mobile/MobileStudentController', action: 'upload' },

  // POST
  'PUT /api/v1/mobile/post/': { controller: 'mobile/MobilePostController', action: 'search' },
  'GET /api/v1/mobile/post': { controller: 'mobile/MobilePostController', action: 'list' },
  'GET /api/v1/mobile/post/:id': { controller: 'mobile/MobilePostController', action: 'get' },
  'PUT /api/v1/mobile/post/addComment/': { controller: 'mobile/MobilePostController', action: 'addComment' },

  // ALBUM
  'GET /api/v1/mobile/class-:classId/album': { controller: 'mobile/MobileAlbumController', action: 'list' },
  'GET /api/v1/mobile/album/:id': { controller: 'mobile/MobileAlbumController', action: 'get' },
  'POST /api/v1/mobile/album': { controller: 'mobile/MobileAlbumController', action: 'add' },
  'PUT /api/v1/mobile/album/:id': { controller: 'mobile/MobileAlbumController', action: 'edit' },

  // CLASS
  'PUT /api/v1/mobile/class/': { controller: 'mobile/MobileClassController', action: 'search' },
  'GET /api/v1/mobile/class/:id/': { controller: 'mobile/MobileClassController', action: 'get' },
  'POST /api/v1/mobile/class/': { controller: 'mobile/MobileClassController', action: 'add' },
  'PUT /api/v1/mobile/class/:id/': { controller: 'mobile/MobileClassController', action: 'edit' },
  'PUT /api/v1/mobile/class/': { controller: 'mobile/MobileClassController', action: 'trash' },

  // SUBJECT
  'GET /api/v1/mobile/subject': { controller: 'mobile/MobileSubjectController', action: 'list' },
  'PUT /api/v1/mobile/subject': { controller: 'mobile/MobileSubjectController', action: 'search' },
  'GET /api/v1/mobile/subject/:id': { controller: 'mobile/MobileSubjectController', action: 'get' },
  'POST /api/v1/mobile/subject': { controller: 'mobile/MobileSubjectController', action: 'add' },
  'PUT /api/v1/mobile/subject/:id': { controller: 'mobile/MobileSubjectController', action: 'edit' },
  'PUT /api/v1/mobile/subject': { controller: 'mobile/MobileSubjectController', action: 'trash' },

  // COMMENT
  'PUT /api/v1/mobile/comment/': { controller: 'mobile/MobileCommentController', action: 'search' },
  'GET /api/v1/mobile/comment/:id/': { controller: 'mobile/MobileCommentController', action: 'get' },
  'POST /api/v1/mobile/comment/': { controller: 'mobile/MobileCommentController', action: 'add' },
  'PUT /api/v1/mobile/comment/:id/': { controller: 'mobile/MobileCommentController', action: 'edit' },
  'PUT /api/v1/mobile/comment/': { controller: 'mobile/MobileCommentController', action: 'trash' },

  // MEDIA
  // 'PUT /api/v1/mobile/media/newMedia': { controller: 'mobile/MobileMediaController', action: 'newMedia' },
  'POST /api/v1/mobile/media/add/': { controller: 'mobile/MobileMediaController', action: 'add' },

  //FOOD
  'GET /api/v1/mobile/food': { controller: 'mobile/MobileFoodController', action: 'list' },
  'PUT /api/v1/mobile/food': { controller: 'mobile/MobileFoodController', action: 'search' },
  'GET /api/v1/mobile/food/:id': { controller: 'mobile/MobileFoodController', action: 'get' },
  'POST /api/v1/mobile/food': { controller: 'mobile/MobileFoodController', action: 'add' },
  'PUT /api/v1/mobile/food/:id': { controller: 'mobile/MobileFoodController', action: 'edit' },
  'PUT /api/v1/mobile/food': { controller: 'mobile/MobileFoodController', action: 'trash' },

  //MENU
  'GET /api/v1/mobile/menu/:id/': { controller: 'mobile/MobileMenuController', action: 'get' },
  'GET /api/v1/mobile/menu': { controller: 'mobile/MobileMenuController', action: 'search' },

  // SCHEDULE
  'GET /api/v1/mobile/schedule': { controller: 'mobile/MobileScheduleController', action: 'search' },

  //NOTIFICATION
  'GET /api/v1/mobile/notification': { controller: 'mobile/MobileNotificationController', action: 'list' },
  'GET /api/v1/mobile/notification/:id': { controller: 'mobile/MobileNotificationController', action: 'get' },
  'PUT /api/v1/mobile/notification/read': { controller: 'mobile/MobileNotificationController', action: 'read' },
  'GET /api/v1/mobile/notification/notRead/:id': { controller: 'mobile/MobileNotificationController', action: 'notRead' },

  // ATTEDENT
  'POST /api/v1/mobile/attendent/findOrCreate': { controller: 'mobile/MobileAttendentController', action: 'findOrCreate' },
  'GET /api/v1/mobile/attendent/:id': { controller: 'mobile/MobileAttendentController', action: 'get' },
  'PUT /api/v1/mobile/attendent/:id': { controller: 'mobile/MobileAttendentController', action: 'edit' },
  'POST /api/v1/mobile/attendent/checkIn/:id': { controller: 'mobile/MobileAttendentController', action: 'checkIn' },
  'POST /api/v1/mobile/attendent/pushNotification': { controller: 'mobile/MobileAttendentController', action: 'pushNotification' },
  // GET HISTORY
  'GET /api/v1/mobile/attendent/history': { controller: 'mobile/MobileAttendentController', action: 'history' },
  'GET /api/v1/mobile/attendent/historyGet': { controller: 'mobile/MobileAttendentController', action: 'historyGet' },

  // DAYOFF
  'POST /api/v1/mobile/dayOff': { controller: 'mobile/MobileDayoffController', action: 'dayOff' },

  // PICKUP API
  'GET  /api/v1/mobile/pickup/checkExisted': { controller: 'mobile/MobilePickUpController', action: 'checkExisted' },
  'GET  /api/v1/mobile/pickup/:id': { controller: 'mobile/MobilePickUpController', action: 'get' },
  'PUT /api/v1/mobile/pickup/:id': { controller: 'mobile/MobilePickUpController', action: 'edit' },

  // FEE INVOICE
  'GET /api/v1/mobile/feeInvoice/list/:studentId': { controller: 'mobile/MobileFeeInvoiceController', action: 'listByStudent' },
  'GET /api/v1/mobile/feeInvoice/:id': { controller: 'mobile/MobileFeeInvoiceController', action: 'get' },

  // PAYMENT
  'POST /api/v1/mobile/payment/add': { controller: 'mobile/MobilePaymentController', action: 'add' }

}
