/**
 * Attendent Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const ErrorMessages = require('../../../config/errors');
const AttendentService = require('../../services/AttendentService');
const moment = require('moment');

module.exports = {
  findOrCreate: async (req, res) => {
    sails.log.info("================================ MobileAttendentController.findOrCreate => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    
    // REQUIRED FIELDS
    if (!params.classId) return res.badRequest(ErrorMessages.ATTENDENT_ERR_CLASSID_REQUIRED);
    if (!params.date) return res.badRequest(ErrorMessages.ATTENDENT_ERR_DATEUSE_REQUIRED);

    // VALIDATE DATE
    let dateAttendent = '';
    let date = moment(params.date).format("YYYY-MM-DD");
    if (date == 'Invalid date') {
      return res.badRequest(ErrorMessages.ATTENDENT_DATE_INVALID);
    } else {
      dateAttendent = date;
    }
    
    //check attendent is existed?
    let todayAttendent = await Attendent.find({ date: dateAttendent, classObj: params.classId }).populate('student');

    if (todayAttendent.length == 0) {
      //get student of class
      let student_class = await Student_Class.find({ classObj: params.classId });
      let studentIds = student_class.map(item => item.student);

      //create attendent data for today
      for (let studentId of studentIds) {
        let attendentRecord = {
          student: studentId,
          date: dateAttendent,
          classObj: params.classId
        };
        let obj = await AttendentService.add(attendentRecord);
        let studentObj = await Student.findOne({ id: studentId });
        obj.student = studentObj;

        todayAttendent.push(obj);
      }
    }
    return res.json(todayAttendent);

  },

  get: async (req, res) => { //USE IN CASE SHUTTLE PERSON INFO IS ON
    sails.log.info("================================ MobileAttendentController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    // QUERY & CHECK DATA COURSE SESSION
    let attendentObj = await AttendentService.get({ id: params.id });
    if (!attendentObj) {
      return res.notFound(ErrorMessages.ATTENDENT_NOT_FOUND);
    }
    let relationStudentParent = await Student_Parent.find({ student: attendentObj.student.id }).populate('parent')
    let arrParent = [];
    _.each(relationStudentParent, (relationItem) => {
      let objParent = {};
      objParent.id = relationItem.parent.id;
      objParent.firstName = relationItem.parent.firstName;
      objParent.lastName = relationItem.parent.lastName;
      objParent.avatar = relationItem.parent.avatar;
      objParent.type = relationItem.type;
      arrParent.push(objParent)
    })
    attendentObj.arrParent = arrParent;
    // RETURN DATA COURSE SESSION
    return res.json(attendentObj);
  },

  edit: async (req, res) => { //USE IN CASE SHUTTLE PERSON INFO IS ON
    sails.log.info("================================ MobileAttendentController.edit => START ================================");
    const params = req.allParams();
    // CHECK PARAMS
    if (!params.id) return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    if (!params.time) return res.badRequest(ErrorMessages.ATTENDENT_TIME_REQUIRED);
    if (!params.parentId && (!params.note || !params.note.trim().length)) return res.badRequest(ErrorMessages.ATTENDENT_NOTE_REQUIRED);
    
    // CHECK ID PICK UP EXIST
    const attendentObj = AttendentService.get({ id: params.id });
    if (!attendentObj) {
      return res.notFound(ErrorMessages.ATTENDENT_NOT_FOUND);
    }
    // CREATE DATA FOR UPDATE
    let editData = {
      status: sails.config.custom.STATUS.ATTENDANT,
      time: params.time,
      note: params.note
    };
    if (params.parentId) editData.parent = params.parentId;
    // UPDATE DATA PICK UP
    const editedObj = await AttendentService.edit({ id: params.id }, editData);

    // RETURN DATA EDITED 
    return res.json(editedObj);
  },

  checkIn: async (req, res) => { //USE IN CASE SHUTTLE PERSON INFO IS OFF
    sails.log.info("================================ MobileAttendentController.add => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    // REQUIRED FIELDS
    if (!params.id) return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    
    //CHECK DATA ATTENDENT EXIST IN DATABASE
    let attendentObj = await AttendentService.get({ id: params.id });
    if (!attendentObj) return res.badRequest(ErrorMessages.ATTENDENT_NOT_FOUND);
    
    let editData = {};
    if (attendentObj.status == sails.config.custom.STATUS.ATTENDANT) {
      editData.status = sails.config.custom.STATUS.ABSENT;
      //remove pickup obj if existed
      await PickUpService.del({ student: attendentObj.student.id, date: attendentObj.date, classObj: attendentObj.classObj })
    } else {
      editData.status = sails.config.custom.STATUS.ATTENDANT;
    }

    //UPDATE STATUS
    let editedObj = await AttendentService.edit({ id: params.id }, editData);
    return res.json(editedObj);
  },

  pushNotification: async (req, res) => {
    sails.log.info("================================ AttendentController.pushNotification => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    if (!params.classId) return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);
    if (!params.date) return res.badRequest(ErrorMessages.ATTENDENT_DATE_REQUIRED);

    let attendents = await Attendent.find({ date: params.date, classObj: params.classId }).populate('student');
    if (attendents.length == 0) return res.badRequest(ErrorMessages.ATTENDENT_NOT_FOUND);

    for (let attendentObj of attendents) {
      let allStudent_Parent = await Student_Parent.find({ student: attendentObj.student.id });
      let allParentId = [];

      //get all parent of student
      if (allStudent_Parent && allStudent_Parent.length > 0) {
        for (let student_parent of allStudent_Parent) {
          allParentId.push(student_parent.parent);
        }
      }

      //create data notification depend on student absence or not
      let dataNotification = {};
      if (attendentObj.status == 1) {
        dataNotification = {
          title: sails.__('Student %s %s is present in class!', attendentObj.student.firstName, attendentObj.student.lastName),
          message: sails.__('Student %s %s is present in class!', attendentObj.student.firstName, attendentObj.student.lastName),
          status: sails.config.custom.STATUS.ACTIVE,
          type: sails.config.custom.TYPE.ATTENDENT,
          classList: []
        }
      } else {
        dataNotification = {
          title: sails.__('Student %s %s is absent today!', attendentObj.student.firstName, attendentObj.student.lastName),
          message: sails.__('Student %s %s is absent today!', attendentObj.student.firstName, attendentObj.student.lastName),
          status: sails.config.custom.STATUS.ACTIVE,
          type: sails.config.custom.TYPE.ATTENDENT,
          classList: []
        }
      }

      //create notification and send push noti
      let notification = await NotificationService.add(dataNotification);
      await NotificationService.pushFirebase(notification, allParentId, []);
    }

    return res.json({ message: 'ok' });
  },

  history: async (req, res) => {
    sails.log.info("================================ MobileAttendentController.history => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    
    // REQUIRED FIELDS
    if (!params.classId) return res.badRequest(ErrorMessages.ATTENDENT_ERR_CLASSID_REQUIRED);
    if (!params.date) return res.badRequest(ErrorMessages.ATTENDENT_DATE_REQUIRED);

    // VALIDATE DATE
    let date = moment(params.date).format("YYYY-MM-DD");
    if (date == 'Invalid date') {
      return res.badRequest(ErrorMessages.ATTENDENT_DATE_INVALID);
    }

    let history = await Attendent.find({ date: date, classObj: params.classId }).populate('student');
    if (history.length == 0) return res.badRequest(ErrorMessages.NO_DATA_ATTENDENT);

    for (let i = 0; i < history.length; i++){
      let isAttendent = false;
      let isPickUp = false;

      if (history[i].status == 1) {
        isAttendent = true;

        let pickUpObj = await PickUp.findOne({ student: history[i].student.id, date: date, classObj: params.classId });
        if (pickUpObj && pickUpObj.time != '' && pickUpObj.parent) isPickUp = true;
      }

      history[i].isAttendent = isAttendent;
      history[i].isPickUp = isPickUp;

      delete history[i].id;
      delete history[i].createAt;
      delete history[i].updateAt;
      delete history[i].status;
      delete history[i].time;
      delete history[i].parent;
      delete history[i].note;
    }

    return res.json(history);
    
  },

  historyGet: async (req, res) => {
    sails.log.info("================================ MobileAttendentController.history => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    
    // REQUIRED FIELDS
    if (!params.classId) return res.badRequest(ErrorMessages.ATTENDENT_ERR_CLASSID_REQUIRED);
    if (!params.studentId) return res.badRequest(ErrorMessages.ATTENDENT_ERR_STUDENTID_REQUIRED);
    if (!params.date) return res.badRequest(ErrorMessages.ATTENDENT_DATE_REQUIRED);

    // VALIDATE DATE
    let date = moment(params.date).format("YYYY-MM-DD");
    if (date == 'Invalid date') {
      return res.badRequest(ErrorMessages.ATTENDENT_DATE_INVALID);
    }

    let attendentObj = await Attendent.findOne({ student: params.studentId, date: date, classObj: params.classId }).populate('student').populate('parent');
    if (!attendentObj) return res.badRequest(ErrorMessages.NO_DATA_ATTENDENT);

    let pickUpObj = await PickUp.findOne({ student: params.studentId, date: date, classObj: params.classId }).populate('parent');

    return res.json({ attendent: attendentObj, pickUp: pickUpObj });
  },



};
