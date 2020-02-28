/**
 * Schedule Controller
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
*/
const ErrorMessage = require('../../../config/errors');
const ScheduleService = require('../../services/ScheduleService');
const SubjectService = require('../../services/SubjectService');
//Library
const moment = require('moment');

module.exports = {
  search: async (req, res) => {
    let params = req.allParams();

    if (!params.classId) {
      return res.badRequest(ErrorMessage.SCHEDULE_ERR_CLASSID_REQUIRED);
    } else if (!params.dateUse) {
      return res.badRequest(ErrorMessage.SCHEDULE_ERR_DATE_REQUIRED);
    }

    const tmpData = {
      class: params.classId,
      dateUse: params.dateUse
    };

    const find = await ScheduleService.find(tmpData);
    if (find.length > 0) {
      let i, j, k;

      for (i = 0; i < find.length; i++) {
        if (find[i].slotSubjects.length > 0) {
          for (j = 0; j < find[i].slotSubjects.length; j++) {
            if (find[i].slotSubjects[j].subjects && find[i].slotSubjects[j].subjects.length > 0) {
              let findSubjects = await Subject.find({ id: { 'in': find[i].slotSubjects[j].subjects } });
              if (findSubjects && findSubjects.length > 0) {
                find[i].slotSubjects[j].subjects = findSubjects;
              }
            }
          }
        }
      }
    }

    return res.ok({
      data: find
    });
  }

}