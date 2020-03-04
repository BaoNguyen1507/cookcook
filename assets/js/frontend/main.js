// Avoid `console` errors in browsers that lack a console.
(function ($) {
  var method;
  var noop = function () { };
  var methods = [
    'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
    'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
    'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
    'timeStamp', 'trace', 'warn'
  ];
  var length = methods.length;
  var console = (window.console = window.console || {});

  while (length--) {
    method = methods[length];

    // Only stub undefined methods.
    if (!console[method]) {
      console[method] = noop;
    }
  }

}(jQuery));

var KINDIE = KINDIE || {};
//global variable for current backend instance 
var curBackendEKP;

$(document).ready(function () {
  KINDIE.signup();
  KINDIE.login();
  KINDIE.initPlugins();
  KINDIE.initialize();
  KINDIE.forgotPassword();
  //KINDIE.initChats();
});

KINDIE.initialize = function () {
  console.log(EKPAction);

  var pathName = EKPAction;
  switch (pathName) {
    case 'installation/account':
      curBackendEKP = new IndexAccountSABackendEKP();
      break;
    //------------------------------------------------
    case 'installation/setting':
      curBackendEKP = new IndexSettingSABackendEKP();
      break;
    //------------------------------------------------
    case 'frontend/home/index':
      curBackendEKP = new IndexDashboardBackendEKP();
      break;
    //------------------------------------------------
    case 'frontend/album/form':
      curBackendEKP = new IndexFormAlbumBackendEKP();
      break;
    //------------------------------------------------
    case 'frontend/album/edit':
      curBackendEKP = new IndexFormAlbumBackendEKP();
      break;
    // //------------------------------------------------
    // case 'frontend/album/list':
    //   curBackendEKP = new IndexListAlbumBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/album/view':
    //   curBackendEKP = new IndexViewAlbumBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/food/index':
    //   curBackendEKP = new IndexFoodBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/subject/index':
    //   curBackendEKP = new IndexSubjectBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/coursesession/index':
    //   curBackendEKP = new IndexCourseSessionBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/taxonomy/categories':
    //   curBackendEKP = new IndexCategoryBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/taxonomy/tag':
    //   curBackendEKP = new IndexTagBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/user/index':
    //   curBackendEKP = new IndexListUserBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/user/form':
    //   curBackendEKP = new IndexUserBackendEKP();
    //   break;
    // //------------------------------------------------
    // case "frontend/account/view-edit-profile":
    // curBackendEKP = new IndexProfileBackendEKP();
    // break;
    // //------------------------------------------------
    // case 'frontend/parent/list':
    //   curBackendEKP = new IndexListParentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/parent/form':
    //   curBackendEKP = new FormIndexParentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/setting/index':
    //   curBackendEKP = new IndexSettingBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/setting/fee-collection-setting':
    //   curBackendEKP = new IndexFeeCollectionSettingBackendEKP();
    //   break;
    //------------------------------------------------
    // case 'backend/schedule/add':
    //   curBackendEKP = new IndexFormScheduleBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'backend/schedule/edit':
    //   curBackendEKP = new IndexFormScheduleBackendEKP();
    //   break;
    //------------------------------------------------
    // case 'frontend/schedule/index':
    //   curBackendEKP = new IndexListScheduleBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/menu/index':
    //   curBackendEKP = new IndexListMenuBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/menu/form':
    //   curBackendEKP = new IndexFormMenuBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/attendent/index':
    //   curBackendEKP = new IndexAttendentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/student/list':
    //   curBackendEKP = new IndexListStudentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/pickup/index':
    //   curBackendEKP = new IndexPickUpBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/student/form':
    //   curBackendEKP = new IndexFormStudentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/student/form':
    //   curBackendEKP = new IndexFormStudentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/class/list':
    //   curBackendEKP = new IndexClassBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/tuition/index':
    //   curBackendEKP = new IndexTuitionBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/report/tuition':
    //   curBackendEKP = new IndexTuitionCheckBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'backend/post/form':
    //   curBackendEKP = new IndexFormPostBackendEKP();
    //   break;
    // //------------------------------------------------ 
    // case 'backend/post/list':
    //   curBackendEKP = new IndexListPostBackendEKP();
    //   break;
    //------------------------------------------------
    // case 'backend/notification/edit':
    //   curBackendEKP = new IndexFormNotificationBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'backend/notification/list':
    //   curBackendEKP = new IndexNotificationBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'backend/execute':
    //   curBackendEKP = new IndexExecuteBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/setting/index':
    //   curBackendEKP = new IndexSettingBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/import/form':
    //   curBackendEKP = new IndexFormImportBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/import/parent':
    //   curBackendEKP = new IndexFormImportParentBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/message/index':
    //   curBackendEKP = new IndexListMessageBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/message/detail':
    //   curBackendEKP = new IndexListMessageBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/currency/index':
    //   curBackendEKP = new IndexCurrencyBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/feeitem/index':
    //   curBackendEKP = new IndexFeeItemBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/feeinvoice/index':
    //   curBackendEKP = new IndexFeeInvoiceBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/feeinvoice/form':
    //   curBackendEKP = new FormFeeInvoiceBackendEKP();
    //   break;
    // //------------------------------------------------
    // case 'frontend/branch/list':
    //   curBackendEKP = new IndexBranchBackendEKP();
    //   break;
    //------------------------------------------------
    default:
      break;
  }
}

KINDIE.signup = function () {
  if ($('#frmSignup').length) {
    $('#frmSignup').validator().on('submit', (e) => {
      if (e.isDefaultPrevented()) {
        //nothing
      } else {
        e.preventDefault();
        //looks good
        console.log('[SUBMIT][START] ----- frmSignup -----');
        //prepare data
        let formData = $('#frmSignup').serializeArray();
        let tmpData = {};
        _.each(formData, (item) => {
          tmpData[item.name] = item.value;
        });
        //sign up start
        Cloud.signup.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
          if (err) {
            //err from server responde
            if (err.code == 'badCombo') {
              $('#loginFail').removeClass('hidden');
              $('#otherError').addClass('hidden');
            } else {
              $('#loginFail').addClass('hidden');
              $('#otherError').removeClass('hidden');
            }
            return;
          }
          //cloud success
          console.log('----- frmSignup ----- [SUBMIT][END]');
          window.location = 'backend/login';
        });
      }
    });
  }
};

KINDIE.login = function () {
  if ($('#frmLogin').length) {
    $('#frmLogin').validator().on('submit', (e) => {
      if (e.isDefaultPrevented()) {
        //nothing
        $('#requiredFeild').removeClass('d-none').addClass("alert-danger");
        setTimeout(function(){
          $('#requiredFeild').removeClass('alert-danger').addClass("d-none");
        }, 5000);
      } else {
        e.preventDefault();
        //looks good
        console.log('[SUBMIT][START] ----- frmLogin -----');
        //prepare data
        let formData = $('#frmLogin').serializeArray();
        let tmpData = {};
        _.each(formData, (item) => {
          tmpData[item.name] = item.value;
        });
        //sign up start
        Cloud.login.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
          if (err) {
            //err from server responde
            if (err.code == 'badCombo') {
              $('#loginFail').removeClass('d-none').addClass("alert-danger");
              setTimeout(function(){
                $('#loginFail').removeClass('alert-danger').addClass("d-none");
              }, 5000);
            } else if (err.code == 'accountNotReady') {
              $('#accountNotActive').removeClass('d-none').addClass("alert-danger");
              setTimeout(function(){
                $('#accountNotActive').removeClass('alert-danger').addClass("d-none");
              }, 5000);
            } else {
              $('#loginFail').addClass('d-none');
              $('#otherError').removeClass('d-none');
              $('#accountNotActive').addClass('d-none');
            }
            return;
          }
          //cloud success
          console.log('----- frmLogin ----- [SUBMIT][END]');
          // if (responseBody.user.isSuperAdmin == true) {
          //   window.location = 'sa/dashboard';
          // } else {
          //   window.location = 'dashboard';
          // }
          window.location = 'dashboard';
        });
      }
    });
  }
};

KINDIE.forgotPassword = function () {
  if ($('#frmForgotPassword').length) {
    $('#frmForgotPassword').validator().on('submit', (e) => {
      if (e.isDefaultPrevented()) {
        //nothing
      } else {
        e.preventDefault();
        //looks good
        console.log('[SUBMIT][START] ----- frmForgotPassword -----');
        //prepare data
        let formData = $('#frmForgotPassword').serializeArray();
        let tmpData = {};
        _.each(formData, (item) => {
          tmpData[item.name] = item.value;
        });
        //sign up start
        Cloud.sendPasswordRecoveryEmail.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
          if (err) {
            //err from server responde
            $('#resetPasswordFail').removeClass('hidden');
            $('#resetPasswordSuccessfully').addClass('hidden');
            return;
          } else {
            $('#resetPasswordFail').addClass('hidden');
            $('#resetPasswordSuccessfully').removeClass('hidden');
          }
          //cloud success
          console.log('----- frmForgotPassword ----- [SUBMIT][END]');

        });
      }
    });
  }
}

KINDIE.initPlugins = function () {
  if ($('.preloader').length) {
    $(".preloader").fadeOut();
  }
  if ($('[data-toggle="tooltip"]').length) {
    $('[data-toggle="tooltip"]').tooltip();
  }
  if ($('.js-tags-multi-select').length) {
    $('.js-tags-multi-select').select2();
  }
  //init date range
  if ($('.input-daterange').length) {
    window.dateRange = $('.input-daterange').datepicker({
      orientation: 'bottom left'
    }).on('changeDate', function (e) {
      // `e` here contains the extra attributes
      if (e.target.name == 'start') {
        window.startDate = e.dates[0];
      } else if (e.target.name == 'end') {
        window.endDate = e.dates[0];
      }
    });;
  }
  if ($('.multi-select').length) {
    let multi = [];
    $('.multi-select').multiSelect({
      afterSelect: function (values) {

        multi.push(values);
        curBackendEKP.form.valueOfSetting = multi;
      },
      afterDeselect: function (values) {
        multi.push(values);
        curBackendEKP.form.valueOfSetting = multi;
      }
    });
  }
} 

// KINDIE.initChats = function () {
//   let userActiveId = $("#right-sidebar").attr('data-userActiveId');
//   $(".nav-settings").on("click", function() {
//     $("#right-sidebar").toggleClass("open");

//     if ($("#right-sidebar").hasClass("open")) {
//       $(".chat-list").find('li').each(function () {
//         let classId = $(this).attr('data-classId'); 
//         io.socket.get('/api/v1/backend/message/listGroup', { classId: classId, userActiveId : userActiveId }, function gotResponse(body, response) {
//           console.log('Data: ', body);
//           $("#timeLastTxtMsg-" + classId).html(body.data.timeLastMessage ? moment(body.data.timeLastMessage).format('hh:mm a') : '');
//           $("#lastTxtMessage-" + classId).text(body.data.lastMessage);
//           if (body.data.unreadMessages != 0) {
//             $("#numberOfUnreadMessage-" + classId).html(body.data.unreadMessages);
//             $("#numberOfUnreadMessage-" + classId).addClass('number-new-msg');
//           }
//         })
//       })
//     }
//   });
//   $(".settings-close").on("click", function() {
//     $("#right-sidebar,#theme-settings").removeClass("open");  
//   });
// }