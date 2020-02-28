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
			viewTemplatePath: 'backend/pages/schedule/index',
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
		let classID = params.classActive;
		let listSubject = await Subject.find({ where: {}, sort: [{ title: 'asc' }] });
		let startTimeCourseSession = _default.currCourseSession.startTime;
		let endTimeCourseSession = _default.currCourseSession.endTime;
		_default.startTimeCourseSession = startTimeCourseSession;
		_default.endTimeCourseSession = endTimeCourseSession;
		_default.listSubject = listSubject;
		_default.classSelect = classID;

		//get weekend of school
		let setting = await Setting.findOne({ key: 'web' });
		let weekend = setting.value && setting.value.weekend ? setting.value.weekend : []; //6,7 is saturday and sunday
		_default.weekend = weekend;
	
		return exits.success(_default);
	}

};
