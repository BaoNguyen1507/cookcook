/**
 * ClassController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */
const ErrorMessages = require('../../../../config/errors');
const ClassService = require('../../../services/ClassService');
// const MessageService = require('../../services/MessageService');
// const MessageDataService = require('../../services/MessageDataService');
//Library
const moment = require('moment');

module.exports = {

  add: async (req, res) => {
    sails.log.info("================================ ClassController.add => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK TITTLE & CODE CLASS PARAMS
    if (!params.title) return res.badRequest(ErrorMessages.CLASS_TITLE_REQUIRED);
    if (!params.code) return res.badRequest(ErrorMessages.CLASS_CODE_REQUIRED);
    if (!params.courseSession) return res.badRequest(ErrorMessages.CLASS_COURSE_SESSION_REQURIED);

    //  CHECK SDKCLASS EXIST
    const foundCodeClass = await ClassService.find({
      code: params.code
    });

    if (foundCodeClass.length) {
      return res.badRequest(ErrorMessages.CLASS_CODE_EXISTED);
    }
    //CHECK DUPLICATE CODE
    const checkCode = await Class.findOne({ code: params.code });
    if (checkCode) return res.ok({
      message: ErrorMessages.CLASS_CODE_DUPLICATED.message
    });
    // PREPARE DATA CLASS
    const newData = {
      title: params.title, // REQUIRED
      code: params.code, // REQUIRED
      totalStudent: params.totalStudent ? parseInt(params.totalStudent) : 0,
      teachers: params.teachers,
      thumbnail: params.thumbnail ? parseInt(params.thumbnail) : 1,
      courseSession: params.courseSession,
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      createdBy: req.session.userId
    };
    // ADD NEW DATA CLASS
    const newClass = await ClassService.add(newData);
    // RETURN DATA CLASS
    return res.ok(newClass);
  },

  get: async (req, res) => {
    sails.log.info("================================ ClassController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK PARAM
    if (!params.id) return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);

    // QUERY & CHECK DATA CLASS
    const classObj = await ClassService.get({
      id: params.id
    });
    if (!classObj) {
      return res.notFound(ErrorMessages.CLASS_OBJECT_NOT_FOUND);
    }
    // RETURN DATA CLASS
    return res.ok(classObj);
  },

  edit: async (req, res) => {
    sails.log.info("================================ ClassController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK TITTLE & CODE CLASS PARAMS
    if (!params.title) return res.badRequest(ErrorMessages.CLASS_TITLE_REQUIRED);
    if (!params.code) return res.badRequest(ErrorMessages.CLASS_CODE_IS_REQUIRED);
    if (!params.courseSession) return res.badRequest(ErrorMessages.CLASS_COURSE_SESSION_REQURIED);

    // Count Total student in class
    let totalStudent = await Student_Class.count({ classObj: params.id });

    let teachers = params.teachers;
    //CHECK DUPLICATE CODE
    const checkCode = await Class.findOne({ code: params.code });
    if (checkCode) {
      if(checkCode.id != params.id) {
        return res.ok({
          message: ErrorMessages.CLASS_CODE_DUPLICATED.message
        });
      }
    }
    // PREPARE DATA CLASS
    const newData = {
      title: params.title, // REQUIRED
      totalStudent: totalStudent,
      code: params.code, // REQUIRED
      thumbnail: params.thumbnail ? parseInt(params.thumbnail) : 1,
      courseSession: params.courseSession,
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      createdBy: req.session.userId
    };

    // CHECK DATA CLASS
    const classObj = ClassService.get({
      id: params.id
    });
    if (!classObj) {
      return res.notFound(ErrorMessages.CLASS_OBJECT_NOT_FOUND);
    }

    // UPDATE DATA CLASS
    const editObj = await ClassService.edit({
      id: params.id
    }, newData);

    if (teachers) {
      await Class.replaceCollection(editObj.id, 'teachers', teachers).exec(function (err) { });
    }

    // RETURN DATA CLASS
    return res.json({
      data: editObj
    });
  },

  trash: async (req, res) => {
    sails.log.info("================================ ClassController.trash => START ================================");
    // GET ALL PARAMS
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);

    let deleteClassFromRelations = async (classIds) => {
      //delete from notification
      let notifications = await Notifications.find({});
      if (notifications && notifications.length > 0) {
        for (let notificationObj of notifications) {
          if (notificationObj.classList && notificationObj.classList != -1 && notificationObj.classList.length > 0) {
            //remove subject which deleted from slotSubject of notification
            let newClassList = notificationObj.classList.filter(item => !classIds.includes(item));
            //update newClassList for notification
            if (newClassList.length != notificationObj.classList.length) {
              await Notifications.update({ id: notificationObj.id }, { classList: newClassList });
            }
          }
        }
      }

      //delete from schedule
      await Schedule.destroy({ classes: { in: classIds } });

      //delete from menu
      await Menu.destroy({ class: { in: classIds } });

    }

    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        //ALWAYS CHECK  OBJECT EXIST
        let classObj = await ClassService.get({ id: ids[i] });
        if (classObj) ClassService.del({ id: ids[i] });
      }

      deleteClassFromRelations(ids);
    } else {
      let classObj = await ClassService.get({ id: ids });
      if (classObj) ClassService.del({ id: ids });

      deleteClassFromRelations([ids])
    }
    return res.ok();
  },

  search: async (req, res) => {
    sails.log.info("================================ ClassController.search => START ================================");
    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
    //prepared order param
    // let sort = null;
    let newSort = {};
    if ( params.order ) {
      let objOrder = {};
      objOrder[params.columns[params.order[0].column].data] = params.order[0].dir ;
      // sort = [objOrder];
      for(var key in objOrder){
        if(objOrder[key] == 'desc'){
          //code here
          newSort[key] = -1; 
        } else {
          newSort[key] = 1;
        }
      }
    } else {
      newSort = { createdAt: -1 };
    }

    let where = {};
    if (typeof keyword === "string" && keyword.length > 0) {
      where = {
        $or: [
          { title: { $regex: keyword, $options: 'i' }},
          { code: { $regex: keyword, $options: 'i' }},
        ]
      } 
    }

    let mongo = require('mongodb');

    where.$and = [
      { status: params.status ? parseInt(params.status) : 1 }
    ];

    /**SEARCH CASE_INSENSITIVE */
    const collection = Class.getDatastore().manager.collection(Class.tableName);
    let result = [];
    if (params.length && params.start) {
      result = await collection.find(where).limit(limit).skip(skip).sort(newSort);
    } else {
      result = await collection.find(where).sort(newSort);
    }
    const totalClass = await collection.count(where);
    const dataWithObjectIds = await result.toArray();
    const arrClassObj = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));

    // let arrClassObj = await ClassService.find(where, limit, skip, sort);
    let resClasses = [];
    for (let objClass of arrClassObj) {
      let classObj = await Class.findOne({id: objClass.id}).populate('teachers').populate('courseSession');//populate('tuitions);
      let tmpData = {};
      tmpData.id = `<input class="js-checkbox-item" type="checkbox" value="${classObj.id}">`;
      tmpData.tool = await sails.helpers.renderRowAction(classObj);
      tmpData.title = classObj.title + " (" + classObj.code + ")";
      tmpData.totalStudent = classObj.totalStudent;
      tmpData.courseSession = classObj.courseSession ? classObj.courseSession.title : `<p class="text-center">-</p>`;
      
      if (classObj.status == 1) {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${classObj.id}" checked>
            <span class="slider"></span>
          </label>`;
      } else {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${classObj.id}">
            <span class="slider"></span>
          </label>`;
      }
      resClasses.push(tmpData);
    };
    // let totalClass = await ClassService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalClass, recordsFiltered: totalClass, data: resClasses });
  },
  
  switchStatus: async (req, res) => {
    sails.log.info("================================ ClassController.switchStatus => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);

    //CHECK OBJ IS EXISTED?
    let classObj = await ClassService.get({ id: params.id });
    if (!classObj) return res.badRequest(ErrorMessages.CLASS_OBJECT_NOT_FOUND);

    //switch status of current obj
    if (classObj.status == 1) classObj = await ClassService.edit({ id: params.id }, { status: 0 });
    else classObj = await ClassService.edit({ id: params.id }, { status: 1 });

    return res.json(classObj);
    // END UPDATE
  },
};
