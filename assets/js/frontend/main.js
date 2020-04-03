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

var COOKCOOK = COOKCOOK || {};
//global variable for current backend instance 
var curBackendEKP;

$(document).ready(function () {
  COOKCOOK.initialize(); 
  COOKCOOK.login();
});

COOKCOOK.initialize = function () {
  console.log(EKPAction);
  var pathName = EKPAction;
  switch (pathName) {
    //------------------------------------------------
    case 'frontend/home/index':
      curBackendEKP = new IndexDashboardFrontendEKP();
      break;
    //------------------------------------------------
    case 'frontend/notification/index':
      curBackendEKP = new IndexNotificationFrontendEKP();
      break;
    //------------------------------------------------
    case 'frontend/news/index':
     curBackendEKP = new IndexNewsFrontendEKP();
    break;
    //------------------------------------------------
    case 'frontend/news/detail':
     curBackendEKP = new IndexNewsFrontendEKP();
    break;
    //------------------------------------------------
    case 'frontend/contact/index':
      curBackendEKP = new IndexContactFrontendEKP();
      break;
    //------------------------------------------------
    case 'frontend/gallery/index':
      curBackendEKP = new IndexGalleryFrontendEKP();
    break;
    //------------------------------------------------
    case 'frontend/subject/index':
      curBackendEKP = new IndexSubjectFrontendEKP();
    //------------------------------------------------
    case 'frontend/user/profile':
    curBackendEKP = new IndexUserParentFrontendEKP();
    break;
    default:
      break;
  }
}
COOKCOOK.login = function () {
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
          window.location = '/user/profile';
        });
      }
    });
  }
};