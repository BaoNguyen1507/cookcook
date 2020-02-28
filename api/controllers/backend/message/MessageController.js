/**
 * Message/MessageController
 *
 * @description :: Server-side logic for managing notification/taxonomies
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

const ErrorMessage = require('../../../../config/errors');
const MessageService = require('../../../services/MessageService');
const MessageDataService = require('../../../services/MessageDataService');
//Library
const moment = require('moment');

module.exports = {
  joinRoom: async (req, res) => {
    //api socket
    if (!req.isSocket) {
      return res.badRequest(ErrorMessage.MESSAGE_ERR_IS_NOT_SOCKET);
    }

    let params = req.allParams();
    let classID = params.classId;
    if (!classID) return res.badRequest(ErrorMessage.MESSAGE_ERR_CLASS_ID_REQUIRED);

    let group = await MessageService.get({ classObj: classID });
    //open room
    sails.sockets.join(req, 'GROUP_' + group.id);

    return res.json({
      data: group
    });
  },

  // listGroup: async (req, res) => {
  //   //api socket
  //   if (!req.isSocket) {
  //     return res.badRequest(ErrorMessage.MESSAGE_ERR_IS_NOT_SOCKET);
  //   }

  //   let params = req.allParams();
  //   let classID = params.classId;
  //   let userActiveId = params.userActiveId;
  //   let dateUse = params.dateUse ? params.dateUse : moment().format('YYYY-MM-DD');

  //   let getMessages = async (group) => { //get messageData of message obj

  //     //get array messageData to get number of unread message sort by dateUse to get message sort by time desc
  //     let rs = await MessageData.find({
  //       where: {
  //         message: group.id,
  //         dateUse: {
  //           '>=': moment(group.updatedAt).format('YYYY-MM-DD')
  //         }
  //       },
  //       sort: 'dateUse DESC'
  //     });
      
  //     let numberOfUnreadMsg = 0;
  //     if (rs.length > 0) {
  //       for (let msgData of rs) {
  //         for (let i = msgData.dataLogs.length; i > 0; i--){ //loop from end to start of array to get message by time desc
  //           if ( msgData.dataLogs.length > 0) {
  //             if (moment( msgData.dataLogs[i-1].createdAt).isAfter(moment(group.updatedAt)) && msgData.dataLogs[i-1].user != userActiveId) {
  //               numberOfUnreadMsg += 1;
  //             } else break;
              
  //           } 
  //         }
  //       }
  //     }

  //     //get last messageData to get last message and time of last message
  //     let rsLast = await MessageData.find({
  //       where: { message: group.id },
  //       sort: 'dateUse DESC'
  //     })

  //     let lastTxtMsg = '';
  //     let timeLastTxtMsg = '';

  //     if (rsLast.length > 0 && rsLast[0].dataLogs.length > 0) {
  //       let lastDataLog = rsLast[0].dataLogs.pop();
  //       lastTxtMsg = lastDataLog.txtMessage;
  //       timeLastTxtMsg = lastDataLog.createdAt;
  //     }
  //     return {
  //       id: group.id,
  //       unreadMessages: numberOfUnreadMsg,
  //       lastMessage: lastTxtMsg,
  //       timeLastMessage: timeLastTxtMsg
  //     }
  //   }
  //   //check params exists
  //   let group; let groupMessage;
  //   if (classID != undefined) {
  //     group = await MessageService.get({ classObj: classID });
  //     if (group == null) {
  //       group = await MessageService.add({
  //         classObj: classID,
  //         type: sails.config.custom.TYPE.PUBLIC
  //       })
  //       await MessageDataService.add({ message: group.id, dateUse: dateUse });
  //       groupMessage = {
  //         id: group.id,
  //         unreadMessages: 0,
  //         lastMessage: '',
  //         timeLastMessage: ''
  //       }
  //     } else {
  //       groupMessage = await getMessages(group);
        
  //       //create messageData of currentDay if not exist
  //       let msgDataObj = await MessageDataService.get({ message:group.id, dateUse: dateUse });
  //       if (!msgDataObj) await MessageDataService.add({ message: group.id, dateUse: dateUse });
  //     }
  //     //open room
  //     sails.sockets.join(req, 'GROUP_' + groupMessage.id);
  //     //response
  //     return res.json({
  //       data: groupMessage
  //     });
  //   } else {
  //     return res.badRequest(ErrorMessage.MESSAGE_ERR_TEACHER_PARENT_CLASS_ID_REQUIRED);
  //   }
  // },

  //add obj {user:'',txtMessage:''} into dataLogs of messageData
  storeMessageData: async (req, res) => {
    //api socket
    if (!req.isSocket) {
      return res.badRequest(ErrorMessage.MESSAGE_ERR_IS_NOT_SOCKET);
    }
    let params = req.allParams();
    let userId = params.userId ? params.userId : '';
    let txtMessage = params.txtMessage ? params.txtMessage : '';
    let messageId = params.messageId ? params.messageId : '';
    let dateUse = params.dateUse ? params.dateUse : moment().format('YYYY-MM-DD');

    //get messageData Obj
    let msgData = await MessageDataService.get({ message: messageId, dateUse: dateUse });

    if (msgData) {
      let dataLogs = msgData.dataLogs;
      //update dataLogs
      let data = {
        user: userId,
        txtMessage: txtMessage,
        createdAt: Date.now()
      }
      dataLogs.push(data);
  
      //update obj
      await MessageDataService.edit({ id: msgData.id }, { dataLogs: dataLogs });
    } else {
      let data = {
        message: messageId,
        dateUse: moment().format('YYYY-MM-DD'),
        dataLogs: [{
          user: userId,
          txtMessage: txtMessage,
          createdAt: Date.now()
        }]
      }

      await MessageDataService.add(data);
    }


    //get user obj
    let userObj = await UserService.get({ id: userId });
    if (!userObj) userObj = await ParentService.get({ id: userId });

    //update last seen for message obj
    let messageObj = await MessageService.get({ id: messageId });
    let lastSeen = messageObj.lastSeen;
    if (lastSeen.length > 0) {
      let find = lastSeen.findIndex(f => f.user === userId);
      if (find != -1) {
        lastSeen[find].lastSeen = Date.now();
      } else {
        lastSeen.push({
          user: userId,
          lastSeen: Date.now()
        })
      }
    } else {
      lastSeen.push({
        user: userId,
        lastSeen: Date.now()
      })
    }
    await MessageService.edit({ id: messageId, }, { lastSeen });

    let roomName = 'GROUP_' + messageId;
    sails.sockets.broadcast(roomName, 'CHAT_' + messageId, { user: userObj, txtMessage: txtMessage, createdAt: Date.now() });

    return res.ok();
  },

  //get messageData by messageId and dateUse
  getListMessages: async (req, res) => { 
    let params = req.allParams();
    //if (!params.dateUse) return res.badRequest(ErrorMessage.MESSAGE_ERR_DATEUSE_REQUIRED);
    if (!params.messageId && !params.classId) return res.badRequest(ErrorMessage.MESSAGE_ERR_GROUP_ID_REQUIRED);

    // const bodyParams = {
    //   limit: params.limit ? Number(params.limit) : null,
    //   offset: params.offset ? Number(params.offset) : null,
    //   sort: (params.sort && params.sort.trim().length) ? JSON.parse(params.sort) : null
    // };

    // let listMessage = await MessageDataService.find({ message: messageId }, bodyParams.limit, bodyParams.offset, bodyParams.sort);

    //let listMessage = await MessageData.findOne({ message: params.messageId, dateUse: params.dateUse });
    let messageId = '';
    if (params.messageId) {
      messageId = params.messageId;
    } else {
      let msgObj = await Message.findOne({ classObj: params.classId });
      messageId = msgObj.id;
    }

    let listMessage = await MessageData.find({ where: { message: messageId }, limit: 1, skip: (Number(params.page) - 1) * 1, sort: [{ createdAt: 'DESC' }] })
    if (listMessage && listMessage.length > 0) {
      let dataLogs = listMessage[0].dataLogs;
      if (dataLogs.length > 0) {
        for (let i = 0; i < dataLogs.length; i++) {
          let tmpUser = await User.findOne({ id: dataLogs[i].user });
          if (!tmpUser) {
            tmpUser = await Parent.findOne({ id: dataLogs[i].user });
            if (tmpUser) {
              dataLogs[i].user = tmpUser;
            }
          } else {
            dataLogs[i].user = tmpUser;
          }
        }
      }
    }
    return res.json({
      data: listMessage[0],
      messageId: messageId,

    });
  },

  //update lastSeen of message obj
  getSeenMessage: async (req, res) => {
    let params = req.allParams();
    let msgId = params.messageId;
    let userId = params.userId ? params.userId : '';

    let messageObj = await MessageService.get({ id: msgId });
    let lastSeen = messageObj.lastSeen;
    if (lastSeen.length > 0) {
      let find = lastSeen.findIndex(f => f.user === userId);
      if (find != -1) {
        lastSeen[find].lastSeen = Date.now();
      } else {
        lastSeen.push({
          user: userId,
          lastSeen: Date.now()
        })
      }
    } else {
      lastSeen.push({
        user: userId,
        lastSeen: Date.now()
      })
    }

    let editObj = await MessageService.edit({ id: msgId }, {
      lastSeen
    }
    );

    if (editObj) {
      return res.json({
        data: editObj
      });
    } else {
      return res.badRequest(ErrorMessage.MESSAGE_ERR_EDIT_FAIL);
    }
  }
};
