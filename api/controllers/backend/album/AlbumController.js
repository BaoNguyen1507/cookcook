/**
 * AlbumController
 *
 * @description :: Server-side logic for managing albums
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let ejs = require('ejs');
let moment = require('moment');
const Sharp = require('sharp/lib');
const AlbumService = require('../../../services/AlbumService');
const MediaService = require('../../../services/MediaService');
const ErrorMessages = require('../../../../config/errors');
const i18n = require('../../../../config/i18n');
module.exports = {

  listAllHomeAlbum: async (req, res) => {
    let forKid = req.param('forKid');
    let allAlbums = [];
    if (forKid) {
      allAlbums = await Album.listAllAlbum({
        forKid: forKid
      });
    } else {
      allAlbums = await Album.listAllAlbum();
    }
    // sails.log(allAlbums);
    let _default = await sails.helpers.getDefaultData();
    _default.allAlbums = allAlbums;
    _default.__ = sails.__;
    ejs.renderFile('./views/zadmin/partials/response/_table-albums.ejs', _default, (err, strHTML) => {
      res.set('Content-Type', 'text/html');
      return res.send(strHTML);
    });
  },

  add: async (req, res) => {
    sails.log.info("================================ AlbumController.add => START ================================");
    // GET ALL PARAMS
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }

    const params = req.allParams();
    // CHECK TITTLE PARAMS
    if (typeof (params.title) == 'undefined' && params.title != '') {
      return res.badRequest(ErrorMessages.ALBUM_TITLE_REQUIRED);
    } else if (typeof (params.courseSession) == 'undefined') {
      return res.badRequest(ErrorMessages.COURSE_SESSION_ID_REQUIRED);
    }

    let classId = params.classId == '' ? null : params.classId;
    // PREPARE DATA ALBUM
    const newData = {
      title: params.title, //REQUIRED
      description: (params.description && params.description.trim().length) ? params.description : params.title,
      photos: params.photos,
      status: params.status ? params.status : sails.config.custom.STATUS.DRAFT,
      owner: params.owner ? params.owner : req.me.id,
      courseSession: params.courseSession,
      classObj: classId
    };

    // ADD NEW DATA ALBUM
    const newAlbum = await AlbumService.add(newData);

    //create notification for this album and push notification if setting for notificationAlbum == true
    let settingForApp = await Setting.findOne({ key: 'app' });
    if (settingForApp && settingForApp.value && settingForApp.value.notificationAlbum == true) {
      //define teacherIds && parentIds
      let allParentId = [];
      let allTeacherId = [];

      //prepare data to create new notification
      let classList = [];
      if (params.classId == '') {
        let allClass = await Class.find({ status: sails.config.custom.STATUS.ACTIVE });
        classList = allClass.map(item => item.id);
      } else {
        classList = [params.classId];
      }

      let newDataNotification = {
        title:  sails.__('Activity Gallery - %s', newAlbum.title),
        message: newAlbum.description,
        status: sails.config.custom.STATUS.ACTIVE,
        type: sails.config.custom.TYPE.ALBUM,
        classList: classList
      }
      let notification = await Notifications.create(newDataNotification).fetch();

      if (classList.length > 0) {
        for (let classId of classList) {

          /** get all parentId of classList */
          let allStudent_Class = await Student_Class.find({ classObj: classId });
          // let allStudentId = [];

          // for (let student_class of allStudent_Class) {
          //   allStudentId.push(student_class.student);
          // }

          let allStudentId = allStudent_Class.map((item) => {
            return item.student;
          })

          for (let studentId of allStudentId) {
            let allStudent_Parent = await Student_Parent.find({ student: studentId });

            for (let student_parent of allStudent_Parent) {
              //just push parentId is not exist
              if (!allParentId.includes(student_parent.parent))
                allParentId.push(student_parent.parent);
            }
          }

          /**get all teacherId of classList */
          let allTeacher_Class = await Teacher_Class.find({ classObj: classId });
          for (let teacher_class of allTeacher_Class) {
            //just push teacherId is not exist
            if (!allTeacherId.includes(teacher_class.teacher))
              allTeacherId.push(teacher_class.teacher);
          }
        }

        //send notification
        await NotificationService.pushFirebase(notification, allParentId, allTeacherId);
      }
    }

    // RETURN DATA ALBUM
    return res.json({
      status: 200,
      data: newAlbum
    });
  },

  edit: async (req, res) => {
    // GET ALL PARAMS
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }
    const params = req.allParams();
    // CHECK TITTLE PARAMS
    if (typeof (params.title) == 'undefined' && params.title != '') {
      return res.badRequest(ErrorMessages.ALBUM_TITLE_REQUIRED);
    } else if (typeof (params.classId) == 'undefined') {
      return res.badRequest(ErrorMessages.CLASS_ID_REQUIRED);
    }

    let editAlbum = await AlbumService.get({
      id: params.id
    });
    //get edit album
    let classId = null;
    if (params.classId) {
      classId = params.classId == '' ? null : editAlbum.classObj ? editAlbum.classObj.id : null;
    }
    if (editAlbum) {
      const newData = {
        title: (params.title && params.title.trim() != '') ? params.title.trim() : editAlbum.title,
        description: (params.description && params.description.trim() != '') ? params.description.trim() : editAlbum.description,
        photos: ((params.photos || params.photos =="") ? params.photos : editAlbum.photos),
        status: (params.status ? params.status : editAlbum.status),
        classObj: classId,
      };
      editAlbum = await AlbumService.edit({
        id: editAlbum.id
      }, newData);
    } else {
      return res.badRequest(ErrorMessages.ALBUM_OBJECT_NOT_FOUND);
    }

    return res.json(editAlbum);
  },

  info: async (req, res) => {
    let album = await Album.info(req.param('id'));
    return res.json(album);
  },

  total: async (req, res) => {
    let totals = await Album.total({});
    return res.json({
      totals: totals
    });
  },

  totalStatus: async (req, res) => {
    let status = req.param('status');
    let totals = await Album.total({
      search: status
    });
    return res.json({
      totals: totals
    });
  },

  trash: async (req, res) => {
    sails.log.info("================================ AlbumController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorService.ERR_ID_REQUIRED);
    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let album = await AlbumService.get({id: ids[i]});
        if (album) AlbumService.del({ id: ids[i] });
        // let album = await AlbumService.get({
        //   id: ids[i]
        // });
        // if (album && album.status == sails.config.custom.STATUS.TRASH) {
        //   AlbumService.del({
        //     id: ids[i]
        //   });
        // } else if (album) {
        //   await Album.update({
        //     id: ids[i]
        //   }).set({
        //     status: sails.config.custom.STATUS.TRASH
        //   });
        // }
      }
    } else {
      let album = await AlbumService.get({id: ids});
      if (album) AlbumService.del({ id: ids });
      // let album = await AlbumService.get({
      //   id: ids
      // });
      // if (album && album.status == sails.config.custom.STATUS.TRASH) {
      //   AlbumService.del({
      //     id: ids
      //   });
      // } else if (album) {
      //   await Album.update({
      //     id: ids
      //   }).set({
      //     status: sails.config.custom.STATUS.TRASH
      //   });
      // }
    }
    return res.ok();
  },

  publish: async (req, res) => {
    let ids = req.param('ids');

    let totals = await Album.publish({
      ids: ids
    });
    return res.json({
      totals: totals
    });
  },

  push: async (req, res) => {
    let users = null;
    let _ids = req.param('ids');

    await sails.helpers.expoPushAlbums.with({
      albumIds: _ids
    });

    return res.ok();
  },

  search: async (req, res) => {
    sails.log.info("================================ AlbumController.search => START ================================");
    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
    //prepared order param
    let objOrder = {};
    objOrder[params.columns[params.order[0].column].data] = params.order[0].dir;
    let sort = [objOrder];
    //find only active status
    let status = (params.status) ? parseInt(params.status) : -1;
    let where = {
      status: {
        '>=': sails.config.custom.STATUS.DRAFT
      },
      //courseSession: req.session.courseSessionActive
    };
    if (status != -1) {
      where = {
        status: status,
        //courseSession: req.session.courseSessionActive
      };
    }
    //let select = ["_id", "title", "description", "order"];
    if (params.condition && !Utils.isJsonString(params.condition)) return res.serverError(ErrorMessages.SYSTEM_JSON_FORMAT_FAIL);
    if (typeof keyword === "string" && keyword.length > 0) {
      where = {
        or: [
          { title: { contains: keyword } },
          { description: { contains: keyword } }
        ],
        status: status
      };
    }
    let condition = (params.condition) ? JSON.parse(params.condition) : null;
    if (condition) {
      where = condition;
    }
    let arrObjAlbum = await AlbumService.find(where, limit, skip, sort);
    let resAlbum = [];
    for (let album of arrObjAlbum) {
      let tmpData = {};
      tmpData.id = `<input class="js-checkbox-item" type="checkbox" value="${album.id}">`;
      let thumbLink = '/images/no-thumb.png';
      let _photos = await MediaService.find({
        id: album.photos
      });
      tmpData.photos = '';
      if (_photos.length > 0) {
        if (_photos.length == 1) {
          tmpData.photos = `
          <div class="news-img rounded">
            <img src=${_photos[0].thumbnail.sizes.thumbnail.path} alt=${album.title}>
          </div>`;
        } else {
          tmpData.photos = `
          <div class="news-img rounded">
            <img src=${_photos[0].thumbnail.sizes.thumbnail.path} alt=${album.title}> 
            <span class="badge badge-pill badge-danger badge-inside-image">+${_photos.length - 1}</span>
          </div>`;
        }
      } else {
        // tmpData.photos = '<img class="img-lg rounded" src="' + thumbLink + '">';
        tmpData.photos = `
          <div class="news-img rounded">
            <img src=${thumbLink} alt=${album.title}>
          </div>`;
      }
      //create link edit, remove
      tmpData.title = '<p>'+album.title+'</p>' + album.description;
      let classFound = await Class.findOne({
        id: album.classObj
      });
      if (classFound !== undefined) {
        tmpData.classObj = classFound.title;
      } else {
        tmpData.classObj = '-';
      }
      album.url = "/backend/album/edit/";
      album.urlview = "/backend/album/view/";
      // TOOL
      tmpData.tool = `<div class="btn-group-action">				
      <div class="btn-group pull-right">
        <a href="${album.urlview + album.id}" data-id="${album.id}" title="Xem album" class="view btn btn-default view-row" data-id="${album.id}">
          <i class="mdi mdi-folder-image"></i>
        </a>
        <a href="${album.url + album.id}" data-id="${album.id}" title="Sửa" class="edit btn btn-default edit-row" data-id="${album.id}">
          <i class="mdi mdi-pencil"></i>
        </a>
        <button class="btn btn-default dropdown-toggle" data-toggle="dropdown">
          <i class="icon-caret-down"></i>
        </button>
        <ul class="dropdown-menu">
          <li>
            <a href="javascript:void(0);" data-id="${album.id}" class="remove-row">
              <i class="mdi mdi-delete"></i> Delete
            </a>
          </li>
        </ul>
      </div>
    </div>`;
      if (album.status == 1) {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${album.id}" checked>
            <span class="slider"></span>
          </label>`;
      } else {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${album.id}">
            <span class="slider"></span>
          </label>`;
      }
      resAlbum.push(tmpData);
    };
    let totalAlbum = await AlbumService.count(where);
    return res.ok({
      draw: draw,
      recordsTotal: totalAlbum, 
      recordsFiltered: totalAlbum,
      data: resAlbum,
      dataOriginal: arrObjAlbum
    });
  },

  uploadThumbnail: async (req, res) => {
    sails.log.info("================================ PostController.uploadThumbnail => START ================================");
    let params = req.allParams();
    if (req.file('file')) {
      let mediaResults = [];
      let mediaDetails = {
        sizes: {}
      };
      let fileUploaded = await sails.helpers.uploadFile.with({
        req: req,
        file: 'thumbnail'
      });
      if (fileUploaded.length) {
        for (let file of fileUploaded) {
          let oriFileName = file.fd.replace(/^.*[\\\/]/, '');
          let fileName = oriFileName.split('.');
          let uploadConfig = sails.config.custom.UPLOAD;
          for (let size of uploadConfig.SIZES) {
            let destFileName = fileName[0] + '_' + size.name + '.' + fileName[1];
            if (size.type == 'origin') {
              Sharp(file.fd).resize(size.width)
                .toFile(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM') + '/' + destFileName)
                .then((info) => {
                  mediaDetails.width = info.width;
                  mediaDetails.height = info.height;
                }).catch((err) => {
                  sails.log(err);
                });
              mediaDetails.path = '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName;
            } else {
              Sharp(file.fd).resize(size.width, size.height)
                .toFile(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM') + '/' + destFileName)
                .then((info) => { }).catch((err) => {
                  sails.log(err);
                });
              mediaDetails.sizes[size.type] = {
                width: size.width,
                height: size.height,
                path: '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName
              };
            }

            // PREPARE DATA MEDIA
            let dataMedia = {
              title: params.title ? params.title : oriFileName, // REQUIRED
              thumbnail: mediaDetails,
              caption: (params.caption && params.caption.trim().length) ? params.caption : '',
              status: params.status ? params.status : sails.config.custom.STATUS.ACTIVE,
              uploadBy: req.me.id

            };
            let mediaObj = await MediaService.add(dataMedia);
            mediaResults.push(mediaObj);
          }
        }
        //sails.log(mediaResults);
        return res.json(mediaResults[0].id);
      }
    }
    return res.json({});
  },

  deleteCmt: async (req, res) => {
    sails.log.info("================================ PostController.deleteCmt => START ================================");
    let params = req.allParams();

    if (!params.id) return res.badRequest(ErrorService.ERR_ID_REQUIRED);
    if (!params.indexCmt) return res.badRequest(ErrorService.ALBUM_INDEX_CMT_REQUIRED);

    let editAlbum = await AlbumService.get({ id: params.id });

    let arrCmt = editAlbum.comments;
    arrCmt.splice(params.indexCmt, 1); //delete comment with specified index from array

    editAlbum = await AlbumService.edit({ id: params.id }, { comments: arrCmt });

    return res.ok(editAlbum);
  },
  
  switchStatus: async (req, res) => {
    sails.log.info("================================ AlbumController.switchStatus => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.ALBUM_ID_REQUIRED);

    //CHECK OBJ IS EXISTED?
    let albumObj = await AlbumService.get({ id: params.id });
    if (!albumObj) return res.badRequest(ErrorMessages.ALBUM_OBJECT_NOT_FOUND);

    //switch status of current obj
    if (albumObj.status == 1) albumObj = await AlbumService.edit({ id: params.id }, { status: 0 });
    else albumObj = await AlbumService.edit({ id: params.id }, { status: 1 });

    return res.json(albumObj);
    // END UPDATE
  },
};
