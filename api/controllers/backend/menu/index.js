

/**
 * schedule/list.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

const moment = require('moment');

module.exports = {

	friendlyName: 'Schedule Management',
	description: 'Schedule Management',
	inputs: {},
	exits: {
		success: {
			viewTemplatePath: 'backend/pages/menu/index',
		},
		redirect: {
			responseType: 'redirect'
		}
	},

	fn: async function (inputs, exits) {
		if (!this.req.me) {
			throw { redirect: '/backend' };
		}
		//init
		let _default = await sails.helpers.getDefaultData(this.req);
		let params = this.req.allParams();
		let classActive = params.classActive;
		// let currDate = moment().format("YYYY-MM-DD");

		// let menuObj = await Menu.findOne({ classes: classActive, dateUse: currDate });
		// let menuId = null;
		// let listFood = await FoodService.find({});
		// let listFoodParseObj = {};
		// for (let itemFood of listFood) {
		// 	listFoodParseObj[itemFood.id] = itemFood;
		// }

		// if (menuObj) {
		// 	let rangeTime = [
		// 		{
		// 			start: 6,
		// 			end: 10,
		// 			name: "Bữa sáng",
		// 			timeTitleStart: "06:00",
		// 			timeTitleEnd: "10:00",
		// 			list: []
		// 		},
		// 		{
		// 			start: 10,
		// 			end: 14,
		// 			name: "Bữa trưa",
		// 			timeTitleStart: "10:00",
		// 			timeTitleEnd: "14:00",
		// 			list: []
		// 		},
		// 		{
		// 			start: 14,
		// 			end: 16,
		// 			name: "Bữa xế",
		// 			timeTitleStart: "14:00",
		// 			timeTitleEnd: "16:00",
		// 			list: []
		// 		},
		// 		{
		// 			start: 16,
		// 			end: 18,
		// 			name: "Bữa chiều",
		// 			timeTitleStart: "16:00",
		// 			timeTitleEnd: "ra về",
		// 			list: []
		// 		},
		// 	];
		// 	for (let i = 0; i < menuObj.slotFeedings.length; i++) {
		// 		let row = menuObj.slotFeedings[i]; //row is array id food
		// 		let rowNew = { //row new is repare obj food by id
		// 			time: menuObj.slotFeedings[i].time,
		// 			food: []
		// 		}
		// 		for (let j = 0; j < menuObj.slotFeedings[i].foods.length; j++) {
		// 			rowNew.food.push(listFoodParseObj[menuObj.slotFeedings[i].foods[j]]) //push obj by id to array rowNew.food
		// 		}
		// 		let time = parseInt(row.time.split(":")[0]);
		// 		let findRangeIndex = rangeTime.findIndex(
		// 			r => r.start <= time && r.end > time
		// 		);
		// 		rangeTime[findRangeIndex].list.push(rowNew);
		// 	}
		// 	_default.menuObj = rangeTime;
		// 	_default.menuId = menuObj.id;
		// } else {
		// 	_default.menuObj = menuObj;
		// 	_default.menuId = menuId;
		// }
		_default.listFoods = await Food.find({ status: sails.config.custom.STATUS.ACTIVE });
    _default.manner = (!this.req.param('id') ? 'add' : 'edit');
    _default.classesApply = [];
    // if (_default.manner == 'edit') {
			//   let menuObj = await Menu.findOne({ id: params.id });
			//   // dateUse
			//   _default.dateUse = moment(menuObj.dateUse, "YYYY-MM-DD").format("DD/MM/YYYY");
			//   // classes
			//   _default.classesApply = menuObj.classes;
			//   _default.menuId = params.id;
			// }
			// _default.currDate = currDate;
		_default.classActive = classActive;
		
    // get range time format
    let setting = await Setting.findOne({ key : 'web' });
    let rangeTime = [];
    if (setting.value && setting.value.rangeTimeMenu) {
      rangeTime = setting.value.rangeTimeMenu;
    }
    _default.rangeTime = rangeTime;

		let startTimeCourseSession = _default.currCourseSession.startTime;
		let endTimeCourseSession = _default.currCourseSession.endTime;
		_default.startTimeCourseSession = startTimeCourseSession;
		_default.endTimeCourseSession = endTimeCourseSession;
		return exits.success(_default);
	}
};
