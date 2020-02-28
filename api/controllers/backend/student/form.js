/**
 * student/form.js
 *
 * @description :: Server-side controller action for handling incoming requests.
 * @help        :: See https://sailsjs.com/documentation/concepts/controllers
 */


module.exports = {
  friendlyName: 'View Edit Student',
  description: 'Display "Edit Student" page.',
  exits: {
    success: {
      viewTemplatePath: 'backend/pages/student/form',
    },
    error: {
      description: 'Error.',
      responseType: 'badRequest'
    }
  },
  fn: async function (inputs, exits) {
    let student = {};
    let _default = await sails.helpers.getDefaultData(this.req);
    _default.manner = (this.req.param('id') == undefined ? 'add' : 'edit');
    if (_default.manner == 'edit') {
      student = await StudentService.get({ id: this.req.param('id') });

      let motherOfStudent = await Student_Parent.findOne({ student: student.id, type: 0 });
      let fatherOfStudent = await Student_Parent.findOne({ student: student.id, type: 1 });
      let guardiansOfStudent = await Student_Parent.find({ student: student.id, type: 2 });
      student.mother = '';
      student.father = '';
      student.guardians = [];
      if (motherOfStudent) student.mother = motherOfStudent.parent;
      if (fatherOfStudent) student.father = fatherOfStudent.parent;
      if (guardiansOfStudent && guardiansOfStudent.length > 0) student.guardians = guardiansOfStudent.map(item => item.parent);
    } else {
      student.mother = '';
      student.father = '';
      student.guardians = [];
    }
    let listClass = await ClassService.find({});
    _default.listClass = listClass;

    let listMother = await ParentService.find({gender: _default.TYPE.FEMALE });
    _default.listMother = listMother;
    let listFather = await ParentService.find({gender: _default.TYPE.MALE });
    _default.listFather = listFather;
    let listOthers = await ParentService.find({});
    _default.listOthers = listOthers;
    
    _default.studentData = student;
    return exits.success(_default);
  }
};