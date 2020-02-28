class IndexSettingSABackendEKP {
  constructor() {
    this.initialize();
  }

  initialize() {
    this.form = new FormSettingSABackendEKP(this);
  }
}
class FormSettingSABackendEKP {
  constructor(opts) {
    _.extend(this, opts);
    this.formId = 'formSettingSA';
    this.formObj = $('#' + this.formId);
    
    this.alert = this.formObj.find('.alert');
    this.initialize();
  }

  initialize() {
    let _this = this; 
    _this.countSlot = $('#web').attr('data-countSlot');
    _this.initValidation();
    _this.initRepeater();
    _this.initTimePicker();
    $('.js-process-basic-multiple').select2({width: '100%'});
  } 

  initValidation() {
    let _this = this;
    _this.formObj.formValidation({
      button: {
        selector: '#btnFormSettingSA',
        disabled: 'disabled'
      },
      fields: {
        //Can combine both html5 mode and js mode
        //Refer: http://formvalidation.io/examples/attribute/
        /*alias: {
          validators: {
            notEmpty: {
              message: 'The title is required and cannot be empty'
            }
          }
        },*/
      },
      err: {
        clazz: 'invalid-feedback'
      },
      control: {
        // The CSS class for valid control
        valid: 'is-valid',
        // The CSS class for invalid control
        invalid: 'is-invalid'
      },
      row: {
        invalid: 'has-danger'
      },
      onSuccess: function (e) {
        //e.preventDefault();
        //console.log('FORM can submit OK');
      }
    })
      .on('success.form.fv', function (e) {
        // Prevent form submission
        e.preventDefault();
        console.log('----- FORM Setting ----- [SUBMIT][START]');
        let $form = $(e.target);
        let formData = $form.serializeArray();
        let tmpData = {};
        _.each(formData, (item) => {
          if (!item.name.includes('slotFeedings') && item.name != 'weekend') {
            tmpData[item.name] = item.value;
          }
        });
        //get weekend
        tmpData.weekend = $('#weekend').val();

        //get all array {time+food} of all repeater
        let tmpSlotFeedingArr = $('.repeater').repeaterVal();
        tmpData.rangeTimeMenu = tmpSlotFeedingArr.slotFeedings;
        if (tmpData.rangeTimeMenu.length == 0) {
          _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html('Name and time of menu slot is required!');
        } else {
          //check data slot feedings empty
          let isValid = true;
          for (let slot of tmpData.rangeTimeMenu) {
            if (slot.name == '' || slot.timeStart == '' || slot.timeEnd == '' ) { isValid = false; }
          }
          if (isValid) {

            let manner = _this.formObj.attr('data-manner');
            //reset form validator
            if (manner === 'add') {
              Cloud.addSetting.with(tmpData).protocol('jQuery').exec((err, responseBody, responseObjLikeJqXHR) => {
                if (err) {
                  _this.alert.removeClass('hidden alert-success').addClass("alert-danger")
                  return;
                } else {
                  // _this.alert.removeClass('hidden alert-danger').addClass("alert-success");
                  location.href = '/backend/login';
                }
              });
            }
            console.log('----- FORM Setting ----- [SUBMIT][END]');
          } else {
            _this.alert.removeClass('hidden alert-success').addClass("alert-danger").html('The data input is invalid!');
          }
        }
      });
  }

  initRepeater() {
    let _this = this;
    $('.repeater').repeater({
      defaultValues: {
        'text-input': 'foo'
      },
      show: function () {
        $(this).slideDown();
        $(this).find(".datetimepicker-input").attr('id', "timeStart" + _this.countSlot);
        $(this).find(".datetimepicker-input").attr('id', "timeEnd" + _this.countSlot);
        // _this.initTimePicker($(this), _this.countSlot);
        _this.initTimePicker();
        _this.countSlot++;
      },
      hide: function (deleteElement) {
        _this.initSweetAlert($(this), deleteElement);
      },
      isFirstItemUndeletable: true
    });
  }
  
  initTimePicker() {
    $('.bootstrap-datetimepicker-input').bootstrapMaterialDatePicker({
      date: false,
      format: 'HH:mm',
      switchOnClick: true
    });
  }

  initSweetAlert(element, deleteElement) {
    swal({
      title: 'this.messages.deleteRow',
      icon: 'warning',
      cancelButtonColor: '#ff4081',
      buttons: {
        cancel: {
          text: 'this.messages.cancel',
          value: null,
          visible: true,
          className: "btn btn-danger",
          closeModal: true,
        },
        confirm: {
          text: "OK",
          value: true,
          visible: true,
          className: "btn btn-primary",
          closeModal: true
        }
      }
    }).then((value) => {
      if (value) {
        element.slideUp(deleteElement);
      }
    });
  }
}