/**
 * @copyright 2017 @ ZiniMediaTeam
 * @author brianvo
 * @create 2017/10/23 01:05
 * @update 2017/10/23 01:05
 * @file api/models/Attendent.js
 * @description :: Attendent model.
 */

module.exports = {

    attributes: {
        student: {
            model: 'student',
            required: true
        },
        status: {                           //Integer {"ABSENT":0, "ATTENDANT":1}
            type: 'number',
            isIn: [sails.config.custom.STATUS.ABSENT, sails.config.custom.STATUS.ATTENDANT],
            defaultsTo: sails.config.custom.STATUS.ABSENT
        },
        date: {
            type: 'string', /* Ngày áp dụng format YYYY-mm-dd*/
        },
        time: {
            type: 'string',
            description: 'Time attendant'
        },
        parent: {
            model: 'parent'
        },
        note: {
            type: 'string'
        },
        classObj: {
            model: 'class',
            required: true
        }
    }
};