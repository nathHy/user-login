const express = require('express');
const loginRouter = express.Router();
const User = require('../models/user.js')
const sendResponse = require('../helper/response.js');
const customError = require('../helper/error.js');

module.exports.loginMiddleware = (req, res, next) => {
  let { username, password } = req.body;
  User.findOne({ where: { username: username } })
    .then(user => {
      if (user && user.validatePassword(password)) {
        req.session.user = user
        sendResponse(res, 200)
      } else {
        throw new customError("Invalid login details", 400);
      }
    })
    .catch(next)
}

module.exports.logoutMiddleware = (req, res, next) => {
  req.session.destroy(() => {
    console.log('destroyed session');
    sendResponse(res, 204, null);
  });
}

module.exports.isLoggedIn = (req, res, next) => {
  if (req.session && req.session.user) {
    return next();
  } else {
    next(new customError("Not logged in", 401));
  }
}