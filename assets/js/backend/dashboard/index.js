class IndexDashboardBackendEKP extends BaseBackendEKP {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    //DO NOT LOAD UNNESSESARY CLASS
    this.view = new ViewIndexDashboardBackendEKP(this);
  }
}

class ViewIndexDashboardBackendEKP {
  constructor(opts) {
    _.extend(this, opts);
    this.langUrl = this.lang == 'en' ? '' : '/js/backend/datatable.json';
    this.initHeightScrollbar(); 
    this.handleSelectionSchedule();
    this.handleSelectionMenu();
    this.initDataTableClassSize();
    this.handleSelectionTuition();
    this.initDataTableBirthday();
  }

  initHeightScrollbar() {
    $('.js-height-scrollbar').perfectScrollbar();
  }
  initSelectPicker() {
    $('.chooseClass').selectpicker();
  } 
  handleSelectionSchedule() {
    let classid = $('#scheduleSelect').val();
    if (classid != '') {
      var tableNoData = $('#tblSchedule').DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchSchedule?classID=" + classid,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "time"
          },
          {
            "data": "subject"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-lg-12'tr>>",
        "bDestroy": true,
        "ordering": false
      });
      tableNoData.draw();
    }
    $('#scheduleSelect').on('change', function (e) {
      let classID = $(this).children('option:selected').val();;
      var table = $('#tblSchedule').DataTable({
        "language": {
          "url": "/js/backend/datatable.json"
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchSchedule?classID=" + classID,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "time"
          },
          {
            "data": "subject"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-lg-12'tr>>",
        "bDestroy": true,
        "ordering": false
      });
      table.draw();
    });
  }
  handleSelectionMenu() {
    let classid = $('#menuSelect').val();
    if (classid != '') {
      var tableNoData = $('#tblMenu').DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchMenu?classID=" + classid,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "time"
          },
          {
            "data": "food"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-lg-12'tr>>",
        "bDestroy": true,
        "ordering": false
      });
      tableNoData.draw();
    }
    $('#menuSelect').on('change', function (e) {
      let classID = $(this).children('option:selected').val();;
      var table = $('#tblMenu').DataTable({
        "language": {
          "url": "/js/backend/datatable.json"
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchMenu?classID=" + classID,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "time"
          },
          {
            "data": "food"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-lg-12'tr>>",
        "bDestroy": true,
        "ordering": false
      });
      table.draw();
    });
  }
  initDataTableClassSize() {
    var table = $('#tblClass').DataTable({
      "language": {
        "url": this.langUrl
      },
      "processing": true,
      "serverSide": true,
      "ajax": "/api/v1/backend/dashboard/searchClassSize",
      //Add column data (JSON) mapping from AJAX to TABLE
      "columns": [{
          "data": "className"
        },
        {
          "data": "attendent"
        }
      ],
      //Define first column without order
      columnDefs: [{
        "orderable": false,
        "targets": [0, -1]
      }],
      "order": [
        [1, "asc"]
      ],
      "iDisplayLength": 10,
      "aLengthMenu": [
        [10, 50, 100, -1],
        [10, 50, 100, "All"]
      ],
      //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
      //"pagingType": "numbers",
      //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
      "sDom": "<'row'<'col-lg-12'tr>>",
      "bDestroy": true,
      "ordering": false
    });
    table.draw();
  }
  handleSelectionTuition() {
    let classid = $('#tuitionSelect').val();
    if (classid == '') {
      var tableNoData = $('#tblTuition').DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchMenu?classID=" + classid,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "title"
          },
          {
            "data": "price"
          },
          {
            "data": "deadline"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-lg-12'tr>>",
        "bDestroy": true,
        "ordering": false,
        "autoWidth": false
      });
      tableNoData.draw();
    }
    $('#tuitionSelect').on('change', function () {
      let classID = $(this).children('option:selected').val();
      var table = $('#tblTuition').DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": "/api/v1/backend/dashboard/searchTuition?classID=" + classID,
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [{
            "data": "title"
          },
          {
            "data": "price"
          },
          {
            "data": "deadline"
          }
        ],
        //Define first column without order
        columnDefs: [{
          "orderable": false,
          "targets": [0, -1]
        }],
        "order": [
          [1, "asc"]
        ],
        "iDisplayLength": false,
        "aLengthMenu": [
          [20, 50, 100, -1],
          [20, 50, 100, "All"]
        ],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        //"pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        //"sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-sm-12'tr>>",
        "bDestroy": true,
        "ordering": false,
        "autoWidth": false
      });
      table.draw();
    });

  }

  initDataTableBirthday() {
    let tblBirthday = $('#tblBirthday').DataTable({
      "language": {
        "url": this.langUrl
      },
      "scrollY": "300px",
      "scrollCollapse": true,
      "paging": false,
      "sDom": "<'row'<'col-sm-12'tr>>",
      "ordering": false,
      "autoWidth": false,
      "initComplete": function (settings, json) {
        $('body').find('.dataTables_scrollBody').addClass("birthday-scroller");
      },
    });
  }
}