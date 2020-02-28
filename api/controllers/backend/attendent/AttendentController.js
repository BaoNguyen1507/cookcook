/**
 * Attendent Controller
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const ErrorMessages = require('../../../../config/errors');
const AttendentService = require('../../../services/AttendentService');
const moment = require('moment');
const _ = require('lodash');

const renderDataTable = async (attendentArray, params, dateAttendent) => {

  let resAttendents = [];
  for (let attendentItem of attendentArray) {
    let tmpData = {};
    // CODE STUDENT
    tmpData.code = attendentItem.student.code;
    // AVATAR & FULLNAME
    let studentPath = "";
    if (attendentItem.student.avatar && attendentItem.student.avatar != "") {
      studentPath = attendentItem.student.avatar;
    } else if (attendentItem.student.gender == 0) {
      studentPath = "/images/female-kid.png";
    } else {
      studentPath = "/images/male-kid.png";
    }
    tmpData.student =
      `<div class="d-flex align-items-center">
        <img src="${studentPath}" alt="profile" class="img-sm rounded-circle">
        <h6>${attendentItem.student.firstName + ' ' + attendentItem.student.lastName}</h6>
      </div>`;
    tmpData.time = `<p class="text-center">${attendentItem.time == '' ? '-' : attendentItem.time}</p>`;

    if (!attendentItem.parent) {
      tmpData.parent = `<p class="text-center">${attendentItem.note}</p>`
    } else {
      let parentPath = '';
      if (attendentItem.parent.avatar && attendentItem.parent.avatar != '') {
        parentPath = attendentItem.parent.avatar;
      } else if (attendentItem.parent.gender == 0) {
        parentPath = '/images/female.png';
      } else {
        parentPath = '/images/male.png';
      }
      tmpData.parent = !attendentItem.parent ? `<p class="text-center">-</p>` :
        `<div class="media">
          <div class="pr-10">
            <img class="mr-3 img-sm rounded-circle" src="${parentPath}" alt="${attendentItem.parent.firstName + ' ' + attendentItem.parent.lastName}">
          </div>
          <div class="media-body">
            <h5>${attendentItem.parent.firstName + ' ' + attendentItem.parent.lastName}</h5>
            <i class="mdi mdi-cellphone-iphone"></i>
            <span>${attendentItem.parent.phone}</span>
          </div>
        </div>`;
    }

    tmpData.arrParent = attendentItem.arrParent;
    tmpData.tool = `<button type="button" class="btn btn-primary btn-attendent" data-toggle="modal" data-target="#updateAttendent" data-backdrop="static" data-keyboard="false" data-attendentId=${attendentItem.id}>` + sails.__("Update") + `</button>`;
    tmpData.status = 
      `<label class="switch">
        <input class="checkIn" type="checkbox" value="${attendentItem.id}">
        <span class="slider"></span>
      </label>`
    if (attendentItem.status == 1) {
      tmpData.status = `<label class="switch">
        <input class="checkIn" type="checkbox" checked value="${attendentItem.id}">
        <span class="slider"></span>
      </label>`
    }
    resAttendents.push(tmpData);
  }
  let totalAttendent = await AttendentService.count({ classObj: params.classId, date : dateAttendent });
  // RETURN DATA ATTENDENT EXIST
  let respData = { recordsTotal: totalAttendent, recordsFiltered: totalAttendent, data: resAttendents, dataOrigin: attendentArray }
  return respData;
}

module.exports = {

  // pushNotification: async (req, res) => {
  //   sails.log.info("================================ AttendentController.pushNotification => START ================================");
  //   // GET ALL PARAMS
  //   const params = req.allParams();

  //   if (!params.classID) return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);
  //   if (!params.dateAttendent) return res.badRequest(ErrorMessages.ATTENDENT_DATE_REQUIRED);

  //   let settingForApp = await Setting.findOne({ key: 'app' });
  //   if (settingForApp && settingForApp.value && settingForApp.value.notificationAttendent == true) {

  //     let attendent = await AttendentService.get({ dateAttendent: params.dateAttendent, classObj: params.classID });
  //     if (!attendent) return res.badRequest(ErrorMessages.ALBUM_OBJECT_NOT_FOUND);
  
  //     /** get all student of class */
  //     let allStudent_Class = await Student_Class.find({ classObj: params.classID });
  //     let allStudentID = allStudent_Class.map((item) => {
  //       return item.student;
  //     })
  
  
  //     //send noti to parent of each student
  //     for (let studentID of allStudentID) {
  //       let allStudent_Parent = await Student_Parent.find({ student: studentID });
  //       let allParentID = [];
  
  //       //get all parent of student
  //       for (let student_parent of allStudent_Parent) {
  //         allParentID.push(student_parent.parent);
  //       }
  
  //       //get student obj to get full name
  //       let studentObj = await Student.findOne({ id: studentID });
  
  //       //create data notification depend on student absence or not
  //       let dataNotification = {};
  //       if (!attendent.absenceList.includes(studentID)) {
  //         dataNotification = {
  //           title: sails.__('Student %s %s is present in class!', studentObj.firstName, studentObj.lastName),
  //           message: sails.__('Student %s %s is present in class!', studentObj.firstName, studentObj.lastName),
  //           status: sails.config.custom.STATUS.ACTIVE,
  //           type: sails.config.custom.TYPE.ATTENDENT,
  //           classList: []
  //         }
  //       } else {
  //         dataNotification = {
  //           title: sails.__('Student %s %s is absent today!', studentObj.firstName, studentObj.lastName),
  //           message: sails.__('Student %s %s is absent today!', studentObj.firstName, studentObj.lastName),
  //           status: sails.config.custom.STATUS.ACTIVE,
  //           type: sails.config.custom.TYPE.ATTENDENT,
  //           classList: []
  //         }
  //       }
  
  //       //create notification and send push noti
  //       let notification = await NotificationService.add(dataNotification);
  //       await NotificationService.pushFirebase(notification, allParentID, []);
  //     }
  //   }

  //   return res.ok({ message: 'ok' });
  // },

  checkExisted: async (req, res) => {
    sails.log.info("================================ AttendentController.checkExisted => START ================================");
    // CHECK SESSION
    if (!req.me) return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : 0;
    let draw = params.draw ? parseInt(params.draw) : 1;
    // CHECK PARAM CLASS ID & DATE
    if (!params.classId) {
      return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);
    } else if (!params.date) {
      return res.badRequest(ErrorMessages.ATTENDENT_DATE_REQUIRED);
    }
    // VALIDATE DATE
    let dateAttendent = '';
    let date = moment(params.date, "DD-MM-YYYY").format("YYYY-MM-DD");
    if (date == 'Invalid date') {
      return res.badRequest(ErrorMessage.ATTENDENT_DATE_INVALID)
    } else {
      dateAttendent = date;
    }
    let todayAttendent = [];

    if (params.branchId && params.classId == '0') {
      let classArr = await ClassService.find({ branch: params.branchId });
      for (let classObj of classArr) {
        let arrAttendent = await Attendent.find({ where: { date: dateAttendent, classObj: classObj.id }, limit: limit, skip: skip });
        for (let attendentObj of arrAttendent){
          todayAttendent.push(attendentObj);
        }
      }
    } else {
       //check attendent is existed?
    todayAttendent = await Attendent.find({ where: { date: dateAttendent, classObj: params.classId }, limit: limit, skip: skip });
    }

    //get student of class
    let student_class = await Student_Class.find({ classObj: params.classId });
    let studentIds = student_class.map(item => item.student);

    //create attendentdata if not existed
    if (todayAttendent.length == 0) {

      //create attendent data for today
      for (let studentId of studentIds) {
        let attendentRecord = {
          student: studentId,
          date: dateAttendent,
          classObj: params.classId
        };
        let obj = await AttendentService.add(attendentRecord);
        todayAttendent.push(obj);
      }
    }

    /************************* get all student who name contain search if have search value ************/
    if (typeof keyword === "string" && keyword.length > 0) {
    let where = {};
      where = {
        $or: [
          { firstName: { $regex: keyword, $options: 'i' }},
          { lastName: { $regex: keyword, $options: 'i' }},
        ]
      } 
      
      let mongo = require('mongodb');
      
      //get students form class 
      let studentIDs = studentIds.map((stdId) => {
        return new mongo.ObjectID(stdId);
      })
      
      where.$and = [
        { status: params.status ? parseInt(params.status) : 1 },
        { _id : { $in : studentIDs } }
      ];
      
      /**SEARCH CASE_INSENSITIVE */
      const collection = Student.getDatastore().manager.collection(Student.tableName);
      let result = await collection.find(where);
      const dataWithObjectIds = await result.toArray();
      const arrStudent = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));

      studentIds = arrStudent.map(item => item.id);

      todayAttendent = todayAttendent.filter(item => studentIds.includes(item.student));
    }
      /************************* get all student who name contain search ************/


    let todayAttendentWithRelation = [];
    for (let attendent of todayAttendent) {
      let obj = await Attendent.findOne({ id: attendent.id }).populate('student').populate('classObj').populate('parent');
      todayAttendentWithRelation.push(obj);
    }
    // Check order
    let attendentSorted = [];
    if (params.order) {
      if (params.columns[params.order[0].column].data == 'student') {
        let dir = params.order[0].dir;
        attendentSorted = _.orderBy(todayAttendentWithRelation, [(item) => {
          return item.student.firstName;
        }], [dir]);
      }
    } else {
      attendentSorted = _.orderBy(todayAttendentWithRelation, ['createdAt'], ['desc']);
    }

    let attendentPrepared = [];
    for (let attendentItem of attendentSorted) {
      // GET LIST PARENT OF STUDENT
      let relationStudentParent = await Student_Parent.find({ student: attendentItem.student.id }).populate('parent');
      let arrParent = [];
      _.each(relationStudentParent, (relationItem) => {
        let objParent = {};
        objParent.id = relationItem.parent.id;
        objParent.fullName = relationItem.parent.firstName + ' ' + relationItem.parent.lastName;
        objParent.phone = relationItem.parent.phone;
        objParent.avatar = relationItem.parent.avatar;
        objParent.gender = relationItem.parent.gender;
        arrParent.push(objParent)
      });
      attendentItem.arrParent = arrParent;
      attendentPrepared.push(attendentItem);
    }
    let data = await renderDataTable(attendentPrepared, params, dateAttendent);
    data.draw = draw;
    // RETURN DATA ATTENDENT EXIST
    return res.ok(data);
  },

  get: async (req, res) => {
    sails.log.info("================================ AttendentController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) {
      return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    }
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
      objParent.fullName = relationItem.parent.firstName + ' ' + relationItem.parent.lastName;
      objParent.phone = relationItem.parent.phone;
      arrParent.push(objParent)
    })
    attendentObj.arrParent = arrParent;
    // RETURN DATA COURSE SESSION
    return res.json(attendentObj);
  },

  checkIn: async (req, res) => { //USE IN CASE SHUTTLE PERSON INFO IS OFF
    sails.log.info("================================ AttendentController.checkIn => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    
    // GET OBJ
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
    // END UPDATE
  },

  edit: async (req, res) => { //USE IN CASE SHUTTLE PERSON INFO IS ON
    sails.log.info("================================ AttendentController.edit => START ================================");
    // GET ALL PARAMS
    // if (!req.me) {
    //   return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    // }
    const params = req.allParams();
    // CHECK PARAMS
    if (!params.id) {
      return res.badRequest(ErrorMessages.ATTENDENT_ID_REQUIRED);
    }else if (!params.time) {
      return res.badRequest(ErrorMessages.ATTENDENT_TIME_REQUIRED);
    } else if (params.parent == '' && (!params.note || !params.note.trim().length)) {
      return res.badRequest(ErrorMessages.ATTENDENT_NOTE_REQUIRED);
    }
    
    // CHECK ID PICK UP EXIST
    const attendentObj = AttendentService.get({ id: params.id });
    if (!attendentObj) {
      return res.notFound(ErrorMessages.ATTENDENT_NOT_FOUND);
    }
    // CREATE DATA FOR UPDATE
    let attendentRecord = {
      status: sails.config.custom.STATUS.ATTENDANT,
      time: params.time,
      note: params.note
    };
    if (params.parent != '') attendentRecord.parent = params.parent;
    // UPDATE DATA PICK UP
    const editedObj = await AttendentService.edit({ id: params.id }, attendentRecord);

    // RETURN DATA EDITED 
    return res.json(editedObj);
  },

}
