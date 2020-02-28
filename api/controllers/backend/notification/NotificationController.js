/**
 * Notification/NotificationController
 *
 * @description :: Server-side logic for managing notification/taxonomies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const ErrorMessages = require('../../../../config/errors');
const rp = require('request-promise');
const NotificationService = require('../../../services/NotificationService');

module.exports = {

  add: async (req, res) => {
    // GET ALL PARAMS
    const params = req.allParams();

    if (!params.title || !params.title.trim().length) {
      return res.badRequest(NotificationError.ERR_TITLENOTE_REQUIRED);
    }
    console.log('params.noteType', params.noteType);
    let _noteType = '';
    // if (params.noteType) {
    //   let count = 0;
    //   if (params.noteType.teacher) {
    //     count++;
    //     _noteType += sails.config.custom.TYPE.TEACHER + '|';
    //   }
    //   if (params.noteType.bgh) {
    //     count++;
    //     _noteType += sails.config.custom.TYPE.BGH + '|';
    //   }
    //   if (params.noteType.parent) {
    //     count++;
    //     _noteType += sails.config.custom.TYPE.STAFF + '|';
    //   }

    //   _noteType = (count == 3 ? sails.config.custom.TYPE.ALL : (count == 1 ? _nodeType.replace('|', '') : _noteType));
    // }

    // let Classes = await Class.find({id: params.classes}).populate('students');
    // let students=[];
    // let parents=[];
    // for(cls of Classes) {
    //   for(student of cls.students) {
    //     students.push(student.id);
    //   }
    // }
    // var Students = await Student.find({id: students}).populate('parents');
    // for(std of Students) {
    //   for(parent of std.parents) {
    //     parents.push(parent.id)
    //   }
      
    // }
    // var parentsIndex = _.uniq(parents);
    // PREPARE DATA NOTIFICATION
    let newData = {
       
      title: params.title, // REQUIRED
      message: params.message ? params.message : '',
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      classList: params.classList ? params.classList : -1,
      type: params.type ? parseInt(params.type) : -1
      //noteType: _noteType
    };

    // ADD NEW DATA NOTIFICATION
    let newNotification = await NotificationService.add(newData);
    
    // Check push to devices this notification
    // If status == publish => push
    // If status == draft => no push
    // START:
    // get user by noteType
    let _willPushPersons = [],
      _willPushNotifications = [];
    if (params.noteType) {
      let _willPushParents = null;
      let _willPushTeachers = null;
      if (params.noteType.parent) {
        _willPushParents = await Parent.find({
          allowNotification: true,
          status: sails.config.custom.STATUS.ACTIVE
        });
        if (_willPushParents) {
          _willPushPersons = _willPushPersons.concat(_willPushParents);
        }
      }
      if (params.noteType.teacher) {
        _willPushTeachers = await User.find({
          allowNotification: true,
          userType: sails.config.custom.TYPE.TEACHER,
          status: sails.config.custom.STATUS.ACTIVE
        });
        if (_willPushTeachers) {
          _willPushPersons = _willPushPersons.concat(_willPushTeachers);
        }
      }
    }
    // push to expo server
    if (_willPushPersons.length > 0) {
      _willPushPersons.forEach(async (person) => {
        console.log('_willPushPersons -> person', person);
        if (
          person.expoToken &&
          person.expoToken !== '' &&
          person.expoToken !== undefined &&
          person.allowNotification
        ) {
          _willPushNotifications.push({
            to: person.expoToken,
            sound: 'default',
            title: newNotification.title,
            body: newNotification.message,
            data: {
              title: newNotification.title,
              body: newNotification.message
            }
          });
        }
        if (person.allowNotification) {
          //add to collection
          if (person.userType != undefined) {
            await User.addToCollection(person.id, 'newNotifications').members([
              newNotification.id
            ]);
          } else {
            await Parent.addToCollection(person.id, 'newNotifications').members(
              newNotification.id
            );
          }
        }
      });
      //expo push notifications
      if (_willPushNotifications.length > 0) {
        var options = {
          method: 'POST',
          uri: 'https://exp.host/--/api/v2/push/send',
          body: _willPushNotifications,
          json: true // Automatically parses the JSON string in the response
        };
        rp(options)
          .then(parsedBody => {
            // POST succeeded...
            sails.log('parsedBody', parsedBody);
          })
          .catch(err => {
            // POST failed...
          });
      }
    }
    // END

    // RETURN DATA NOTIFICATION
    return res.ok(newNotification);
  },

  edit: async (req, res) => {
    sails.log.info("================================ NotificationController.edit => START ================================");
    const params = req.allParams();
    if (req.method === 'GET') {
      return res.json({ 'status': 'GET not allowed' });
    }

    // CHECK TITTLE & MESSAGE NOTIFICATION PARAMS
    if (!params.id) return res.badRequest(ErrorMessages.NOTIFICATION_ID_REQUIRED);
    if (!params.title) return res.badRequest(ErrorMessages.NOTIFICATION_TITLE_REQUIRED);
    if (!params.message) return res.badRequest(ErrorMessages.NOTIFICATION_MESSAGE_REQUIRED);

    let noti = await NotificationService.get({ id: params.id });
    if (!noti) return res.badRequest(ErrorMessages.NOTIFICATION_NOT_FOUND);

    let status = params.status ? parseInt(params.status) : noti.status;
    let type = params.type ? parseInt(params.type) : noti.type;
    let newData = {
      title: params.title,
      message: params.message,
      status: status,
      type: type,
      classList : params.classList ? params.classList : -1
    }

    let editNotification = await NotificationService.edit(params.id, newData);

    return res.ok(editNotification);
  },

  get: async (req, res) => {
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK ID PARAM
    if (!params.id) {
      return res.badRequest(ErrorMessages.NOTIFICATION_ID_REQUIRED);
    }

    // QUERY & CHECK DATA NOTIFICATION
    const notification = await NotificationService.get({
      id: params.id
    });
    if (!notification) {
      return res.badRequest(ErrorMessages.NOTIFICATION_NOT_FOUND);
    }

    // RETURN DATA NOTIFICATION
    return res.ok(notification);
  },

  trash: async (req, res) => {
    sails.log.info("================================ NotificationController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorMessages.NOTIFICATION_ID_REQUIRED);
    // Call constructor with custom options:
    // let data = { status: sails.config.custom.STATUS.TRASH };
    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }

    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let notification = await NotificationService.get({ id: ids[i] });
        if (notification) NotificationService.del({ id: ids[i] });
        // let notification = await NotificationService.get({ id: ids[i] });
        // if (notification && notification.status == data.status) {
        //   NotificationService.del({ id: ids[i] });
        // } else if (notification) {
        //   await Notifications.update({ id: ids[i] }).set({ status: data.status });
        // }
      }
    } else {
      let notification = await NotificationService.get({ id: ids });
      if (notification) NotificationService.del({ id: ids });
      // let notification = await NotificationService.get({ id: ids });
      // if (notification && notification.status == data.status) {
      //   NotificationService.del({ id: ids });
      // } else if (notification) {
      //   await Notifications.update({ id: ids }).set({ status: data.status });
      // }
    }
    // RETURN DATA
    return res.json({ status: 1 });

  },

  info: async (req, res) => {
    let notification = await Notification.info(req.param('id'));
    return res.json(notification);
  },

  total: async (req, res) => {
    let type = req.param('type');
    let totals = 0;
    totals = await Notification.total({ cond: { type: type } });
    return res.json({ totals: totals });
  },

  push: async (req, res) => {
    let _ids = req.param('ids');
    await sails.helpers.expoPushNotifications.with({
      notificationIds: _ids
    });

    //set notification status complete
    let totals = await Notification.push({ ids: req.param('ids') });

    return res.json({ totals: totals });
  },

  search: async (req, res) => {
    sails.log.info("================================ NotificationController.search => START ================================");
    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
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
        ]
      } 
    }

    where.$and = [
      { status: params.status ? parseInt(params.status) : 1 },
      { type: params.type ? parseInt(params.type) : { $in: [-1, 0] } }
    ];

    /**SEARCH CASE_INSENSITIVE */
    const collection = Notifications.getDatastore().manager.collection(Notifications.tableName);
    let result = [];
    if (params.length && params.start) {
      result = await collection.find(where).limit(limit).skip(skip).sort(newSort);
    } else {
      result = await collection.find(where).sort(newSort);
    }
    const totalNotification = await collection.count(where);
    const dataWithObjectIds = await result.toArray();
    const arrObjNotifications = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));

    //find only active status
    // let status = (params.status) ? parseInt(params.status) : 1;
    // let type = (params.type) ? parseInt(params.type) : 0;
    // let where = {};
    // //IF status = -1 => SEARCH ALL
    // if (status != -1) {
    //   where = { status: status, type: type };
    // }
    // //END IF STATUS
    // //IF TITLE !='' => SEARCH STRING
    // if (typeof title === "string" && title.length > 0) {
    //   where = {
    //     or: [
    //       { title: { contains: title } }
    //     ],
    //     status: status,
    //     type: type
    //   };
    // }
    //END IF TITLE

    // let arrObjNotifications = await NotificationService.find(where, limit, skip, sort);
    let resNotifications = [];
    for (let notification of arrObjNotifications) {
      let tmpData = {};
      var classList = '';
      //load list class of notification
      if(notification.classList == -1) {
        classList = '-'
      } else {
        let Classes = await Class.find({id: notification.classList});
        for(let i = 0; i < Classes.length; i++)
        {
          if(i == Classes.length - 1)
          {
            classList += Classes[i].title;
            break;
          }
          classList += Classes[i].title + ', ';
        }
      }
      tmpData.id = '<input class="js-checkbox-item" type="checkbox" value="' + notification.id + '">';
      tmpData.code = notification.code;
      tmpData.title = notification.title;
      if(notification.status == 1 || notification.status == 0 ) {
        notification.isNotification = true;
      }
      tmpData.tool = await sails.helpers.renderRowAction(notification);
      
      
      tmpData.message = notification.message;
      if (notification.status == 0) {
        tmpData.status = '<label class="badge badge-warning">' + sails.__("Draft") + '</label>';
      } else {
        tmpData.status = '<label class="badge badge-success">' + sails.__("Active") + '</label>';
      }
      tmpData.class = classList;
      resNotifications.push(tmpData);
    };
    // let totalNotification = await NotificationService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalNotification, recordsFiltered: totalNotification, data: resNotifications });
  },

  pushFirebase: async (req, res) => {
    sails.log.info("================================ NotificationController.pushFirebase => START ================================");
    let params = req.allParams();

    if (!params.id) return res.badRequest(ErrorMessages.NOTIFICATION_ID_REQUIRED);

    let notification = await NotificationService.get({ id: params.id });
    if (!notification) return res.badRequest(ErrorMessages.NOTIFICATION_NOT_FOUND);

    //update status if push notification
    notification = await NotificationService.edit({ id: params.id }, { status: 1 });

    let allParentId = [];
    let allParent = [];
    let allTeacherId = [];
    let allTeacher = [];

    //get all class of notification
    //get all student of class
    //get all parent of student
    if (Array.isArray(notification.classList)) {//if classList is array
      if (notification.classList && notification.classList.length > 0) {
        for (let classId of notification.classList) {

          //just push noti to parent if noti is public news
          if (notification.type == 0) {
            /** get all parentId of classList */
            let allStudent_Class = await Student_Class.find({ classObj: classId });
            // let allStudentId = [];
  
            // for (let student_class of allStudent_Class) {
            //   allStudentId.push(student_class.student);
            // }
  
            let allStudentId = allStudent_Class.map((item) => {
              return item.student;
            })
  
            for (let studentId of allStudentId) {
              let allStudent_Parent = await Student_Parent.find({ student: studentId });
  
              for (let student_parent of allStudent_Parent) {
                //just push parentId is not exist
                if (!allParentId.includes(student_parent.parent))
                  allParentId.push(student_parent.parent);
              }
            }
          }

          /**get all teacherId of classList */
          let allTeacher_Class = await Teacher_Class.find({ classObj: classId });
          for (let teacher_class of allTeacher_Class) {
            //just push teacherId is not exist
            if (!allTeacherId.includes(teacher_class.teacher))
              allTeacherId.push(teacher_class.teacher);
          }
        }
      }

      /**create notification for parent */
      // if (allParentId.length > 0) {
      //   for (let parentId of allParentId) {
      //     //get parent object to get fcmToken
      //     let parentObj = await Parent.findOne({ id: parentId });
      //     allParent.push(parentObj);

      //     //add notification_parent into db to check is parent read notification
      //     let newData = {
      //       parent: parentId,
      //       notification: params.id
      //     }
          
      //     //if relation is not exist => add to database
      //     let isExist = await Notification_Parent.findOne(newData);
      //     if (!isExist) {
      //       newData.isRead = false;
      //       await Notification_Parent.create(newData);
      //     }
      //   }
      // }

      /**create notification for teacher */
      // if (allTeacherId.length > 0) {
      //   for (let teacherId of allTeacherId) {
      //     //get teacher object to get fcmToken
      //     let teacherObj = await User.findOne({ id: teacherId });
      //     allTeacher.push(teacherObj);

      //     //add notification_user into db to check is teacher read notification
      //     let newData = {
      //       user: teacherId,
      //       notification: params.id
      //     }
          
      //     //if relation is not exist => add to database
      //     let isExist = await Notification_User.findOne(newData);
      //     if (!isExist) {
      //       newData.isRead = false;
      //       await Notification_User.create(newData);
      //     }
      //   }
      // }

    } else if (notification.classList == -1) { 
      //classList is -1 => send all class => send notification to all Parent

      //if type = public => send to parent
      if (notification.type == 0) {
        allParent = await Parent.find({});
        allParentId = allParent.map(item => item.id);
      }

      // for (let parent of allParent) {
      //   //add notification_parent into db to check is parent read notification
      //   let newData = {
      //     parent: parent.id,
      //     notification: params.id
      //   }

      //   //if relation is not exist => add to database
      //   let isExist = await Notification_Parent.findOne(newData);
      //   if (!isExist) {
      //     newData.isRead = false;
      //     await Notification_Parent.create(newData);
      //   }
      // }

      //classList == -1 ? send all teacher
      allTeacher = await User.find({ userType: 1 }); //get all teacher
      allTeacherId = allTeacher.map(item => item.id);
      // for (let teacher of allTeacher) {
      //   //add notification_user into db to check is teacher read notification
      //   let newData = {
      //     user: teacher.id,
      //     notification: params.id
      //   }
        
      //   //if relation is not exist => add to database
      //   let isExist = await Notification_User.findOne(newData);
      //   if (!isExist) {
      //     newData.isRead = false;
      //     await Notification_User.create(newData);
      //   }
      // }
    }

    //send notification
    await NotificationService.pushFirebase(notification, allParentId, allTeacherId);

    // let idsToken = [];

    // //get all token of all parent
    // if (allParent.length > 0) {
    //   for (let i = 0; i < allParent.length; i++) {
    //     if (allParent[i].allowNotification) {
    //       if (allParent[i].hasOwnProperty('fcmTokeniOS')) {
    //         if (allParent[i].fcmTokeniOS && allParent[i].fcmTokeniOS.length > 0) {
    //           for (let j = 0; j < allParent[i].fcmTokeniOS.length; j++) {
    //             idsToken.push(allParent[i].fcmTokeniOS[j]);
    //           }
    //         }
    //       }
  
    //       if (allParent[i].hasOwnProperty('fcmTokenAndroid')) {
    //         if (allParent[i].fcmTokenAndroid && allParent[i].fcmTokenAndroid.length > 0) {
    //           for (let j = 0; j < allParent[i].fcmTokenAndroid.length; j++) {
    //             idsToken.push(allParent[i].fcmTokenAndroid[j]);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // //get all token of all teacher
    // if (allTeacher.length > 0) {
    //   for (let i = 0; i < allTeacher.length; i++) {
    //     if (allTeacher[i].allowNotification) {
    //       if (allTeacher[i].hasOwnProperty('fcmTokeniOS')) {
    //         if (allTeacher[i].fcmTokeniOS && allTeacher[i].fcmTokeniOS.length > 0) {
    //           for (let j = 0; j < allTeacher[i].fcmTokeniOS.length; j++) {
    //             idsToken.push(allTeacher[i].fcmTokeniOS[j]);
    //           }
    //         }
    //       }
  
    //       if (allTeacher[i].hasOwnProperty('fcmTokenAndroid')) {
    //         if (allTeacher[i].fcmTokenAndroid && allTeacher[i].fcmTokenAndroid.length > 0) {
    //           for (let j = 0; j < allTeacher[i].fcmTokenAndroid.length; j++) {
    //             idsToken.push(allTeacher[i].fcmTokenAndroid[j]);
    //           }
    //         }
    //       }
    //     }
    //   }
    // }

    // //send notification for parent and techer
    // if (idsToken.length > 0) {
    //   let fcm = new FCM(SERVER_KEY);

    //   let message = {
    //     registration_ids: idsToken,

    //     notification: {
    //       title: notification.title,
    //       body: notification.message
    //     },
        
    //     data : notification
    //   };

    //   fcm.send(message, function (err, response) {
    //     if (err) {
    //       console.log("Something has gone wrong!");
    //     } else {
    //       console.log('Successfully');
    //     }
    //   });
    // }
    // sails.log.info("================================ NotificationController.pushFirebase => idsToken ================================");
    // console.log("================================ NotificationController.pushFirebase => idsToken ================================");
    // console.log(idsToken);

    return res.ok(notification);
  },
};