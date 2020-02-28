class IndexAttendentBackendEKP extends BaseBackendEKP {
  constructor() {
    super();
    this.initialize();
  }

  initialize() {
    //DO NOT LOAD UNNESSESARY CLASS
    //Init form + list if page have BOTH  
    this.list = new ListIndexAttendentBackendEKP(this);
  }
}

class ListIndexAttendentBackendEKP {
  constructor(opts) {
    _.extend(this, opts);
    this.langUrl = this.lang == 'en' ? '' : '/js/backend/datatable.json';
    this.dataOrigin = [];
    this.tableObjV1 = $('#tblAttendentV1');
    this.tableObjV2 = $('#tblAttendentV2');
    this.modalUpdateAttendent = 'updateAttendent';
    this.modalObj = $('#' + this.modalUpdateAttendent);
    this.alert = this.modalObj.find('.alert');
    this.initialize();
  }


  initialize() {
    let _this = this;
    _this.initDataTable();
    _this.initTimePicker();
    _this.handleItemActions();
    _this.initDatePicker();
    _this.handleBranch();
  }

  initTimePicker() {
    if ($("#timepicker-example").length) {
      $('#timepicker-example').datetimepicker({
        format: 'HH:mm',
        icons: {
          up: "mdi mdi-arrow-up",
          down: "mdi mdi-arrow-down"
        }
      });
    }
  }

  validateHhMm(value) {
    var isValid = /^([0-1]?[0-9]|2[0-4]):([0-5][0-9])(:[0-5][0-9])?$/.test(value);
    return isValid;
  }

  initDataTable(dateChoosed) {
    let _this = this;
    let params = {};
    //ONCLICK EDIT LINK
    let searchParams = new URLSearchParams(window.location.search);
    params.classId = _this.tableObjV1.attr('data-classActive');
    params.date = dateChoosed ? moment(dateChoosed, "DD/MM/YYYY").format("DD-MM-YYYY") : moment().format("DD-MM-YYYY");
    params.branchId = searchParams.get('branchId');
    params.status = searchParams.get('status') || '1';
    //render datatable up to setting allow Shuttle person info
    if (_this.tableObjV1.attr('data-allowShuttlePersonInfo') == 'true') {
      this.tableObjV2.removeClass('hidden');
      this.tableObjV1.addClass('hidden');
      var tableV2 = this.tableObjV2.DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": `/api/v1/backend/class-${params.classId}/attendent?date=${params.date}&branchId=${params.branchId}`,
        "drawCallback": function (settings) {
          // Here the response
          _this.dataOrigin = settings.json.dataOrigin;
          console.log(settings.json);
        },
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [
          { "data": "code" },
          { "data": "student" },
          { "data": "time" },
          { "data": "parent" },
          { "data": "tool" },
        ],
        //Define first column without order
        columnDefs: [
          { "orderable": false, "targets": [0, -3] }
        ],
        "order": [],
        "iDisplayLength": 20,
        "aLengthMenu": [[20, 50, 100, -1], [20, 50, 100, "All"]],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        "pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "bDestroy": true,
      });
    } else {
      this.tableObjV1.removeClass('hidden');
      this.tableObjV2.addClass('hidden');
      var tableV1 = this.tableObjV1.DataTable({
        "language": {
          "url": this.langUrl
        },
        "processing": true,
        "serverSide": true,
        "ajax": `/api/v1/backend/class-${params.classId}/attendent?date=${params.date}&branchId=${params.branchId}`,
        "drawCallback": function (settings) {
          // Here the response
          _this.dataOrigin = settings.json.dataOrigin;
          // _this.checkIn();
          console.log(settings.json);
        },
        //Add column data (JSON) mapping from AJAX to TABLE
        "columns": [
          { "data": "code" },
          { "data": "student" },
          { "data": "status" },
        ],
        // columns: arrColumn, 
        // data: _this.dataOrigin,
        //Define first column without order
        columnDefs: [
          { "orderable": false, "targets": [0, -3, -2, -1] }
        ],
        "order": [],
        "iDisplayLength": 20,
        "aLengthMenu": [[20, 50, 100, -1], [20, 50, 100, "All"]],
        //"buttons": ['copy', 'excel', 'csv', 'pdf', 'print'],
        "pagingType": "numbers",
        //"sDom": "<'row'<'col-sm-6'><'col-sm-6 mb-10'B>>" + "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "sDom": "<'row'<'col-sm-6'l><'col-sm-6'f>>" + "<'row'<'col-sm-12'tr>>" + "<'row'<'col-sm-5'i><'col-sm-7'p>>",
        "bDestroy": true,
      });
    }
    if (params.classId) {
      $(".js-select2-branch").val(params.branchId).change();
      $(".js-select2-class").val(params.classId).change();
      // $(".js-select2-status").val(params.status).change();
    }
    // Onclick event to query data by Branch
    $('#branchBtn').on('click', (e) => {
      e.preventDefault();
      let branchID = $(".js-select2-branch option:selected").val()
      let classID = $(".js-select2-class option:selected").val()
      let status = $(".js-select2-status option:selected").val() 
      _this.routingPrepare(branchID, classID,status);
    })
  }
  routingPrepare(branchId,classId,status,gender) {
    let _this = this;
    const opts = [
      {'value':'/backend/attendent/filter?branchId=' + branchId + '&classId='+ classId + '&status=' + status, 'text':'Branch'}
    ];
      window.location = opts[0].value;
  }
  handleBranch() {
    $('.js-select2-branch').on('change', (e) => { 
      e.preventDefault();
      let branchID = $(".js-select2-branch option:selected").val()
      $.ajax({
        type: "GET",
        url: "/api/v1/backend/branch/get/"+ branchID,
        dataType: "json",
        success: function (data) {
          //data will hold an object with your response data, no need to parse
          $('#classes')
            .find('option')
            .remove()
            .end();
          var option = '';
          option += '<option value="0"> Chọn tất cả </option>';
          for (let classes of data.classes){
            option += '<option value="'+ classes.id + '">' + classes.title + '</option>';
          }
          $('#classes').append(option);
        }
      })
    })
  }
  handleItemActions() {
    /******** use in case shuttle person info is on *******/
    let _this = this;
    let objChoosed = null;
    //Click button UPDATE on table
    _this.tableObjV2.on('click', '.btn-attendent', function (e) {
      e.preventDefault();
      let attendentId = $(this).attr('data-attendentId');

      $('#updateAttendent').modal('show');
      let arrDataOrigin = _this.dataOrigin;
      // prepared array arrDataOrigin
      let obj = {};
      for (let item of arrDataOrigin) {
        obj[item.id] = item;
      };
      objChoosed = obj[attendentId];
      //Render data from response to form
      if (objChoosed) {
        console.log('objChoosed', objChoosed);
        //map id -> modal to edit
        _this.modalObj.attr('data-edit-id', objChoosed.id);
        //Update data to field

        if (objChoosed.student && objChoosed.student.avatar != '') {
          $('#studentAvatar').attr('src', objChoosed.student.avatar);
        } else if (objChoosed.student && objChoosed.student.gender == 0) {
          $('#studentAvatar').attr('src', '/images/female-kid.png');
        } else {
          $('#studentAvatar').attr('src', '/images/male-kid.png');
        }
        let studentCode = objChoosed.student && objChoosed.student.code ? objChoosed.student.code.split('_')[1] ? objChoosed.student.code.split('_')[1] : objChoosed.student.code.split('_')[0] : '';
        $('#studentCode').text(studentCode);
        let studentName = objChoosed.student ? objChoosed.student.firstName + ' ' + objChoosed.student.lastName : '';
        $('#studentName').text(studentName);
        let classTitle = objChoosed.classObj ? objChoosed.classObj.title : '';
        $('#classTitle').text(classTitle);

        
        let strHtml = '';
        _.each(objChoosed.arrParent, (itemParent) => {
          strHtml +=
            `<div class="col-12 col-md-6">
              <div class="form-check">
                  <label class="form-check-label" for="${itemParent.id}">
                      <input id="${itemParent.id}" type="radio" class="form-check-input" name="radioParent"
                          value="${itemParent.id}" ${objChoosed.parent ? (itemParent.id == objChoosed.parent.id ? "checked" : '') : ''}>
                      <i class="input-helper"></i> 
                      <div class="media">
                          <div class="pr-10">
                            <img class="mr-3 img-sm rounded-circle"
                                src="${itemParent.avatar != '' ? itemParent.avatar : itemParent.gender == 0 ? '/images/female.png' : '/images/male.png'}"
                                alt="...">
                          </div>
                          <div class="media-body">
                              <h5>${itemParent.fullName}</h5>
                              <i class="mdi mdi-cellphone-iphone"></i>
                              <span>${itemParent.phone}</span>
                          </div>
                      </div>
                  </label>
              </div>
            </div>`
        })

        //add 'other' option
        strHtml +=
          `<div class="col-12 col-md-6">
            <div class="form-check">
              <label class="form-check-label" for="otherOption">
                <input id="otherOption" type="radio" class="form-check-input" name="radioParent"
                  value="" ${!objChoosed.parent ? "checked" : ''}>
                <i class="input-helper"></i> 
                <div class="media">
                  <div class="media-body">
                    <h5>Other</h5>
                  </div>
                </div>
              </label>
            </div>
          </div>`
          
        $('#updateAttendent').find('.listParent').html(strHtml);

        //show note if 'other' option is choose
        if (!objChoosed.parent) {
          $('#noteContainer').removeClass('hidden');
        } else {
          $('#noteContainer').addClass('hidden');
        }

        if(objChoosed.time != '') _this.modalObj.find(`[name="time"]`).val(objChoosed.time);
        _this.modalObj.find(`[name="note"]`).val(objChoosed.note);

        
        //Choose 'other' option
        _this.modalObj.find(`[name=radioParent]`).change(() => {
          if ($('#otherOption').is(':checked')) {
            $('#noteContainer').removeClass('hidden');
          }else {
            $('#noteContainer').addClass('hidden');
          }
        })
      }

    });

    // Submit update attendent
    $('#btnUpdateAttendent').click(() => {
      let params = {};
      params.id = this.modalObj.attr('data-edit-id');
      params.classId = objChoosed.classObj.id;
      params.time = $('#timeAttendent').val();
      params.note = $('#note').val();
      params.parent = $('input[name=radioParent]:checked').val();
      if (!params.time) {
        swal(this.messages.dataInvalid, {
          icon: "warning",
          button: false,
        });
      } else if (!_this.validateHhMm(params.time)) {
        swal(this.messages.hourFormatInvalid, {
          icon: "error",
          button: false,
        });
      } else {
        console.log('params', params);
        Cloud.editAttendent.with(params).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
          if (err) {
            if (responseBody.message) {
              _this.alert.removeClass('d-none').addClass("alert-warning").html(responseBody.message);
              setTimeout(function(){
                _this.alert.removeClass('alert-warning').addClass("d-none");
              }, 3000);
              return;
            } else {
              _this.alert.removeClass('d-none').addClass("alert-danger").html(_this.messages.error);
              setTimeout(function(){
                _this.alert.removeClass('alert-danger').addClass("d-none");
              }, 3000);
              return;
            }
          } else {
            swal(this.messages.editSuccess, {
              icon: "success",
              button: false,
            });
            $('#updateAttendent').modal('hide');
            //THEN RELOAD TABLE IF NEEDED 
            window.curBackendEKP.list.initDataTable(moment(objChoosed.date, 'YYYY-MM-DD').format('DD-MM-YYYY'));
          }
        });
      }
    })

    /********* use in case shuttle person info is off *******/
    //Switch status attendent of student
    _this.tableObjV1.on('change', '.checkIn', function (e) {
      let attendentId = $(this).val();
      // CALL AJAX TO SWITCH STATUS ATTENDENT OF STUDENT
      $.ajax({
        type: "POST",
        url: "/api/v1/backend/attendent/checkIn/" + attendentId,
        dataType: 'json'
      })
    });
  }

  initDatePicker() {
    //init datepicker
    let _this = this;
    let inpDate = $('.dateAttendent input');
    let curDate = moment().format("DD/MM/YYYY");
    inpDate.datepicker({
      format: 'dd/mm/yyyy',
      todayHighlight: true,
      orientation: 'bottom right',
      autoclose: true,
      endDate: new Date()
    }).datepicker('setDate', curDate).on("changeDate", function (e) {
      console.log("hihi" + inpDate.val());
      //THEN RELOAD TABLE IF NEEDED 
      window.curBackendEKP.list.initDataTable(inpDate.val());
    });
  }
}