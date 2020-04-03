class IndexNotificationFrontendEKP extends BaseBackendEKP {
    constructor() {
      super();
      this.initialize();
    }
  
    initialize() {
      //DO NOT LOAD UNNESSESARY CLASS
      //Init form + list if page have BOTH  
      this.form = new NotificationFrontendEKP(this);
    }
  }
  
  class NotificationFrontendEKP {
    constructor(opts) {
        _.extend(this, opts);
        
      this.initialize();
      this.initSelect2();
    }
   
    initialize() {
        let _this = this;
      $('.js-select2-class').select2();
    } 
   
    initSelect2() {
		$(".multiChoose").select2();
	}
  
  }
  
  