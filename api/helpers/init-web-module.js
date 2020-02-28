module.exports = {
  friendlyName: 'Generate default web module',
  description: 'Generate default web module',

  inputs: {
    req: {
      type: 'ref',
      description: 'The current incoming request (req).',
      required: true
    }
  },
  exits: {
    success: {}
  },
  fn: async function (inputs, exits) {
    let _breadcumbs = [
      {
        title: '',
        href: '',
        active: true
      }
    ]
    /*
      let _actions = [
      {
      'title': '#',
      'href': '#'
      }];
     */
    let _actions = [];
    let _filter = [];
    let countAll = 0; //status = -1
    let active = 0; //status = 1
    let inactive = 0; //status = 0

    let _default = {
      headline : '',
      description : '',
      breadcumbs : _breadcumbs,
      url: inputs.req.options.action,
      actions: _actions,
      filters: _filter
    }; 

    let params = inputs.req.allParams();
    let currentCourseSession = await CourseSessionService.get({ current: true });

    let listClasses = await ClassService.find({ courseSession: currentCourseSession.id,status: sails.config.custom.STATUS.ACTIVE });
   
    let listBranches = await BranchService.find({ status: sails.config.custom.STATUS.ACTIVE });

    let sortBranchArr = [];

    // CHECK CLASS AVAILABLE WITH CURRETN SESSION
    for (let branch of listBranches) {
      let classAvailable = [];
      for (let classes of branch.classes) {
        if (classes.courseSession == currentCourseSession.id) {
          classAvailable.push(classes)
        }
      }  
      branch.classes = classAvailable;
      sortBranchArr.push(branch);
    }

    listBranches = sortBranchArr;

    let objBranch = {
      'title': sails.__('Branch'),
      'href': '?branchId=0',
      'branch': listBranches
    }
    switch (inputs.req.options.action) {

      //---------------------DASHBOARD---------------------
      case 'backend/dashboard/index':
        _default.headline = sails.__('Dashboard');
        _default.description = sails.__('Dashboard');
      break;
      
      //---------------------SETTING---------------------
      case 'backend/setting/index':
        _default.headline = sails.__('Settings');
        _default.description = sails.__('Settings');
        break;
      
      //---------------------FEE COLLECTION SETTING---------------------
      case 'backend/setting/fee-collection-setting':
        _default.headline = sails.__('Settings');
        _default.description = sails.__('Settings');
      break;
      
      //---------------------STUDENT---------------------
      case 'backend/student/list':
        _default.headline = sails.__('Students');
        _default.description = sails.__('Students');
        _default.actions = [{
            'title': sails.__('Add New'),
            'href': '/backend/student/add'
        },
        // {
        //   'title': sails.__('List Student'),
        //   'href': '/backend/student/list' 
        // },
        {
            'title': sails.__('Import'),
            'href': 'importStudent'
          },
        ];

        // let classObj = {};
        // let stdIds = [];
        // if (params.branchId && params.classId && params.classId != '0' && params.classId != 'undefined') {
        //   classObj = await Class.findOne({ id: params.classId, branch: params.branch }).populate('students');
        //   stdIds = classObj.students.map((std) => {
        //     return std.id;
        //   })
        // } else if (params.branchId) {
        //   classObj = clsObj = await Class.find({ branch: params.branchId }).populate('students');
        //   for (let classes of classObj){
        //     classes.students.map((std) => {
        //       stdIds.push(std.id);
        //     })
        //   }
        // }
        
        // active = await StudentService.count({ id: stdIds, status: sails.config.custom.STATUS.ACTIVE });
        // inactive = await StudentService.count({ id: stdIds, status: sails.config.custom.STATUS.DRAFT });
         _default.filters = [
        //   {
        //     'title': sails.__('Active'),
        //     'href': '?status=1',
        //     'count': active
        //   },
        //   {
        //     'title': sails.__('Inactive'),
        //     'href': '?status=0',
        //     'count': inactive
        //   },
          objBranch
        ]
        
      break;
      case 'backend/student/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit student');
          _default.description = sails.__('Edit student');
          _default.actions = [];
        } else {
          _default.headline = sails.__('Add new student');
          _default.description = sails.__('Add new student');
          _default.actions = [];
        }
      break;
      
      //---------------------POST---------------------
      case 'backend/post/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit post');
          _default.description = sails.__('Edit post');
        } else {
          _default.headline = sails.__('Add new post');
          _default.description = sails.__('Add new post');
        }
        _default.actions = [];
      break;
      case 'backend/post/list':
        _default.headline = sails.__('Posts');
        _default.description = sails.__('Posts');
        _default.actions = [{
            'title': sails.__('Add new post'),
            'href': '/backend/post/add'
          }
        ];

        active = await PostService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await PostService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
      
      //---------------------USER---------------------
      case 'backend/user/index':
        _default.headline = sails.__('Staffs');
        _default.description = sails.__('Staffs');
        _default.actions = [{
            'title': sails.__('Add new staff'),
            'href': '/backend/user/add'
          }
        ];

        let type = params.userType ? params.userType : 1;
        active = await UserService.count({ status: sails.config.custom.STATUS.ACTIVE, userType: type });
        inactive = await UserService.count({ status: sails.config.custom.STATUS.DRAFT, userType: type });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?userType=' + type + '&status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?userType=' + type + '&status=0',
            'count': inactive
          },
        ];
        _default.isUserList = true;
      break;      
      //---------------------USER-FORM---------------------
      case 'backend/user/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit staff');
          _default.description = sails.__('Edit staff');
        } else {
          _default.headline = sails.__('Add new');
          _default.description = sails.__('Add new');
        }
        _default.actions = [];
      break;      
      //---------------------COURSE-SESSION---------------------
      case 'backend/coursesession/index':
        _default.headline = sails.__('Course sessions');
        _default.description = sails.__('Course sessions');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];

        active = await CourseSessionService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await CourseSessionService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;   
      //---------------------SUBJECT---------------------
      case 'backend/subject/index':
        _default.headline = sails.__('Subjects');
        _default.description = sails.__('Subjects');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        active = await SubjectService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await SubjectService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;   
      //---------------------FOOD---------------------
      case 'backend/food/index':
        _default.headline = sails.__('Foods');
        _default.description = sails.__('Foods');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        active = await FoodService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await FoodService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
        break;   
      //---------------------BRANCH---------------------
      case 'backend/branch/list':
        _default.headline = sails.__('Branches');
        _default.description = sails.__('Branches');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        active = await BranchService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await BranchService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
      //---------------------CLASS---------------------
      case 'backend/class/list':
        _default.headline = sails.__('Classes');
        _default.description = sails.__('Classes');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        active = await ClassService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await ClassService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
       //---------------------TUITION---------------------
      // case 'backend/tuition/index':
      //   _default.headline = sails.__('Tuitions');
      //   _default.description = sails.__('Tuitions');
      //   _default.actions = [{
      //       'title': sails.__('Add new'),
      //       'modal': '#modal-edit'
      //   }
      //   ];

      //   active = await TuitionService.count({ status: sails.config.custom.STATUS.ACTIVE, courseSession: inputs.req.session.courseSessionActive  });
      //   inactive = await TuitionService.count({ status: sails.config.custom.STATUS.DRAFT, courseSession: inputs.req.session.courseSessionActive });
      //   _default.filters = [
      //     {
      //       'title': sails.__('Active'),
      //       'href': '?status=1',
      //       'count': active
      //     },
      //     {
      //       'title': sails.__('Inactive'),
      //       'href': '?status=0',
      //       'count': inactive
      //     },
      //   ];
      // break;
       //---------------------CATEGORY---------------------
      case 'backend/taxonomy/categories':
        _default.headline = sails.__('Categories');
        _default.description = sails.__('Categories');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];

        active = await TaxonomyService.count({ status: sails.config.custom.STATUS.ACTIVE, type: sails.config.custom.TYPE.CATEGORY });
        inactive = await TaxonomyService.count({ status: sails.config.custom.STATUS.DRAFT, type: sails.config.custom.TYPE.CATEGORY });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
      //---------------------TAGS---------------------
      case 'backend/taxonomy/tag':
        _default.headline = sails.__('Tags');
        _default.description = sails.__('Tags');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];

        active = await TaxonomyService.count({ status: sails.config.custom.STATUS.ACTIVE, type: sails.config.custom.TYPE.TAG });
        inactive = await TaxonomyService.count({ status: sails.config.custom.STATUS.DRAFT, type: sails.config.custom.TYPE.TAG });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
       //---------------------NOTIFICATION---------------------
      case 'backend/notification/list':
        _default.headline = sails.__('Notifications');
        _default.description = sails.__('Notifications');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
          }
        ];

        active = await NotificationService.count({ status: sails.config.custom.STATUS.ACTIVE, type: { in: [-1,0] }});
		    inactive = await NotificationService.count({ status: sails.config.custom.STATUS.DRAFT, type: { in: [-1,0] }});
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Pending'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;
      //---------------------ALBUM-FORM---------------------
      case 'backend/album/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit album');
          _default.description = sails.__('Edit album');
        } else {
          _default.headline = sails.__('Add New');
          _default.description = sails.__('Add New');
        }
        _default.actions = [];
      break;      
      //---------------------ALBUM-VIEW---------------------
      case 'backend/album/view':
        _default.headline = sails.__('View album');
        _default.description = sails.__('View album');
        _default.actions = [];
      break;      
      //---------------------ALBUM---------------------
      case 'backend/album/list':
        _default.headline = sails.__('Albums');
        _default.description = sails.__('Albums');
        _default.actions = [{
            'title': sails.__('Add New'),
            'href': '/backend/album/add'
          }
        ];

        active = await AlbumService.count({ status: sails.config.custom.STATUS.ACTIVE});
        inactive = await AlbumService.count({ status: sails.config.custom.STATUS.DRAFT});
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
      break;      
      //---------------------PARENT---------------------
      case 'backend/parent/list':
        _default.headline = sails.__('Parent');
        _default.description = sails.__('Parent');
        _default.actions = [{
            'title': sails.__('Add new'),
            'href': '/backend/parent/add'
          },
          {
            'title': sails.__('Import'),
            'href': 'importParent'
          }
        ];
        let classObject = [];
        let studentdIds = [];
        if (params.classId == '0') {
          classObject = await Class.find({ branch: params.branchId }).populate('students');
          for (let classes of classObject) {
            classes.students.map((std) => {
              studentdIds.push(std.id);
            })
          }  
        } else {
          classObject = await Class.find({ id: params.classId }).populate('students');
          studentdIds = classObject[0].students.map((std) => {
            studentdIds.push(std.id);
          })
        }
        
        let relationsStd_Prnt = await Student_Parent.find({ student: studentdIds });
        let parentIds = relationsStd_Prnt.map((rls) => {
            return rls.parent;
        })
        parentIds = _.union(parentIds);

        active = await ParentService.count({ id: parentIds, status: sails.config.custom.STATUS.ACTIVE });
        inactive = await ParentService.count({ id: parentIds, status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
          objBranch
        ]
      break;  
       //---------------------PARENT-FORM---------------------
      case 'backend/parent/form':
        if(inputs.req.params.id) {
          _default.headline = sails.__('Edit parent');
          _default.description = sails.__('Edit parent');
        } else {
          _default.headline = sails.__('Add new');
          _default.description = sails.__('Add new');
        }
        _default.actions = [];
      break;  
      //---------------------IMPORT-PARENT---------------------
      case 'backend/import/parent':
        _default.headline = sails.__('Import parent');
        _default.description = sails.__('Import parent');
        _default.actions = [];
      break;       
      //---------------------IMPORT-STUDENT---------------------
      case 'backend/import/form':
        _default.headline = sails.__('Import students');
        _default.description = sails.__('Import students');
        _default.actions = [];
      break;          
      //---------------------ATTENDENT---------------------
      case 'backend/attendent/index':
        _default.headline = sails.__('Attendent');
        _default.description = sails.__('Attendent');
        _default.actions = [];
        _default.filters = [objBranch];
      break;
      //---------------------PICKUP---------------------
      case 'backend/pickup/index':
        _default.headline = sails.__('Pickup');
        _default.description = sails.__('Pickup');
        _default.actions = [];
        _default.filters = [objBranch];
      break;          
      //---------------------SCHEDULE---------------------
      case 'backend/schedule/index':
        _default.headline = sails.__('Schedule');
        _default.description = sails.__('Schedule');
        _default.actions = [{
          'title': sails.__('Add new'),
          'modal': '#modalSchedule'
        }
        ];
      break;          
      //---------------------MENU---------------------
      case 'backend/menu/index':
        _default.headline = sails.__('Menu');
        _default.description = sails.__('Menu');
        _default.actions = [{
          'title': sails.__('Add new'),
          'modal': '#modalMenu'
        }];
      break;         
      //---------------------MESSENGER---------------------
      case 'backend/message/index':
        _default.headline = sails.__('Messenger');
        _default.description = sails.__('Messenger');
        _default.actions = [];
      break;    
      //---------------------MESSENGER DETAILS ---------------------
      case 'backend/message/detail':
        _default.headline = sails.__('Messenger');
        _default.description = sails.__('Messenger');
        _default.actions = [];
      break;         
      //---------------------REPORT-TUITION----------------------
      // case 'backend/report/tuition':
      //   _default.headline = sails.__('Report tuition');
      //   _default.description = sails.__('Report tuition');
      //   _default.actions = [];
        
      //   let arrStudentId = [];
      //   if (params.classActive != '' && params.classActive != 'all') {
      //     let respListRelation = await Student_Class.find({ classObj: params.classActive });
      //     _.each(respListRelation, (objRelation) => {
      //       arrStudentId.push(objRelation.student)
      //     })
      //   }
      //   countAll = await ReportTuitionService.count({ student: arrStudentId });
      //   active = await ReportTuitionService.count({ paid: sails.config.custom.PAID.PAIDED, student : arrStudentId });
      //   inactive = await ReportTuitionService.count({ paid: sails.config.custom.PAID.UNPAID, student : arrStudentId });
      //   _default.filters = [
      //     {
      //       'title': sails.__('All'),
      //       'href': '?paid=-1',
      //       'count': countAll
      //     },
      //     {
      //       'title': sails.__('Paid'),
      //       'href': '?paid=1',
      //       'count': active
      //     },
      //     {
      //       'title': sails.__('Unpaid'),
      //       'href': '?paid=0',
      //       'count': inactive
      //     },
      //   ];
      // break;         
      //---------------------PROFILE----------------------
      case 'backend/account/view-edit-profile':
        _default.headline = sails.__('Edit profile');
        _default.description = sails.__('Edit profile');
        _default.actions = [];

        break;
      
      //---------------------CURRENCY---------------------
      case 'backend/currency/index':
        _default.headline = sails.__('Currency');
        _default.description = sails.__('Currency');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        active = await CurrencyService.count({ status: sails.config.custom.STATUS.ACTIVE });
        inactive = await CurrencyService.count({ status: sails.config.custom.STATUS.DRAFT });
        _default.filters = [
          {
            'title': sails.__('Active'),
            'href': '?status=1',
            'count': active
          },
          {
            'title': sails.__('Inactive'),
            'href': '?status=0',
            'count': inactive
          },
        ];
        break; 
      
      //---------------------FEE ITEM---------------------
      case 'backend/feeitem/index':
        _default.headline = sails.__('Fee Items');
        _default.description = sails.__('Fee Items');
        _default.actions = [{
            'title': sails.__('Add new'),
            'modal': '#modal-edit'
        }
        ];

        // active = await FeeItemService.count({ status: sails.config.custom.STATUS.ACTIVE });
        // inactive = await FeeItemService.count({ status: sails.config.custom.STATUS.DRAFT });
        // _default.filters = [
        //   {
        //     'title': sails.__('Active'),
        //     'href': '?status=1',
        //     'count': active
        //   },
        //   {
        //     'title': sails.__('Inactive'),
        //     'href': '?status=0',
        //     'count': inactive
        //   },
        // ];
        _default.filters = [];
        break; 
        
      //---------------------FEE INVOICE---------------------
      case 'backend/feeinvoice/index':
        _default.headline = sails.__('Fee Invoices');
        _default.description = sails.__('Fee Invoices');
        _default.actions = [
          {
            'title': sails.__('Add new'),
            'href': '/backend/feeinvoice/add'
          }
        ];
        _default.filters = [];
        break;
      
      //---------------------ADD FEE INVOICE---------------------
      case 'backend/feeinvoice/form':
        _default.headline = sails.__('Add Fee Invoices');
        _default.description = sails.__('Add Fee Invoices');
        _default.actions = [];
        _default.filters = [];
      break;
  }
    return exits.success(_default);
  }
};
