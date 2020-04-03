

/**
 * notice/index.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */
let moment = require('moment');
module.exports = {

	friendlyName: 'Notification Management',
	description: 'Notification Management',
	inputs: {},
	exits: {
		success: {
			viewTemplatePath: 'frontend/pages/notice/index',
		},
		redirect: {
			responseType: 'redirect'
		}
	},

	fn: async function (inputs, exits) { 
		// if (!this.req.me) {
		// 	throw { redirect: '/backend' };
		// }
	
		let _default = await sails.helpers.getDefaultData(this.req);
		let params = this.req.allParams();	
		let page = params.page ? parseInt(params.page) : 1;
		let limit = _default.PAGING.LIMIT;
		let skip = (page - 1) * limit;
		
		let listClass = await ClassService.find({ status: _default.STATUS.ACTIVE });
		let listNotification = await NotificationService.find({ status: _default.STATUS.ACTIVE },limit,skip);
		for ( let i = 0; i < listNotification.length; i++ ){
			if (listNotification[i].classList.length > 0) {
				let classTitleArr = [];
				for (let classObj of listNotification[i].classList){
					let classes = await ClassService.get({ id: classObj });
					classTitleArr.push(classes.title);
				}
				listNotification[i].classList = classTitleArr;
			}
		}
		_default.listNotification = listNotification;
		_default.listClass = listClass;
		_default.moment = moment;
		
		return exits.success(_default);
	}
};
