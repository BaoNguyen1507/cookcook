
const ParentService = require('../../../services/ParentService');

/**
 * taxonomy/list-taxonomy.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */

const moment = require('moment');

module.exports = {
    friendlyName: 'Parent Management',
    description: 'Parent Management',
    inputs: {},
    exits: {
        success: {
            viewTemplatePath: 'backend/pages/parent/list',
        },
        redirect: {
            responseType: 'redirect'
        }
    },
    fn: async function (inputs, exits) {
        if (!this.req.me) {
            throw { redirect: '/backend/login' };
        }
        let _default = await sails.helpers.getDefaultData(this.req);
        let params = this.req.allParams();
        let status = (params.status) ? (params.status) : 1;

        // let classObj = await Class.findOne({ id: params.classActive }).populate('students');
        // let stdIds = classObj.students.map((std) => {
        //     return std.id;
        // });
        // let relationsStd_Prnt = await Student_Parent.find({ student: stdIds });
        // let parentIds = relationsStd_Prnt.map((rls) => {
        //     return rls.parent;
        // })
        // parentIds = _.union(parentIds);

        _default.status = status;

        return exits.success(_default);
    }

};