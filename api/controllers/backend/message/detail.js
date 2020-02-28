const MessageService = require('../../../services/MessageService');
const MessageDataService = require('../../../services/MessageDataService');
const ClassService = require('../../../services/ClassService');
const moment = require('moment');
/**
 * message/dateil.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
module.exports = {
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/message/index',
    },
    redirect: {
      responseType: 'redirect'
    }
  },
  fn: async function (inputs, exits) {
    if (!this.req.me) {
      throw { redirect: '/backend/login' };
    }
    let _default = await sails.helpers.getDefaultData(this.req);
    let params = this.req.allParams();

    if (_default.listClasses && _default.listClasses.length > 0) {
      //Get total member of each chat of class
      let countMember = [];
      for (let item of _default.listClasses) {
        let arrStudent_Class = await Student_Class.find({ classObj: item.id });
        let arrParent_Class = [];
        if (arrStudent_Class && arrStudent_Class.length > 0) {
          for (let student_classObj of arrStudent_Class) {
            let arrStudent_Parent = await Student_Parent.find({ student: student_classObj.student });
            arrParent_Class.push(...arrStudent_Parent);
          }

          //remove duplicate parent in arr
          arrParent_Class = [...new Set(arrParent_Class.map(x => x.parent))];
        }

        countMember.push(arrParent_Class.length);
      }
      _default.countMember = countMember;
    }


    //Get message data for first class of listClasses
    let classObj = await ClassService.get({ id: params.id });
    _default.classObj = classObj;

    let msgObj = await MessageService.get({ classObj: params.id });
    if (msgObj) {
      let listMessage = await MessageData.find({ where: { message: msgObj.id }, limit: 1, skip: 0, sort: [{ createdAt: 'DESC' }] })
      if (listMessage && listMessage.length > 0) {
        let dataLogs = listMessage[0].dataLogs;
        if (dataLogs.length > 0) {
          for (let i = 0; i < dataLogs.length; i++) {
            let tmpUser = await User.findOne({ id: dataLogs[i].user });
            if (!tmpUser) {
              tmpUser = await Parent.findOne({ id: dataLogs[i].user });
              if (tmpUser) {
                dataLogs[i].user = tmpUser;
              }
            } else {
              dataLogs[i].user = tmpUser;
            }
          }
        }
        _default.dataLogs = listMessage[0].dataLogs;
      } else {
        await MessageDataService.add({ message: msgObj.id, dateUse: moment().format('YYYY-MM-DD') });
        _default.dataLogs = [];
      }
      _default.message = msgObj;
    } else {
      msgObj = await MessageService.add({ classObj: params.id, type: 1 });
      await MessageDataService.add({ message: msgObj.id, dateUse: moment().format('YYYY-MM-DD') });
      _default.message = msgObj;
      _default.dataLogs = [];
    }

    return exits.success(_default);
  }
};