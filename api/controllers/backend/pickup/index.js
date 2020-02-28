

/**
 * pickUp/index.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

module.exports = {

	friendlyName: 'PickUp Management',
	description: 'PickUp Management',
	inputs: {},
	exits: {
		success: {
			viewTemplatePath: 'backend/pages/pickup/index',
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

		return exits.success(_default);
	}

};
