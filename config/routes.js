/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes tell Sails what to do each time it receives a request.
 *
 * For more information on configuring custom routes, check out:
 * https://sailsjs.com/anatomy/config/routes-js
 */

var routes_api = require('./routes/api');
var routes_socket_mobile = require('./routes/socket');

module.exports.routes = Object.assign(routes_api.api, routes_socket_mobile.socket, {


  //  ╦ ╦╔═╗╔╗ ╔═╗╔═╗╔═╗╔═╗╔═╗
  //  ║║║║╣ ╠╩╗╠═╝╠═╣║ ╦║╣ ╚═╗
  //  ╚╩╝╚═╝╚═╝╩  ╩ ╩╚═╝╚═╝╚═╝

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` your home page.            *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  //==================================
  // ADMIN VIEW ZONE
  //==================================

  'GET /': { action: 'backend/view-homepage-or-redirect' },
  'GET /backend': { action: 'backend/dashboard/index' },

  'GET /installation/account': { action: 'installation/account', locals: { layout: 'backend/layouts/layout-installation' } },
  'GET /installation/setting': { action: 'installation/setting', locals: { layout: 'backend/layouts/layout-installation' } },

  'GET /backend/login': { action: 'backend/entrance/view-login', locals: { layout: 'backend/layouts/layout-guest' } },
  'GET /backend/logout': { action: 'backend/account/logout' },
  'GET /backend/password/forgot': { action: 'backend/entrance/view-forgot-password', locals: { layout: 'backend/layouts/layout-guest' } },
  'GET /backend/account/profile': { action: 'backend/account/view-edit-profile' },

  'GET /backend/dashboard': { action: 'backend/dashboard/index', locals: { layout: 'backend/layouts/layout' } },

  //Activity
  'GET /backend/activity': { action: 'backend/activity/index', locals: { layout: 'backend/layouts/layout-activity' } },
  'GET /backend/activity/closed': { action: 'backend/activity/closed', locals: { layout: 'backend/layouts/layout-activity' } },

  // Setting ----- WebForm
  'GET /backend/setting': { action: 'backend/setting/list' },

  //USER ----- User/List
  'GET /backend/user': { action: 'backend/user/index' },
  'GET /backend/user/add': { action: 'backend/user/form' },
  'GET /backend/user/edit/:id': { action: 'backend/user/form' },

  //POST
  'GET /backend/post/list': { action: 'backend/post/list' },
  'GET /backend/post/add': { action: 'backend/post/form' },
  'GET /backend/post/edit/:id': { action: 'backend/post/form' },

  //Notification
  'GET /backend/notification/list': { action: 'backend/notification/list' },

  //Taxonomies
  'GET /backend/category': { action: 'backend/taxonomy/categories' },
  'GET /backend/tag': { action: 'backend/taxonomy/tag' },

  //Schedule
  'GET /backend/class-:classActive/schedule': { action: 'backend/schedule/index' },
  'GET /backend/schedule/add': { action: 'backend/schedule/form' },

  //Menu
  'GET /backend/class-:classActive/menu': { action: 'backend/menu/index' },
  'GET /backend/menu/add': { action: 'backend/menu/form' },
  'GET /backend/menu/edit/:id': { action: 'backend/menu/form' },

  //Attendent
  'GET /backend/class-:classActive/attendent': { action: 'backend/attendent/index' },
  'GET /backend/attendent/filter': { action: 'backend/attendent/index' },

  //Student
  'GET /backend/branch-:branchActive/class-:classActive/student': { action: 'backend/student/list' },
  'GET /backend/branch-:branchActive/student': { action: 'backend/student/list' },
  'GET /backend/student/filter': { action: 'backend/student/list' },
  'GET /backend/student/add': { action: 'backend/student/form' },
  'GET /backend/student/edit/:id': { action: 'backend/student/form' },

  //Food
  'GET /backend/food': { action: 'backend/food/index' },

  //Subject
  'GET /backend/subject': { action: 'backend/subject/index' },


  //Setting
  'GET /backend/setting': { action: 'backend/setting/index' },
  'GET /backend/setting/feeCollection': { action: 'backend/setting/fee-collection-setting' },

  //IMPORT
  'GET /backend/class-:classActive/importStudent': { action: 'backend/import/form' },
  'GET /backend/class-:classActive/importParent': { action: 'backend/import/parent' },

  //MESSAGE
  'GET /backend/message/class-:id': { action: 'backend/message/detail' },
  'GET /backend/message': { action: 'backend/message/index' },

  //FEE ITEM
  'GET /backend/feeItem': { action: 'backend/feeItem/index' },

  //FEE INVOICE
  'GET /backend/feeInvoice': { action: 'backend/feeInvoice/index' },
  'GET /backend/feeInvoice/add': { action: 'backend/feeInvoice/form' },

});