/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your actions.
 *
 * For more information on configuring policies, check out:
 * https://sailsjs.com/docs/concepts/policies
 */

module.exports.policies = {

  'view-homepage-or-redirect': true,
  'mobile/MobileMessageController': {
    'listGroup': true,
    'storeMessageData': true,
    'getListMessages': true,
    'getSeenMessage': true
  },
  'mobile/MobileSettingsController': {
    'get': true
  },
  'mobile/MobileLoginController': {
    '*': 'is-mobile-authenticated',
    'login': true,
    'logout': true
  },
  'mobile/MobileAlbumController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileAttendentController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileAuthController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileChangePassController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileClassController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileCommentController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileDayoffController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileFoodController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileMediaController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileMenuController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileNotificationController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileParentController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobilePostController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileResetPasswordController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileScheduleController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileStudentController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileSubjectController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileTaxonomyController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileTuitionController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileUserController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobilePickUpController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobileFeeInvoiceController': {
    '*': 'is-mobile-authenticated'
  },
  'mobile/MobilePaymentController': {
    '*': 'is-mobile-authenticated'
  },

  '*': ['init-before-action'],

  // Bypass the `is-logged-in` policy for:
  'backend/account/logout': true,
  'backend/entrance/*': true,
  'backend/view-homepage-or-redirect': true,
  'installation/*': true,
};
