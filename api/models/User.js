/**
 * @copyright 2017 @ ZiniMediaTeam
 * @author brianvo
 * @create 2017/10/23 01:05
 * @update 2017/10/23 01:05
 * @file api/models/User.js
 * @description :: Staff user model.
 */

module.exports = {
  attributes: {
    emailAddress: {
      type: 'string',
      required: true,
      unique: true,
      isEmail: true,
      maxLength: 200,
      description: 'The email address for this user.',
      example: 'example@zinimedia.com'
    },
    phone: {
      type: 'string',
      maxLength: 11,
      required: true,
      unique: true
    },
    password: {
      type: 'string',
      description:
        'Securely hashed representation of the user\'s login password.',
      protect: true,
      example: '2$28a8eabna301089103-13948134nad'
    },
    firstName: {
      type: 'string',
      required: true,
      description: 'The fist name',
      example: 'Thanh',
      maxLength: 255
    },
    lastName: {
      type: 'string',
      required: true,
      description: 'The last name',
      example: 'Vo Thien',
      maxLength: 255
    },
    // fullName: {
    //   type: 'string',
    //   required: true,
    //   description: 'The fist of the student\'s name',
    //   example: 'Vo Thien Thanh',
    //   maxLength: 255
    // },
    professional: {
      type: 'string',
      description: 'master of bachelor etc...'
    },
    birthday: {
      type: 'string',
      example: 'DD/MM/YYYY'
    },
    address: {
      type: 'string',
      description: 'The User address',
      example: 'abc street, ward 5, Ho Chi Minh City'
    },
    isSuperAdmin: {
      type: 'boolean',
      defaultsTo: false,
      description:
        'Whether this user is a "super admin" with extra permissions, etc.',
      extendedDescription: `Super admins might have extra permissions, see a different default home page when they log in,
      or even have a completely different feature set from normal users.  In this app, the \`isSuperAdmin\`
      flag is just here as a simple way to represent two different kinds of users.`
    },
    lastSeenAt: {
      type: 'number',
      description:
        'A JS timestamp (epoch ms) representing the moment at which this user most recently interacted with the backend while logged in (or 0 if they have not interacted with the backend at all yet).',
      example: 1502844074211,
      defaultsTo: Date.now()
    },
    status: {
      //Integer {"TRASH":-1,"DRAFT":0,"ACTIVE":1}
      type: 'number',
      isIn: [
        sails.config.custom.STATUS.TRASH,
        sails.config.custom.STATUS.DRAFT,
        sails.config.custom.STATUS.ACTIVE
      ],
      defaultsTo: sails.config.custom.STATUS.DRAFT
    },
    userType: {
      type: 'number',
      isIn: [sails.config.custom.TYPE.STAFF, sails.config.custom.TYPE.TEACHER, sails.config.custom.TYPE.SCHOOLADMIN],
      defaultsTo: sails.config.custom.TYPE.STAFF
    },
    timeUpdate: {
      type: 'number',
      defaultsTo: Date.now()
    },
    fcmTokeniOS: {
      type: 'json',
      defaultsTo: []
    },
    fcmTokenAndroid: {
      type: 'json',
      defaultsTo: []
    },
    allowNotification: {
      type: 'boolean',
      defaultsTo: true
    },
    avatar: {
      type: 'string',
      description: 'user photo'
    },
   
    post: {
      collection: 'post',
      via: 'author'
    },
    comments: {
      collection: 'comment',
      via: 'authorCmt'
    }
  }
};
