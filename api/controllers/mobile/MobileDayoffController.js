/**
 * AlbumController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const ErrorMessage = require('../../../config/errors');
const DayoffService = require('../../services/DayoffService');
module.exports = {

  dayOff: async (req, res) => {
    sails.log.info(
      '================================ DayoffController.dayOff => START ================================'
    );
    let params = req.allParams();

    let classId = params.classId;
    let studentId = params.studentId;
    let dateOff = params.dates;

    if (!classId) {
      return res.badRequest(ErrorMessage.DAYOFF_ERR_CLASS_REQUIRED);
    } else if (!studentId) {
      return res.badRequest(ErrorMessage.DAYOFF_ERR_STUDENT_REQUIRED);
    } else if (!dateOff) {
      return res.badRequest(ErrorMessage.DAYOFF_ERR_DATEOFF_REQUIRED);
    }
    //new
    const newData = {
      student: studentId,
      class: classId,
      dateOff: dateOff,
      content: params.content ? params.content : '',
      note: params.note ? params.note : '',
      type: params.type > 0 ? params.type : 1,
      status: sails.config.custom.STATUS.ACTIVE
    };
    // ADD NEW DATA ATTENDENT
    let added = await DayoffService.add(newData);

    
    //create notification for this dayOff and push notification if setting for notificationDayOff == true
    let settingForApp = await Setting.findOne({ key: 'app' });
    if (settingForApp && settingForApp.value && settingForApp.value.notificationDayOff == true) {
      //define teacherIds && parentIds
      let allTeacherId = [];

      let newDataNotification = {
        title: added.content,
        message: added.content,
        status: sails.config.custom.STATUS.ACTIVE,
        type: sails.config.custom.TYPE.DAY_OFF,
        classList: []
      }
      let notification = await Notifications.create(newDataNotification).fetch();
      //get all teacher of this class to send notification
      let allTeacher_Class = await Teacher_Class.find({ classObj: classId });
      allTeacherId = allTeacher_Class.map(item => item.teacher);

      //send notification
      await NotificationService.pushFirebase(notification, [], allTeacherId);
    }

    results = await Dayoff.findOne({
      id: added.id
    }).populate('student').populate('class');

    sails.log.info(
      '================================ DayoffController.dayOff => END ================================'
    );
    return res.json(results);
  }

};
