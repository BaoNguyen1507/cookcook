/**
 * ScheduleController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


//Library
const moment = require('moment');
const ErrorMessages = require('../../../../config/errors');
const ScheduleService = require('../../../services/ScheduleService');

module.exports = {

  add: async (req, res) => {
    // sails.log.info("================================ ScheduleController.add => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    let classID = params.classId;
    let slotSubjects = params.slotSubjects;
    let currDate = moment().format("YYYY-MM-DD");
    let dateStart = params.dateUseStart ? params.dateUseStart : currDate;
    let dateEnd = params.dateUseEnd ? params.dateUseEnd : currDate;
    let repeat = params.repeat ? params.repeat : false;
    let daysOnWeek = params.daysOnWeek ? params.daysOnWeek : [];
    let status = params.status ? parseInt(params.status) : 1;

    let createOrEdit = async (dateUse) => { //create or update schedule with specific dateUse
      const schedule = await Schedule.findOne({
        dateUse: dateUse, class: classID
      });
      const newData = {
        slotSubjects: slotSubjects,
        dateUse: dateUse,
        status: status,
        class: classID
      };
      let newSchedule = {};
      if (schedule) {
        //return res.ok(ErrorMessages.SCHEDULE_EXISTED)
        newSchedule = await ScheduleService.edit({ id: schedule.id }, newData);
      } else {
        newSchedule = await ScheduleService.add(newData);
      }

      return newSchedule;
    }

    if (repeat) {
      //add schedule for next daysOnWeek from now in range of time
      if (daysOnWeek && daysOnWeek.length > 0) {
        for (let day of daysOnWeek) {

          let tmp = moment(dateStart).clone().day(parseInt(day));

          if( tmp.isAfter(dateStart, 'd') ){
            let dateUse = tmp.format('YYYY-MM-DD');
            await createOrEdit(dateUse);
          }
          //check if date is before dateEnd
          while( tmp.isBefore(moment(dateEnd)) ){
            tmp.add(7, 'days');
            let dateUse = tmp.format('YYYY-MM-DD');
            await createOrEdit(dateUse);
          }

        }
      }
    } else {
      //add schedule for next daysOnWeek from now
      if (daysOnWeek && daysOnWeek.length > 0) {
        for (let day of daysOnWeek) {
          const today = moment().isoWeekday();

          // if haven't yet passed the day of the week that I need:
          if (today <= day) { 
            // then just give this week's instance of that day
            let dateUse = moment().isoWeekday(parseInt(day)).format('YYYY-MM-DD');
            await createOrEdit(dateUse);
          } else {
            // otherwise, give *next week's* instance of that same day
            let dateUse = moment().add(1, 'weeks').isoWeekday(parseInt(day)).format('YYYY-MM-DD');
            await createOrEdit(dateUse);
          }
        }
      }
    }

    return res.ok();

    // let duration = moment(dateEnd).diff(moment(dateStart), 'days');

    // //Add schedule for one day
    // if ( duration == 0) {
    //   // CHECK DATA SCHEDULE
    //   //Add schedule for one day, if schedule is existed => update schedule
    //   const schedule = await Schedule.findOne({
    //     dateUse: dateStart, class: classID
    //   });
    //   const newData = {
    //     slotSubjects: slotSubjects,
    //     dateUse: dateStart,
    //     status: status,
    //     class: classID
    //   };
    //   let newSchedule = {};
    //   if (schedule) {
    //     //return res.ok(ErrorMessages.SCHEDULE_EXISTED)
    //     newSchedule = await ScheduleService.edit({ id: schedule.id }, newData);
    //   } else {
    //     newSchedule = await ScheduleService.add(newData);
    //   }
    //   return res.ok(newSchedule);
    // } else {
    //   //Add schedule for multiple day, if schedule is existed => update schedule
    //   let arrSchedule = [];
    //   for (let i = 0; i <= duration; i++){
    //     let dateUse = moment(dateStart).add(i, 'days').format('YYYY-MM-DD');

    //     const schedule = await Schedule.findOne({
    //       dateUse: dateUse, class: classID
    //     });

    //     const newData = {
    //       slotSubjects: slotSubjects,
    //       dateUse: dateUse,
    //       status: status,
    //       class: classID
    //     };
    //     let newSchedule = {};
    //     if (schedule) {
    //       //return res.ok(ErrorMessages.SCHEDULE_EXISTED)
    //       newSchedule = await ScheduleService.edit({ id: schedule.id }, newData);
    //     } else {
    //       newSchedule = await ScheduleService.add(newData);
    //     }
    //     arrSchedule.push(newSchedule);
    //   }
    //   return res.ok(arrSchedule);
    // }
  },

  get: async (req, res) => {
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK PARAM
    if (!params.dateUse) {
      return res.badRequest(ErrorMessages.SCHEDULE_DATEUSE_REQUIRED);
    }
    // QUERY & CHECK DATA POST
    const schedule = await ScheduleService.get({
      dateUse: params.dateUse,
      class: params.classId
    });
    if (!schedule) {
      return res.badRequest(ErrorMessages.SCHEDULE_NOT_FOUND);
    }
    let listSubject = await Subject.find({ where: {}, sort: [{ title: 'asc' }] });
    let dataSchedule = {};
    dataSchedule.schedule = schedule;
    dataSchedule.listSubjects = listSubject;
    // RETURN DATA POST
    return res.json(dataSchedule);
  },

  edit: async (req, res) => {
    sails.log.info("================================ ScheduleController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    let status = params.status ? parseInt(params.status) : 1;
    // PREPARE DATA SCHEDULE
    const newData = {
      class: params.classId,
      dateUse: params.dateUse,
      slotSubjects: params.slotSubjects,
      status: status,
    };
    // CHECK DATA SCHEDULE
    const schedule = await Schedule.findOne({
      dateUse: params.dateUse,
      class: params.classId
    });
    if (!schedule) {
      return res.notFound(ErrorMessages.SCHEDULE_NOT_FOUND);
    }
    // UPDATE DATA SCHEDULE
    const editObj = await ScheduleService.edit({
      id: schedule.id
    }, newData);
    // RETURN DATA SCHEDULE
    return res.json(editObj[0]);
  },

  trash: async (req, res) => {
    sails.log.info("================================ ScheduleController.trash => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    // CHECK IDS PARAM
    if (!params.ids || !params.ids.length) {
      return res.badRequest(ErrorMessages.SCHEDULE_ID_REQUIRED);
    }
    // CHECK Schedule & UPDATE
    const schedules = await ScheduleService.find({
      id: params.ids
    });
    if (typeof params.ids === 'string') {
      if (!schedules.length) {
        return res.badRequest(ErrorMessages.SCHEDULE_NOT_FOUND);
      } else {
        // nothing to do
      }
    } else {
      if (schedules.length !== params.ids.length) {
        return res.badRequest(ErrorMessages.SCHEDULE_NOT_FOUND);
      } else {
        // nothing to do
      }
    }
    await Schedule.update({
      id: params.ids
    }).set({
      status: 3
    });
    // RETURN DATA
    return res.json();
  },

  search: async (req, res) => {
    sails.log.info("================================ ScheduleController.search => START ================================");
    let params = req.allParams();
    let start = moment(params.start).format("YYYY-MM-DD");
    let end = moment(params.end).format("YYYY-MM-DD");
    let resultSchedule = await Schedule.find({ class: params.classId, dateUse: { '>=': start, '<=': end } })
    // get all subject
    let subjects = await Subject.find({});
    let obj = {};
    for (let subject of subjects) {
      obj[subject.id] = subject;
    }
    // Prepare Schedule
    let arrSchedule = [];
    arrSchedule = resultSchedule.map((daySchedule) => {
      let dateUse = daySchedule.dateUse;
      let arrSubjectOfDay = daySchedule.slotSubjects.map((subjectObj) => {
        if (obj[subjectObj.subject]) {
          let itemSubject = {};
          itemSubject.title = '';
          if (subjectObj.subject) {
            itemSubject.title = obj[subjectObj.subject].title;
          }
          itemSubject.topic = subjectObj.topic;
          itemSubject.start = dateUse + 'T' + subjectObj.time + ':00';
          return itemSubject;
        }
      });
      return arrSubjectOfDay;
    })
    return res.ok(arrSchedule);
  },

  delete: async (req, res) => {
    sails.log.info("================================ ScheduleController.delete => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.SCHEDULE_ID_REQUIRED);

    let scheduleObj = await ScheduleService.get({ id: params.id });
    if (!scheduleObj) return res.badRequest(ErrorMessages.SCHEDULE_NOT_FOUND);
    ScheduleService.del({ id: params.id });
    
    return res.ok();
  },
};
