/**
 * PostController
 *
 * @description :: Server-side logic for managing Posts
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

let ejs = require('ejs');
let moment = require('moment');
const ErrorMessages = require('../../../../config/errors');
const Sharp = require('sharp/lib');
const PostService = require('../../../services/PostService');
const MediaService = require('../../../services/MediaService');
const makeDir = require('make-dir');
const fs = require('fs');
module.exports = {

  add: async (req, res) => {
    const params = req.allParams();

    if (req.method === 'GET') return res.badRequest(ErrorMessages.SYSTEM_METHOD_NOT_ALLOWED);
    if (!params.title) return res.badRequest(ErrorMessages.POST_TITLE_REQUIRED);
    if (!params.description || params.description == '') return res.badRequest(ErrorMessages.POST_DESCRIPTION_REQUIRED);

    let newData = {
      title: params.title,
      motto: params.motto,
      description: params.description,
      metaKeyword: params.metaKeyword,
      metaTitle: params.metaTitle,
      metaDescription: params.metaDescription,
      media: params.thumbnail,
      categories: params.categories,
      tags: params.tags,
      status: params.status,
      author: req.session.userId
    };

    let newPost = await PostService.add(newData);

    return res.json(newPost);
  },

  get: async (req, res) => {
    sails.log.info("================================ PostController.get => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    // CHECK PARAM
    if (!params.id) return res.badRequest(ErrorMessages.POST_ID_REQUIRED);

    // QUERY & CHECK DATA POST
    const postObj = await PostService.get({
      id: params.id
    });
    if (!postObj) {
      return res.notFound(ErrorMessages.POST_OBJECT_NOT_FOUND);
    }
    // RETURN DATA POST
    return res.ok(postObj);
  },

  edit: async (req, res) => {

    const params = req.allParams();

    if (req.method === 'GET') return res.badRequest(ErrorMessages.SYSTEM_METHOD_NOT_ALLOWED);
    if (!params.id) return res.badRequest(ErrorMessages.POST_ID_REQUIRED);
    if (!params.title) return res.badRequest(ErrorMessages.POST_TITLE_REQUIRED);

    let _postData = {
      id: params.id,
      title: params.title,
      motto: params.motto,
      description: params.description,
      metaKeyword: params.metaKeyword,
      metaTitle: params.metaTitle,
      metaDescription: params.metaDescription,
      media: params.thumbnail,
      categories: params.categories,
      tags: params.tags,
      status: params.status,
      author: req.session.userId
    };

    let editPost = await PostService.edit(params.id, _postData);

    return res.json(editPost);
  },

  info: async (req, res) => {
    let post = await Post.info(req.param('id'));
    return res.json(post);
  },

  total: async (req, res) => {
    let totals = await Post.total({});
    return res.json({ totals: totals });
  },

  totalStatus: async (req, res) => {
    let status = req.param('status');
    let totals = await Post.total({ search: status });
    return res.json({ totals: totals });
  },

  trash: async (req, res) => {
    sails.log.info("================================ PostController.trash => START ================================");
    let params = req.allParams();
    if (!params.ids) return res.badRequest(ErrorMessages.POST_ID_REQUIRED);
    // Call constructor with custom options:
    let data = { status: sails.config.custom.STATUS.TRASH };
    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let post = await PostService.get({ id: ids[i] });
        if (post) PostService.del({ id: ids[i] });
        // let posts = await PostService.get({ id: ids[i] });
        // if (posts && posts.status == data.status) {
        //   PostService.del({ id: ids[i] });
        // } else if (posts) {
        //   await Post.update({ id: ids[i] }).set({ status: data.status });
        // }
      }
    } else {
      let post = await PostService.get({ id: ids });
      if (post) PostService.del({ id: ids });
      // let posts = await PostService.get({ id: ids });
      // if (posts && posts.status == data.status) {
      //   PostService.del({ id: ids });
      // } else if (posts) {
      //   await Post.update({ id: ids }).set({ status: data.status });
      // }
    }
    // RETURN DATA
    return res.ok();
  },

  publish: async (req, res) => {
    let ids = req.param('ids');

    let totals = await Post.publish({ ids: ids });
    return res.json({ totals: totals });
  },

  push: async (req, res) => {
    let users = null;
    let _ids = req.param('ids');

    await sails.helpers.expoPushPosts.with({
      newsIds: _ids
    });

    return res.ok();
  },

  search: async (req, res) => {
    sails.log.info("================================ PostController.search => START ================================");
    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
    let status = (params.status) ? params.status : 1;
    //let sort = (params.sort) ? JSON.parse(params.sort) : null;
    // let sort = null;
    let newSort = {};
    if(params.order)
    {
      let objOrder = {};
      objOrder[params.columns[params.order[0].column].data] = params.order[0].dir ;
      // sort = [objOrder];
      for(var key in objOrder){
        if(objOrder[key] == 'desc'){
          //code here
          newSort[key] = -1; 
        } else {
          newSort[key] = 1;
        }
      }
    } else {
      newSort = { createdAt: -1 };
    }

    let where = {};
    if (typeof keyword === "string" && keyword.length > 0) {
      where = {
        $or: [
          { title: { $regex: keyword, $options: 'i' }},
        ]
      } 
    }

    where.$and = [
      { status: params.status ? parseInt(params.status) : 1 }
    ];

    /**SEARCH CASE_INSENSITIVE */
    const collection = Post.getDatastore().manager.collection(Post.tableName);
    let result = [];
    if (params.length && params.start) {
      result = await collection.find(where).limit(limit).skip(skip).sort(newSort);
    } else {
      result = await collection.find(where).sort(newSort);
    }
    const totalPost = await collection.count(where);
    const dataWithObjectIds = await result.toArray();
    const arrObjPost = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));
    // let where = {
    //   status: params.status ? params.status : 1,
    // };
    // if (typeof keyword === "string" && keyword.length > 0) {
    //   where = {
    //     or: [
    //       {
    //         title: { contains: keyword }
    //       }
    //     ],
    //     status: status
    //   };
    // }
    // let arrObjPost = await PostService.find(where, limit, skip, sort);
    let resPost = [];
    for (let postObj of arrObjPost) {
      let post = await PostService.get({ id: postObj.id });
      let tmpData = {};
      post.url = '/backend/post/edit/';
      tmpData.id = '<input class="js-checkbox-item" type="checkbox" value="' + post.id + '">';
      tmpData.tool = await sails.helpers.renderRowAction(post); 
      let thumbLink = '/images/no-thumb.png';
      if (post.media != null && post.media.thumbnail.sizes) {
        thumbLink = post.media.thumbnail.sizes.thumbnail.path;
      }
      tmpData.thumbnail = '<img class="news-img rounded" src="' + thumbLink + '">';
      tmpData.title = post.title ;
      // CHECK CATEGORIES
      if (post.categories.length > 0) {
        let strCate = '';
        _.each(post.categories, (categoryItem) => {
          strCate += `<a href="/backend/post/edit/`+post.id+`"><h4 class="my-0 mr-10 inline-block"><span class="badge badge-info">${categoryItem.title}</span></h4></a>`
        })
        tmpData.categories = strCate;
      } else {
        tmpData.categories = '-';
      }
      // CHECK TAGS
      if (post.tags.length) {
        let strTag = '';
        _.each(post.tags, (tagItem) => {
          strTag += `<h4 class="my-0 mr-10 inline-block"><span class="badge badge-secondary">${tagItem.title}</span></h4>`
        })
        tmpData.tags = strTag;
      } else {
        tmpData.tags = '-';
      }
      tmpData.author = post.author.firstName + post.author.lastName;
      
      if (post.status == 1) {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${post.id}" checked>
            <span class="slider"></span>
          </label>`;
      } else {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${post.id}">
            <span class="slider"></span>
          </label>`;
      }
      resPost.push(tmpData);
    };
    // let totalPost = await PostService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalPost, recordsFiltered: totalPost, data: resPost, dataOriginal: arrObjPost });
  },

  uploadThumbnail: async (req, res) => {
    sails.log.info("================================ PostController.uploadThumbnail => START ================================");
    let params = req.allParams();
    if (req.file('file')) { 
      let mediaResults = [];
      let arrMediaThumbSizes = [];
      let mediaDetails = {
        width: 0,
        height: 0,
        path: '',
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
                }).catch((err) => { sails.log(err); });
              mediaDetails.path = '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName;
						} else {
              Sharp(file.fd).resize(size.width, size.height)
                .toFile(require('path').resolve(uploadConfig.PATH_FOLDER, 'assets/uploads/') + '/' + moment().format('YYYY/MM') + '/' + destFileName)
                .then((info) => { }).catch((err) => { sails.log(err); });
              mediaDetails.sizes[size.type] = {
                width: size.width, height: size.height,
                path: '/uploads/' + moment().format('YYYY/MM') + '/' + destFileName
              };
            } 
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
        //sails.log(mediaResults);
				return res.json(mediaResults[0].id);
			}
		}
    return res.json({});
  },
  
  switchStatus: async (req, res) => {
    sails.log.info("================================ PostController.switchStatus => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.POST_ID_REQUIRED);

    //CHECK OBJ IS EXISTED?
    let postObj = await PostService.get({ id: params.id });
    if (!postObj) return res.badRequest(ErrorMessages.POST_OBJECT_NOT_FOUND);

    //switch status of current obj
    if (postObj.status == 1) postObj = await PostService.edit({ id: params.id }, { status: 0 });
    else postObj = await PostService.edit({ id: params.id }, { status: 1 });

    return res.json(postObj);
    // END UPDATE
  },
};

