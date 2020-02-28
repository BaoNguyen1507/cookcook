const makeDir = require('make-dir');
const fs = require('fs');
const moment = require('moment');
const ErrorMessages = require('../../../../config/errors');
module.exports = {
 
  importStudentExcel: async (req, res) => {
      sails.log.info("================================ ImportController.Import => START ================================");
      // GET ALL PARAMS
      let params = req.allParams();
      let timeStamp = _.now();
      let year = moment().format('YYYY');
      let month = moment().format('MM');
      let currentPath = 'assets/excel/' + year+ '/' + month;
      let originFolder = '';
  
      if (fs.existsSync(currentPath)) {
        originFolder = require('path').resolve(sails.config.appPath, currentPath)
      } else {
        currentPath = await makeDir(currentPath);
        originFolder = currentPath;
      }
      const excelToJson = require('convert-excel-to-json');
      
      req.file('file').upload({
        dirname: originFolder
      },async (err, file) => {
        if (err) {
          return res.badRequest(err);
        } else {
          console.log(file[0].fd);
          
          var dir = require('node-dir');
          //var files = dir.files(originFolder, { sync: true });
          const data = fs.readdirSync(originFolder, { encoding: 'utf-8' })
            //
          console.log(originFolder);
          const result = excelToJson({
            sourceFile: originFolder + '/' +data[0]
          });
          var obj = Object.values(result);
          
          //arr of line which have error data
          let arrErrorLine = []
          for (let i = 1; i < obj[0].length; i++){
            let tab = obj[0][i];

            //CHECK LINE DATA IS VALID
            if((!tab.A) || (!tab.B) || (!tab.C) || (!tab.D) || !moment(tab.D, 'YYYY-MM-DD',true).isValid() || (!tab.E) || !parseFloat(tab.G) == true || !parseFloat(tab.H) == true || !parseInt(tab.L) == true || !parseInt(tab.M) == true || !parseInt(tab.O) == true || ![0,1].includes(parseInt(tab.O))) {
              //return res.badRequest(ErrorMessages.STUDENT_ERROR_IMPORT);
              arrErrorLine.push(i+1);
            } else {
              let tmpObj= {}
              let _gender;
              if(tab.E == 'O') {
                _gender = 0;
              }
              else {
                _gender = 1;
              }
              let code = '';
              code = tab.C,
              tmpObj = {
                code: code, // REQUIRED
                firstName: tab.A,// REQUIRED
                lastName: tab.B,// REQUIRED
                dateOfBirth: tab.D, // REQUIRED
                gender: _gender, // REQUIRED
                currentAddress: tab.F,
                height: parseInt(tab.G),
                weight: parseInt(tab.H),
                bloodGroup: tab.I,
                allergy: tab.J,
                heartRate: tab.K,
                eyes: tab.L,
                ears: tab.M,
                notes: tab.N,
                status: tab.O
              }
              //CHECK STUDENT WITH CODE IS EXISTED?
              let student = await StudentService.get({ code: code });
              // IF STUDENT IS EXISTED? => UPDATE INFO STUDENT
              if (student) {
                await StudentService.edit({ id: student.id }, tmpObj);

                //CHECK RELATION IS EXIST? 
                let student_class = await Student_Class.findOne({ student: student.id, classObj: params.classObj });
                // ADD RELATION IF NOT EXIST
                if (!student_class) await Student.addToCollection(student.id, 'classes').members([params.classObj]);
              } else {
                // ADD NEW DATA STUDENT
                let studentObj = await StudentService.add(tmpObj);
                //ADD RELATION WITH CLASS
                await Student.addToCollection(studentObj.id, 'classes').members([params.classObj]);
              } 
            }
          }

          //UPDATE TOTAL STUDENT FOR CLASS OBJ
          //count Class in table relation Student - Class
          let totalCount = await Student_Class.count({ classObj: params.classObj });
          //edit info class
          await Class.update({ id: params.classObj }).set({ totalStudent: totalCount });

          // END ADD STUDENT
          fs.unlinkSync(originFolder + '/' + data); //REMOVE FILE EXCEL AFTER IMPORT
          
          if (arrErrorLine.length) {
            let STUDENT_ERROR_IMPORT = { code: 'STUDENT_ERROR_IMPORT', message: "Cannot import data at line: " + arrErrorLine.join(', ') };
            return res.badRequest(STUDENT_ERROR_IMPORT);
          }

          return res.ok({
            status: 200,
          })
        }
      });
  },
  importParentExcel: async (req, res) => {
      sails.log.info("================================ ParentController.Import => START ================================");
      // GET ALL PARAMS
      let params = req.allParams();
      let timeStamp = _.now();
      let year = moment().format('YYYY');
      let month = moment().format('MM');
      let currentPath = 'assets/excel/' + year+ '/' + month;
      let originFolder = '';
  
      if (fs.existsSync(currentPath)) {
        originFolder = require('path').resolve(sails.config.appPath, currentPath)
      } else {
        currentPath = await makeDir(currentPath);
        originFolder = currentPath;
      }
      const excelToJson = require('convert-excel-to-json');
      
      req.file('file').upload({
        dirname: originFolder
      },async (err, file) => {
        if (err) {
          return res.badRequest(err);
        } else {
          console.log(file[0].fd);
          
          var dir = require('node-dir');
          //var files = dir.files(originFolder, { sync: true });
          const data = fs.readdirSync(originFolder, { encoding: 'utf-8' })
            //
          console.log(originFolder);
          const result = excelToJson({
            sourceFile: originFolder + '/' +data[0]
          });
          
          var obj = Object.values(result);

          //arr of line which have error data
          let arrErrorLine = []
          for (let i = 1; i < obj[0].length; i++) {
            let tab = obj[0][i];
            
            let code = '';
            code = tab.A;
            //GET STUDENT FOR UPDATE RELATION
            let student = await Student.findOne({ code: code });

            if (!student) { //CHECK STUDENT CODE IS VALID?
              arrErrorLine.push(i+1)
            } else if ((!tab.B) || (!tab.C) || (!tab.G) || (!tab.I) || (!tab.J) || !moment(tab.F, 'YYYY-MM-DD', true).isValid() || isNaN(tab.J) || tab.J.length != 6 || !parseInt(tab.L) == true || ![0, 1].includes(parseInt(tab.L))) { //CHECK LINE DATA IS VALID
              arrErrorLine.push(i+1);
            } else {
              let tmpObj = {}
              let _type;
              if (tab.D == 'X') {
                _type = 1;
              }
              else {
                _type = 0;
              }
              // CHECK PARENT UNIQUE
              let email = await Parent.findOne({ emailAddress: tab.G });
              let phoneNumber = await Parent.findOne({ phone: tab.I });
              // END CHECK PARENT UNIQUE

              //PREPARE DATA
              tmpObj = {
                firstName: tab.B,
                lastName: tab.C,
                emailAddress: tab.G,
                phone: tab.I,
                password: await sails.helpers.passwords.hashPassword(tab.J),
                birthday: tab.F,
                profession: tab.H,
                currentAddress: tab.K,
                gender: _type,
                status: tab.L
              }

              //RELATION WITH STUDENT
              let typeRelation = 2;
              if (tab.D == 'X' && tab.E == 'X') {
                typeRelation = 1;
              } else if (tab.D == 'O' && tab.E == 'X') {
                typeRelation = 0;
              }

              //CHECK MOTHER OR FATHER IS EXISTED => IF EXIST => UPDATE TO GUARDIAN
              if (typeRelation == 0 || typeRelation == 1) {
                let student_parent = await Student_Parent.findOne({ student: student.id, type: typeRelation });
                if (student_parent) await Student_Parent.update({ id: student_parent.id }).set({ type: 2 });
              }
              
              if (email || phoneNumber) {
                let parentId = '';
                if (email) parentId = email.id
                else parentId = phoneNumber.id

                // UPDATE DATA
                await ParentService.edit({ id: parentId }, tmpObj);

                //ADD RELATION IF NOT EXIST
                let exist = await Student_Parent.findOne({ student: student.id, parent: parentId });
                if (!exist) {
                  await Student_Parent.create({ student: student.id, parent: parentId, type: typeRelation });
                } else { //UPDATE TYPE IF EXISTED
                  Student_Parent.update({ id: exist.id }).set({ type: typeRelation });
                }
              } else {
                // ADD NEW DATA PARENT
                let parentObj = await ParentService.add(tmpObj);
                //ADD RELATION WITH STUDENT
                await Student_Parent.create({ student: student.id, parent: parentObj.id, type: typeRelation });
              }
            }
          }
          
         
        // END ADD PARENT
          fs.unlinkSync(originFolder + '/' + data[0]); //REMOVE FILE EXCEL AFTER IMPORT

          if (arrErrorLine.length) {
            let PARENT_ERROR_IMPORT = { code: 'PARENT_ERROR_IMPORT', message: "Can not import data at line(s): " + arrErrorLine.join(', ') };
            return res.badRequest(PARENT_ERROR_IMPORT);
          }

          return res.ok({
            status: 200,
          })
        }
      });
  }
};