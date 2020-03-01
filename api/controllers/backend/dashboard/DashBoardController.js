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

module.exports = {

    searchMenu: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchMenu => START ================================");
        let params = req.allParams();
        
        let classID = params.classID ? params.classID : null;
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;
        
        let dateUse = moment().format('YYYY-MM-DD');  
        let objMenu = await MenuService.get({ dateUse : dateUse });
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
   
    searchClassSize: async (req, res) => {
        sails.log.info("================================ DashBoardController.searchClassSize => START ================================");
        let params = req.allParams();
            
        let draw = (params.draw) ? parseInt(params.draw) : 1;
        let limit = (params.length) ? parseInt(params.length) : null;
        let skip = (params.start) ? parseInt(params.start) : null;
        let sort = (params.sort) ? JSON.parse(params.sort) : null;

        return [];
    }
};
