/**
 * DashBoardController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


//Library
const ErrorMessages = require('../../../../config/errors');
const moment = require('moment');
const makeDir = require('make-dir');
const fs = require('fs');
const AttendentService = require('../../../services/AttendentService');

module.exports = {

    searchSchedule: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchSchedule => START ================================");
        let params = req.allParams();
        
        let classID = params.classID ? params.classID : null;
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;
        
        let dateUse = moment().format('YYYY-MM-DD');  
        let objSchedule = await ScheduleService.get({ class: classID, dateUse : dateUse });
        let resSchedules = [];
        let totalSchedule = 0;
        // PREPARE DATA FOR SCHEDULE
        if (objSchedule) {
            for (let i = 0; i < objSchedule.slotSubjects.length; i++){
                let tmpData = {};
                tmpData.time = objSchedule.slotSubjects[i].time;
                if (objSchedule.slotSubjects[i].subject) {
                    let subName = await SubjectService.get({id : objSchedule.slotSubjects[i].subject});
                    tmpData.subject = subName.title;
                } else {
                    tmpData.subject = '';
                }
                resSchedules.push(tmpData);
                totalSchedule++;
            }  
            return res.ok({ draw: draw, recordsTotal: totalSchedule, recordsFiltered: totalSchedule, data: resSchedules });
        } else {
            return res.ok({ draw: draw, recordsTotal: totalSchedule, recordsFiltered: totalSchedule, data: resSchedules });
        }
        // END PREPARE DATA FOR SCHEDULE
    },
    searchMenu: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchMenu => START ================================");
        let params = req.allParams();
        
        let classID = params.classID ? params.classID : null;
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;
        
        let dateUse = moment().format('YYYY-MM-DD');  
        let objMenu = await MenuService.get({ class: classID, dateUse : dateUse });
        let resMenus = [];
        let totalMenu = 0;
        // PREPARE DATA FOR MENU
        if (objMenu) {
            for (let i = 0; i < objMenu.slotFeedings.length; i++){
                let tmpData = {};
                let time = objMenu.slotFeedings[i].time;
                tmpData.time = time;
                // let time2 = parseInt(time.split(":")[0]);
                // if(time2 < 10) {
                //     tmpData.time = "Sáng"
                // }else { if(10 < time2 && time2 < 14) {
                //         tmpData.time = "Trưa"
                //     }else {
                //         if(14 < time2  && time2 < 16) {
                //             tmpData.time = "Xế"
                //         }else{
                //                 tmpData.time = "Chiều"
                //         }
                //     }
                // }
                
                if (objMenu.slotFeedings[i].foods.length > 0) {
                    // ADD <BR/> FOR FOOD TITLE AND PREPARE DATA TITLE FOR FOOD MENU
                    let foodTitle = [];
                    for (let y = 0; y < objMenu.slotFeedings[i].foods.length - 1; y++){
                        let foodName = await FoodService.get({ id: objMenu.slotFeedings[i].foods[y] });
                        let foodTitles = foodName.title;
                        foodTitle.push(foodTitles);
                    }
                    let lastItem = objMenu.slotFeedings[i].foods.slice(-1)[0];
                    let foodName = await FoodService.get({ id: lastItem });
                    foodTitle.push(foodName.title);
                    tmpData.food = foodTitle;
                    // END ADD <BR/> FOR FOOD TITLE AND PREPARE DATA TITLE FOR FOOD MENU
                } else {
                    tmpData.food = '';
                }
                resMenus.push(tmpData);
                totalMenu++;
            }  
            return res.ok({ draw: draw, recordsTotal: totalMenu, recordsFiltered: totalMenu, data: resMenus });
        } else {
            return res.ok({ draw: draw, recordsTotal: totalMenu, recordsFiltered: totalMenu, data: resMenus });
        }
        // END PREPARE DATA FOR MENU
    },    
    searchTuition: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchTuition => START ================================");
        let params = req.allParams();
        
        let classID = params.classID ? params.classID : null;
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;
        
        let dateFormat = res.locals.webSettings;
        let objClass = await ClassService.get({ id: classID});
        let resTuitions = [];
        let totalTuition = 0;
        // PREPARE DATA FOR MENU
        if (objClass) {
            for (let i = 0; i < objClass.tuition.length; i++){
                let tmpData = {};
                if (objClass.tuition[i].slotItems.length > 0) {
                    for (let y = 0; y < objClass.tuition[i].slotItems.length; y++){
                        tmpData.deadline = moment(objClass.tuition[i].deadline).format(dateFormat.value.dateFormat);
                        tmpData.title = objClass.tuition[i].slotItems[y].title;
                        tmpData.price = objClass.tuition[i].slotItems[y].price;
                    }
                    // END ADD <BR/> FOR FOOD TITLE AND PREPARE DATA TITLE FOR FOOD MENU
                } else {
                    tmpData.title = '';
                    tmpData.price = '';
                }
                resTuitions.push(tmpData);
                totalTuition++;
            }  
            return res.ok({ draw: draw, recordsTotal: totalTuition, recordsFiltered: totalTuition, data: resTuitions });
        } else {
            return res.ok({ draw: draw, recordsTotal: totalTuition, recordsFiltered: totalTuition, data: resTuitions });
        }
        // END PREPARE DATA FOR MENU
    },
    searchClassSize: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchClassSize => START ================================");
        let params = req.allParams();
            
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;

        let arrClass = await ClassService.find({});
        let resClass = [];
        let totalClass = 0;
        // PREPARE DATA FOR CLASS
        if (arrClass) {
            for (let i = 0; i < arrClass.length; i++){
                let attendentSize = 0;
                let attendents = await Attendent.find({ date: moment().format('YYYY-MM-DD'), classObj: arrClass[i].id, status: sails.config.custom.STATUS.ATTENDANT});
                attendentSize = attendents.length;
                attendentSize += '/' + arrClass[i].totalStudent;
                let tmpData = {};
                tmpData.className = arrClass[i].title;
                tmpData.attendent = attendentSize;
                resClass.push(tmpData);
                totalClass++;
            }  
            return res.ok({ draw: draw, recordsTotal: totalClass, recordsFiltered: totalClass, data: resClass });
        } else {
            return res.ok({ draw: draw, recordsTotal: totalClass, recordsFiltered: totalClass, data: resClass });
        }
        // END PREPARE DATA FOR CLASS
    }
};
