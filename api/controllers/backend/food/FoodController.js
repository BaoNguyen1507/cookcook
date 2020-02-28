/**
 * FoodController
 *
 * @description :: Server-side actions for handling incoming requests.
 * @help        :: See https://sailsjs.com/docs/concepts/actions
 */

const ErrorMessages = require('../../../../config/errors');
const FoodService = require('../../../services/FoodService');

module.exports = {
  add: async (req, res) => {
    sails.log.info("================================ FoodController.add => START ================================");
    // GET ALL PARAMS
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }
    const params = req.allParams();
    // CHECK TITLE & CODE
    if (!params.title || !params.title.trim().length) {
      return res.badRequest(ErrorMessages.FOOD_TITLE_REQUIRED);
    }
    if (!params.code || !params.code.trim().length) {
      return res.badRequest(ErrorMessages.FOOD_CODE_REQUIRED);
    }
    
    //CHECK DUPLICATE CODE
    const checkCode = await Food.findOne({ code: params.code });
    if (checkCode) return res.ok({
      message: ErrorMessages.FOOD_CODE_DUPLICATED.message
    });
    // PREPARE DATA FOOD
    const newData = {
      title: params.title, // REQUIRED
      code: params.code, // REQUIRED
      nutrition: params.nutrition,
      description: params.description,
      thumbnail: params.thumbnail ? parseInt(params.thumbnail) : 1,
      status: params.status ? Number.parseInt(params.status) : sails.config.custom.STATUS.DRAFT
    };

    // ADD NEW DATA FOOD
    const newFood = await FoodService.add(newData);

    // RETURN DATA FOOD
    return res.ok(newFood);
  },

  get: async (req, res) => {
    sails.log.info("================================ FoodController.get => START ================================");
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }
    // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) {
      return res.badRequest(ErrorMessages.FOOD_ID_REQUIRED);
    }
    // QUERY & CHECK DATA FOOD
    const foods = await FoodService.get({
      id: params.id
    });
    if (!foods) {
      return res.notFound(ErrorMessages.FOOD_NOT_FOUND);
    }
    // RETURN DATA FOOD
    return res.json(foods);
  },

  edit: async (req, res) => {
    sails.log.info("================================ FoodController.edit => START ================================");
    // GET ALL PARAMS
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }
    const params = req.allParams();
    // CHECK TITLE & CODE
    if (!params.title || !params.title.trim().length) {
      return res.badRequest(ErrorMessages.FOOD_TITLE_REQUIRED);
    }
    if (!params.code || !params.code.trim().length) {
      return res.badRequest(ErrorMessages.FOOD_CODE_REQUIRED);
    }

    //CHECK DUPLICATE CODE
    const checkCode = await Food.findOne({ code: params.code });
    if (checkCode) {
      if(checkCode.id != params.id) {
        return res.ok({
          message: ErrorMessages.FOOD_CODE_DUPLICATED.message
        });
      }
    }
    // PREPARE DATA FOOD
    const editData = {
      title: params.title, // REQUIRED
      code: params.code, // REQUIRED
      nutrition: params.nutrition,
      description: params.description,
      thumbnail: params.thumbnail ? parseInt(params.thumbnail) : 1,
      courseSession: req.session.courseSessionActive,
      status: params.status ? Number.parseInt(params.status) : sails.config.custom.STATUS.DRAFT
    };

    // CHECK DATA FOOD
    const foods = FoodService.get({ id: params.id });
    if (!foods) {
      return res.notFound(ErrorMessages.FOOD_NOT_FOUND);
    }

    // UPDATE DATA FOOD
    const editObj = await FoodService.edit({ id: params.id }, editData);

    // RETURN DATA FOOD
    return res.json({
      status: 1,
      data: editObj
    });
  },

  trash: async (req, res) => {
    sails.log.info("================================ FoodController.trash => START ================================");
    // GET ALL PARAMS
    const params = req.allParams();

    let deleteFoodFromMenu = async (foodIds) => {
      let menus = await Menu.find({});
      if (menus && menus.length > 0) {
        for (let menuObj of menus) {
          if (menuObj.slotFeedings && menuObj.slotFeedings.length > 0) {
            //flag
            let isChangeFoods = false;

            //remove food which deleted from slotFeedings of menu
            let newSlotFeedings = menuObj.slotFeedings;
            for (let i = 0; i < newSlotFeedings.length; i++){
              let foods = newSlotFeedings[i].foods.filter(item => !foodIds.includes(item));
              if (foods.length != newSlotFeedings[i].foods.length) {
                newSlotFeedings[i].foods = foods;
                isChangeFoods = true
              }
            }

            //update newSlotFeedings for menu
            if (isChangeFoods) {
              await Menu.update({ id: menuObj.id }, { slotFeedings: newSlotFeedings });
            }
          }
        }
      }
    }

    // CHECK IDS PARAM
    if (!params.ids || !params.ids.length) {
      return res.badRequest(ErrorMessages.FOOD_ID_REQUIRED);
    }
    let ids = params.ids;
    if (params.ids.indexOf(';') != -1) {
      ids = ids.split(';');
    }
    if (typeof (ids) == 'object') {
      for (var i = 0; i < ids.length; i++) {
        let food = await FoodService.get({ id: ids[i] });
        if (food) FoodService.del({ id: ids[i] });
      }

      deleteFoodFromMenu(ids);
    } else {
      let food = await FoodService.get({ id: ids });
      if (food) FoodService.del({ id: ids });

      deleteFoodFromMenu([ids]);
    }
    // RETURN DATA
    return res.json({ status: 1 });
  },

  search: async (req, res) => {
    sails.log.info("================================ FoodController.search => START ================================");
    if (!req.me) {
      return res.badRequest(ErrorMessages.SYSTEM_SESSION_EXPIRED);
    }

    let params = req.allParams();
    let keyword = params.search ? params.search.value : null;
    let draw = (params.draw) ? parseInt(params.draw) : 1;
    let limit = (params.length) ? parseInt(params.length) : null;
    let skip = (params.start) ? parseInt(params.start) : null;
    //let sort = (params.sort) ? JSON.parse(params.sort) : null;
    // let sort = null;
    let newSort = {};
    if ( params.order ) {
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
    const collection = Food.getDatastore().manager.collection(Food.tableName);
    let result = [];
    if (params.length && params.start) {
      result = await collection.find(where).limit(limit).skip(skip).sort(newSort);
    } else {
      result = await collection.find(where).sort(newSort);
    }
    const totalFood = await collection.count(where);
    const dataWithObjectIds = await result.toArray();
    const arrObjFoods = JSON.parse(JSON.stringify(dataWithObjectIds).replace(/"_id"/g, '"id"'));

    let resFoods = [];
    for (let food of arrObjFoods) {
      let tmpData = {};
      tmpData.id = '<input class="js-checkbox-item" type="checkbox" value="' + food.id + '">';
      tmpData.code = food.code;
      tmpData.title = food.title;
      // if (food.status == 3) { // TRASH
      //   tmpData.title = food.title + '<div class="row-action">'
      //     + '<a href="javascript:;" class="edit-row" data-id="' + food.id + '">' + sails.__("Chỉnh sửa") + '</a> | '
      //     + '<a href="javascript:;" class="remove-row" data-id="' + food.id + '">' + sails.__("Delete") + '</a>'
      //     + '</div>';
      // } else {
      //   tmpData.title = food.title + '<div class="row-action">'
      //     + '<a href="javascript:;" class="edit-row" data-id="' + food.id + '">' + sails.__("Chỉnh sửa") + '</a> | '
      //     + '<a href="javascript:;" class="remove-row" data-id="' + food.id + '">' + sails.__("Thùng rác") + '</a>'
      //     + '</div>';
      // }
      tmpData.tool = await sails.helpers.renderRowAction(food);
      if (food.description && food.description.trim().length > 0) {
        tmpData.description = food.description;
      } else {
        tmpData.description = '-';
      }
     
      if (food.status == 1) {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${food.id}" checked>
            <span class="slider"></span>
          </label>`;
      } else {
        tmpData.status = `
          <label class="switch">
            <input class="switchStatus" type="checkbox" data-id="${food.id}">
            <span class="slider"></span>
          </label>`;
      }

      resFoods.push(tmpData);
    };
    // let totalFood = await FoodService.count(where);
    return res.ok({ draw: draw, recordsTotal: totalFood, recordsFiltered: totalFood, data: resFoods });
  },
  
  switchStatus: async (req, res) => {
    sails.log.info("================================ FoodController.switchStatus => START ================================");
    // // GET ALL PARAMS
    const params = req.allParams();
    if (!params.id) return res.badRequest(ErrorMessages.FOOD_ID_REQUIRED);

    //CHECK OBJ IS EXISTED?
    let foodObj = await FoodService.get({ id: params.id });
    if (!foodObj) return res.badRequest(ErrorMessages.FOOD_NOT_FOUND);

    //switch status of current obj
    if (foodObj.status == 1) foodObj = await FoodService.edit({ id: params.id }, { status: 0 });
    else foodObj = await FoodService.edit({ id: params.id }, { status: 1 });

    return res.json(foodObj);
    // END UPDATE
  },
};
