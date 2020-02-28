

/**
 * Post/list.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

const moment = require('moment');

module.exports = {

	friendlyName: 'Post Management',
	description: 'Post Management',
	inputs: {},
	exits: {
		success: {
			viewTemplatePath: 'backend/pages/post/index',
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
		let status = (params.status) ? (params.status) : 1;
		let type = (params.type) ? (params.type) : -1;

		let totalAll = await PostService.count();
		let totalDraft = await PostService.count({ status: _default.STATUS.DRAFT });
		let totalActive = await PostService.count({ status: _default.STATUS.ACTIVE });
		let totalTrash = await PostService.count({ status: _default.STATUS.TRASH });

		_default.type = type;
		_default.status = status;
		_default.totalAll = totalAll;
		_default.totalDraft = totalDraft;
		_default.totalActive = totalActive;
		_default.totalTrash = totalTrash;
		return exits.success(_default);
	}

};
