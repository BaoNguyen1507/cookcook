/**
 * StudentController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */


//Library
const ErrorMessages = require('../../../../config/errors');
const moment = require('moment');
const Sharp = require('sharp/lib');
module.exports = {

  add: async (req, res) => {
    // sails.log.info("================================ StudentController.add => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();

    // CHECK FULLNAME & DATEOFBIRTH & GENDER PARAMS
    // if (!params.firstName && !params.firstName.trim().length) {
    //   return res.badRequest(ErrorMessages.ERR_FULLNAME_REQUIRED);
    // } else if (!params.lastName && !params.lastName.trim().length) {
    //   return res.badRequest(ErrorMessages.ERR_FULLNAME_REQUIRED);
    // } else if (!params.gender || !params.gender.trim().length) {
    //   return res.badRequest(ErrorMessages.ERR_GENDER_REQUIRED);
    // } else if (!params.dateOfBirth) {
    //   return res.badRequest(ErrorMessages.ERR_BIRTHDAY_REQUIRED);
    // }



    let w_h_History = [];
    let data_w_h_History = {
      height: params.height,
      weight: params.weight
    }
    w_h_History.push(data_w_h_History);

    let healthHistory = [];
    let dataHealthHistory = {
      symptom: params.symptom,
      note: params.note
    }
    healthHistory.push(dataHealthHistory);
    // PREPARE DATA STUDENT
    const newData = {
      firstName: params.firstName, //REQUIRED
      lastName: params.lastName, // REQUIRED
      code: params.code, // REQUIRED
      dateOfBirth: params.dateOfBirth, // REQUIRED
      gender: params.gender ? parseInt(params.gender) : 1, // REQUIRED
      currentAddress: params.currentAddress ? params.currentAddress : '',
      height: params.height ? parseFloat(params.height) : 0,
      weight: params.weight ? parseFloat(params.weight) : 0,
      bloodGroup: params.bloodGroup ? params.bloodGroup : '',
      allergy: params.allergy ? params.allergy : '',
      heartRate: params.heartRate ? params.heartRate : '',
      eyes: params.eyes ? params.eyes : '',
      ears: params.ears ? params.ears : '',
      notes: params.notes ? params.notes : '',
      avatar: params.thumbnail,
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      createdBy: req.session.userId,
      w_h_History: w_h_History,
      healthHistory: healthHistory,
      classes: params.classes,
      // parents: params.parents
    };
    // ADD NEW DATA STUDENT
    const newStudent = await StudentService.add(newData);
    //AFTER ADD SUCCES, UPDATE TOTAL STUDENT FOR CLASS
    if (newStudent) {
      for (let classIdItem of params.classes) {
        //get info class
        let classObj = await Class.findOne({ id: classIdItem });
        //count Class in table relation Student - Class
        let totalCount = await Student_Class.count({ classObj: classIdItem });
        //create new data with totalSudent updated
        classObj.totalStudent = totalCount;
        //edit info class
        let idClass = { id: classObj.id };
        await ClassService.edit(idClass, classObj)
      }
    }

    //ADD RELATION FOR FATHER + MOTHER + GUARDIANS
    if (params.mother && params.mother != "") await Student_Parent.create({ student: newStudent.id, parent: params.mother, type: 0 });
    if (params.father && params.father != "") await Student_Parent.create({ student: newStudent.id, parent: params.father, type: 1 });
    if (params.guardians && params.guardians.length > 0) {
      for (let guardianId of params.guardians) {
        await Student_Parent.create({ student: newStudent.id, parent: guardianId, type: 2 });
      }
    }

    // RETURN DATA STUDENT
    return res.ok(newStudent);
  },

  get: async (req, res) => {
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK ID PARAM
    if (!params.id) {
      return res.badRequest(ErrorMessages.STUDENT_ID_REQUIRED);
    }

    // QUERY & CHECK DATA POST
    const student = await StudentService.get({
      id: params.id
    });
    if (!student) {
      return res.badRequest(ErrorMessages.STUDENT_NOT_FOUND);
    }

    // RETURN DATA POST
    return res.json({
      data: student
    });
  },

  edit: async (req, res) => {
    sails.log.info("================================ StudentController.edit => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    let healthHistory = [];
    let w_h_History = [];
    let dataHealthHistory = {
      symptom: params.symptom,
      note: params.note
    }
    let data_w_h_History = {
      height: params.height,
      weight: params.weight
    }
    const student = await StudentService.get({ id: params.id });
    if (!student) return res.notFound(ErrorMessages.STUDENT_NOT_FOUND);
    let classes = params.classes;

    // UPDATE TOTAL STUDENT IN CLASS
    if (student.classes.length > 0) {
      for (let i = 0; i < classes.length; i++) {
        let result = student.classes.some(function (el) {
          return el.id == classes[i];
        });
        if (result == false) {
          let classObj = await ClassService.get({ id: classes[i] });
          if (classObj) {
            classObj.totalStudent = classObj.totalStudent + 1;
            await ClassService.edit({ id: classObj.id }, { totalStudent: classObj.totalStudent });
          }
        }
      }
    } else {
      for (let i = 0; i < classes.length; i++) {
        let classObj = await ClassService.get({ id: classes[i] });
        if (classObj) {
          classObj.totalStudent = classObj.totalStudent + 1;
          await ClassService.edit({ id: classObj.id }, { totalStudent: classObj.totalStudent });
        }
      }
    }
    // UPDATE TOTAL STUDENT IN CLASS
    healthHistory.push(dataHealthHistory);
    w_h_History.push(data_w_h_History);
    // PREPARE DATA STUDENT
    const newData = {
      firstName: params.firstName, // REQUIRED
      lastName: params.lastName, // REQUIRED
      code: params.code,
      dateOfBirth: params.dateOfBirth, // REQUIRED
      gender: params.gender ? parseInt(params.gender) : 1, // REQUIRED
      currentAddress: params.currentAddress ? params.currentAddress : '',
      height: params.height ? parseFloat(params.height) : 0,
      weight: params.weight ? parseFloat(params.weight) : 0,
      bloodGroup: params.bloodGroup ? params.bloodGroup : '',
      allergy: params.allergy ? params.allergy : '',
      heartRate: params.heartRate ? params.heartRate : '',
      eyes: params.eyes ? params.eyes : '',
      ears: params.ears ? params.ears : '',
      notes: params.notes ? params.notes : '',
      avatar: params.thumbnail,
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      createdBy: req.session.userId,
      healthHistory: healthHistory,
      w_h_History: w_h_History,
      // parents: params.parents
    };
    // UPDATE DATA Student
    const editObj = await StudentService.edit({ id: params.id }, newData);

    //replaceCollection
    await Student.replaceCollection(params.id, 'classes').members(classes);
    
    //EDIT RELATION FOR FATHER + MOTHER + GUARDIANS
    let student_parents = await Student_Parent.find({ student: params.id });
    let oldGuardians = [];

    let isHaveMother = false;
    let isHaveFather = false;
    for (let student_parent of student_parents) {
      if (student_parent.type == 0) {
        if (student_parent.parent != params.mother) {
          await Student_Parent.destroy({ id: student_parent.id });
          if (params.mother != "") await Student_Parent.create({ student: params.id, parent: params.mother, type: 0 });
        }
        isHaveMother = true;
      } else if (student_parent.type == 1) {
        if (student_parent.parent != params.father) {
          await Student_Parent.destroy({ id: student_parent.id });
          if (params.father != "") await Student_Parent.create({ student: params.id, parent: params.father, type: 1 });
        }
        isHaveFather = true;
      } else {
        oldGuardians.push(student_parent.parent);
      }
    }

    //add father and mother if not existed
    if (!isHaveMother && params.mother != "") await Student_Parent.create({ student: params.id, parent: params.mother, type: 0 });
    if (!isHaveFather && params.father != "") await Student_Parent.create({ student: params.id, parent: params.father, type: 1 });

    if (params.guardians) {
      //added guardians
      let addedGuardians = params.guardians.filter(item => !oldGuardians.includes(item));
      //removed guardians
      let removedGuardians = oldGuardians.filter(item => !params.guardians.includes(item));
  
      if (addedGuardians.length > 0) {
        for (let guardianId of addedGuardians) {
          await Student_Parent.create({ student: params.id, parent: guardianId, type: 2 });
        }
      }
  
      if (removedGuardians.length > 0) {
        for (let guardianId of removedGuardians) {
          await Student_Parent.destroy({ student: params.id, parent: guardianId, type: 2 });
        }
      }
    } else {
      await Student_Parent.destroy({ student: params.id, type: 2 });
    }

    // RETURN DATA Student
    return res.json(editObj);
  },

  trash: async (req, res) => {
    sails.log.info("================================ StudentController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorService.ERR_ID_REQUIRED);
    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let student = await StudentService.get({ id: ids[i] });
        if (student) await Student.destroy({ id: ids[i] });
        // let student = await StudentService.get({
        //   id: ids[i]
        // });
        // if (student && student.status == sails.config.custom.STATUS.TRASH) {
        //   //AFTER DEL STUDENT SUCCES, UPDATE TOTAL STUDENT FOR CLASS
        //   let relationStd_Cls = await Student_Class.find({ student: ids[i] });
        //   let arrClassId = relationStd_Cls.map((relation) => {
        //     return relation.classObj;
        //   })
        //   // del student
        //   await Student.destroy({
        //     id: ids[i]
        //   });
        //   // find class 
        //   for (let classId of arrClassId) {
        //     let classObj = await Class.findOne({ id: classId });
        //     let totalCount = await Student_Class.count({ classObj: classId });
        //     //create new data with totalSudent updated
        //     classObj.totalStudent = totalCount;
        //     await ClassService.edit({ id: classObj.id }, classObj);
        //   }
        // } else if (student) {
        //   await Student.update({
        //     id: ids[i]
        //   }).set({
        //     status: sails.config.custom.STATUS.TRASH
        //   });
        // }
      }
    } else {
      let student = await StudentService.get({ id: ids });
      if (student) await Student.destroy({ id: ids });
      // let student = await StudentService.get({
      //   id: ids
      // });
      // if (student && student.status == sails.config.custom.STATUS.TRASH) {
      //   //AFTER DEL STUDENT SUCCES, UPDATE TOTAL STUDENT FOR CLASS
      //   let relationStd_Cls = await Student_Class.find({ student: ids });
      //   let arrClassId = relationStd_Cls.map((relation) => {
      //     return relation.classObj;
      //   })
      //   // del student
      //   await Student.destroy({
      //     id: ids
      //   });
      //   // find class 
      //   for (let classId of arrClassId) {
      //     let classObj = await Class.findOne({ id: classId });
      //     let totalCount = await Student_Class.count({ classObj: classId });
      //     //create new data with totalSudent updated
      //     classObj.totalStudent = totalCount;
      //     await ClassService.edit({ id: classObj.id }, classObj);
      //   }
      // } else if (student) {
      //   await Student.update({
      //     id: ids
      //   }).set({
      //     status: sails.config.custom.STATUS.TRASH
      //   });
      // }
    }
    return res.ok();
  },

  uploadThumbnail: async (req, res) => {
    sails.log.info("================================ StudentController.uploadThumbnail => START ================================");
    let thumbnail = {};
    if (req.file('file')) {
      let fileUploaded = await sails.helpers.uploadFile.with({
        req: req,
        file: 'thumbnail'
      });
      if (fileUploaded.length) {
        let filename = '';
        for (let file of fileUploaded) {
          // sails.log('fileUploaded', file);
          filename = file.fd.replace(/^.*[\\\/]/, '');
          filename = filename.split('.');

          let uploadConfig = sails.config.custom.UPLOAD;
          thumbnail.sizes = {};
          for (let size of uploadConfig.SIZES) {
            let destFileName = filename[0] + '_' + size.name + '.' + filename[1];
            if (size.type == 'origin') {
              Sharp(file.fd).resize(size.width)
                .toFile(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM') + '/' + destFileName)
                .then((info) => {}).catch((err) => { sails.log(err); });
              thumbnail.path = '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName;
            } else {
              let type = size.type;
              Sharp(file.fd).resize(size.width, size.height)
                .toFile(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM') + '/' + destFileName)
                .then((info) => { }).catch((err) => { sails.log(err); });
              thumbnail.sizes[type] = {
                width: size.width, height: size.height,
                path: '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName
              };
            }
          }
        }

        let dataMedia = {
          title: filename.join('.'),
          thumbnail: thumbnail
        }
        let mediaObj = await MediaService.add(dataMedia);
        return res.json(mediaObj.thumbnail.sizes.thumbnail.path);
      }
    }
    return res.json('');
  },

  search: async (req, res) => {
    sails.log.info("================================ StudentController.search => START ================================");
    sails.log(req.branchActive);
    let params = req.allParams();
    let webSettings = res.locals.webSettings;
    let dateFormat = webSettings.value.dateFormat;
    let keyword = params.search ? params.search.value : null;
    let classId = params.classId ? params.classId : null;
    let branchID = (params.branchID != 'null') ? params.branchID : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
    //prepared order param
    let objOrder = {};
    objOrder[params.columns[params.order[0].column].data] = params.order[0].dir;
    //let sort = [objOrder];

    //get new sort for find insensitive case
    let newSort = {};
    for(var key in objOrder){
      if(objOrder[key] == 'desc'){
        //code here
        newSort[key] = -1; 
      } else {
        newSort[key] = 1;
      }
    }
    //get students form class 
    // let clsObj = await Class.findOne({ id: classId }).populate('students');
    // let studentIds = clsObj.students.map((std) => {
    //   return std.id;
    // })
    //find only active status
    // let where = {
    //   id: studentIds,
    //   status: params.status ? params.status : 1
    // };
    // // SEARCH
    // if (typeof keyword === "string" && keyword.length > 0) {
    //   where.or = [
    //     { code: { contains: keyword } },
    //     { firstName: { contains: keyword } },
    //     { lastName: { contains: keyword } },
    //   ]
    // }
    let where = {};
    if (typeof keyword === "string" && keyword.length > 0) {
      where = {
        $or: [
          { code: { $regex: keyword, $options: 'i' }},
          { firstName: { $regex: keyword, $options: 'i' }},
          { lastName: { $regex: keyword, $options: 'i' } }
        ]
      } 
    }

    let mongo = require('mongodb');
    
    //get students form class 
    let studentIds = [];
    let clsObj = [];
    if (branchID && classId && classId != '0' && classId != 'undefined') {
      clsObj = await Class.find({id: classId , branch: branchID }).populate('students');
      for (let classObj of clsObj){
         classObj.students.map((std) => {
          studentIds.push(new mongo.ObjectID(std.id));
        })
      }
    } else if (branchID) {
      clsObj = await Class.find({branch: branchID }).populate('students');
      for (let classObj of clsObj){
         classObj.students.map((std) => {
          studentIds.push(new mongo.ObjectID(std.id));
        })
      }
    } else {
      clsObj = await Class.find({ id: classId }).populate('students');
      for (let classObj of clsObj){
        studentIds = classObj.students.map((std) => {
          return new mongo.ObjectID(std.id);
        })
      }
    }
   
    if (params.gender != 2) {
      where.$and = [
        { status: params.status ? parseInt(params.status) : 1 },
        { gender: parseInt(params.gender) },
        { _id : { $in : studentIds } }
      ];
    } else {
      where.$and = [
        { status: params.status ? parseInt(params.status) : 1 },
        { _id : { $in : studentIds } }
      ];
    }
    

    /**SEARCH CASE_INSENSITIVE */
    const collection = Student.getDatastore().manager.collection(Student.tableName);
    let result = [];
    if (params.length && params.start) {
      result = await collection.find(where).limit(limit).skip(skip).sort(newSort);
    } else {
      result = await collection.find(where).sort(newSort);
    }
    const totalStudent = await collection.count(where);
    const dataWithObjectIds = await result.toArray();
    const arrStudent = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));


    // let arrStudent = await Student.find({ where, limit, skip, sort }).populate('parents');
    // handler to render datatable
    let resStudents = [];
    for (let studentObj of arrStudent) {
      let student = await StudentService.get({ id: studentObj.id });
      let tmpData = {};
      // ID
      tmpData.id = '<input class="js-checkbox-item" type="checkbox" value="' + student.id + '">';
      // CODE STUDENT
      //just get code of student (do not get code of school)
      tmpData.code = student.code;
      // AVATAR & FULLNAME
      let path = "/images/avatar2.png";
      if (student.gender == 0) path = "/images/female-kid.png";
      if (student.gender == 1) path = "/images/male-kid.png";
      if (student.avatar != "") {
        tmpData.fullName =
          `<div class="d-flex align-items-center">
            <img src="${student.avatar}" alt="profile" class="img-sm rounded-circle">
            <span> ${student.firstName + ' ' + student.lastName}</span>
          </div>`;
      } else {
        tmpData.fullName =
        `<div class="d-flex align-items-center">
          <img src="${path}" alt="profile" class="img-sm rounded-circle">
          <span> ${student.firstName + ' ' + student.lastName}</span>
        </div>`;
      }
      // var listMother = [];
      // var listFater = [];
      // _.each(student.parents, function (prt) {
      //   if(prt.gender==1) {
      //     listFater.push(prt)
      //   } else if (prt.gender==0) {
      //     listMother.push(prt)
      //   }
      // });
      // //MOTHER
      // var mothers="";
      // if(listMother.length==0) {
      //   mothers+="-";
      // } else {
      //   for(var i = 0;i<listMother.length;i++){
      //     if(i==listMother.length-1) {
      //       mothers+= listMother[i].firstName + ' ' + listMother[i].lastName;
      //     } else {
      //       mothers+= listMother[i].firstName + ' ' + listMother[i].lastName + ", ";
      //     }
      //   }
      // }
      // //FATHER
      // var fathers="";
      // if(listFater.length==0) {
      //   fathers+="-";
      // } else {
      //   for(var i = 0;i<listFater.length;i++){
      //     if(i==listFater.length-1) {
      //       fathers+= listFater[i].firstName + ' ' + listFater[i].lastName;
      //     } else {
      //       fathers+= listFater[i].firstName + ' ' + listFater[i].lastName + ", ";
      //     }
      //   }
      // }
     
      // tmpData.mothers = mothers;
      // tmpData.fathers = fathers;

      tmpData.mothers = '-';
      let student_mother = await Student_Parent.findOne({ student: studentObj.id, type: 0 });
      if (student_mother) {
        let mother = await Parent.findOne({ id: student_mother.parent });
        if (mother) tmpData.mothers = mother.firstName + ' ' + mother.lastName;
      }

      tmpData.fathers = '-';
      let student_father = await Student_Parent.findOne({ student: studentObj.id, type: 1 });
      if (student_father) {
        let father = await Parent.findOne({ id: student_father.parent });
        if (father) tmpData.fathers = father.firstName + ' ' + father.lastName; 
      }
      
      // BIRTHDAY
      tmpData.dateOfBirth = moment(student.dateOfBirth, "YYYY-MM-DD").format(dateFormat);
      // GENDER
      tmpData.gender = student.gender == 1 ? 'Male' : 'Female';
      // ADDRESS
      tmpData.currentAddress = student.currentAddress;
      
      if (student.status == 1) {
        tmpData.status = `
        <label class="switch">
          <input class="switchStatus" type="checkbox" data-id="${student.id}" checked>
          <span class="slider"></span>
        </label>`;
    } else {
      tmpData.status = `
        <label class="switch">
          <input class="switchStatus" type="checkbox" data-id="${student.id}">
          <span class="slider"></span>
        </label>`;
    }
      //URL
      student.url = "/backend/student/edit/";
      // TOOL
      tmpData.tool = await sails.helpers.renderRowAction(student); 
      resStudents.push(tmpData);
    };
    // let totalStudent = await StudentService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalStudent, recordsFiltered: totalStudent, data: resStudents });

  },
  
  switchStatus: async (req, res) => {
    sails.log.info("================================ StudentController.switchStatus => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.STUDENT_ID_REQUIRED);

    //CHECK OBJ IS EXISTED?
    let studentObj = await StudentService.get({ id: params.id });
    if (!studentObj) return res.badRequest(ErrorMessages.STUDENT_NOT_FOUND);

    //switch status of current obj
    if (studentObj.status == 1) studentObj = await StudentService.edit({ id: params.id }, { status: 0 });
    else studentObj = await StudentService.edit({ id: params.id }, { status: 1 });

    return res.json(studentObj);
    // END UPDATE
  },
};