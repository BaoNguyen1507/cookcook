/**
 * @copyright 2020 @ group 6
 * @author DevTeam
 * @create 2019/09/06
 * @update 
 * @file api/services/JwtService.js
 */
'use strict';
var jwt = require('jsonwebtoken');
var jwtSecret = sails.config.secrets.jwtSecret;

const JwtService = {
  sign: function (payload) {
    let token = jwt.sign(payload, jwtSecret, { expiresIn: 180 * 60 });
    return token;
  },

  verify: function (token, callback) {
    return jwt.verify(token, jwtSecret, callback);
  }
}

module.exports = JwtService;