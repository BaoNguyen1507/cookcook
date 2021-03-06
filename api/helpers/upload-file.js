let fs = require('file-system');
let moment = require('moment');

module.exports = {
  
  
  friendlyName: 'Upload file to folder',
  description: 'Upload file to folder',

  inputs: {
    req: {
      type: 'ref'
    },
    file: {
      type: 'string'
    },
    dest: {
      type: 'string'
    },
    fileName: {
      type: 'string'
    }
  },

  exits: {
    success: {},
    cannotupload: {
      description: 'Could not upload file.'
    }
  },
  
  fn: async function (inputs, exits) {
    
    let fileEl = inputs.file;
    let uploadConfig = sails.config.custom.UPLOAD;
    //make dir current YYYY/MM/DD
    fs.mkdir(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM'))

    let dest = require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM');

    //get maximum size of upload from setting
    let setting = await Setting.findOne({ key: 'web' });
    let maxMB = setting && setting.value && setting.value.maximumUploadSize ? setting.value.maximumUploadSize : 1;
    await inputs.req.file(fileEl).upload({
      // option
      maxBytes: maxMB * 1024 * 1024,
      dirname: dest,
      // saveAs: inputs.fileName,
      // option
    }, async function whenDone(err, files) {
      if (err) return exits.cannotupload(err.code);
      
      return exits.success(files);
    });
  }
};