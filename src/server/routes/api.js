const express = require('express');
const apiRouter = express.Router();
const User = require('../models/user.js')
const sendResponse = require('../helper/response.js');
const customError = require('../helper/error.js');

apiRouter.route('/user')
  .get((req, res, next) => {
    if (req.session.user) {
      let { id, username, createdAt } = req.session.user;
      sendResponse(res, 200, { id, username, createdAt })
    }
  })

apiRouter.route('/users')
  .get((req, res, next) => {
    User.findAll({ attributes: ['id', 'username', 'createdAt'] })
      .then(users => sendResponse(res, 200, users))
  })
  .post((req, res, next) => {
    let { username, password } = req.body;
    console.log(`Creating user with username ${username} and password ${password}`);
    User.create({ username: username, password: password })
      .then(user => {
        if (user) {
          let { id, username, createdAt } = user.dataValues;
          let attributes = { id, username, createdAt }
          sendResponse(res, 200, attributes)
        } else {
          throw new customError("Failed to make user", 500);
        }
      })
      .catch(next)
  });

apiRouter.route('/users/:userId')
  .get((req, res, next) => {
    console.log(`Finding user with id ${req.params.userId}`)
    User.findById(req.params.userId, { attributes: ['id', 'username', 'createdAt'] })
      .then(user => {
        if (!user) return next(new customError('No user found', 404))
        sendResponse(res, 200, user);
      })
      .catch(next)
  })
  .delete((req, res, next) => {
    console.log(`Attempting to delete user with id of ${req.params.userId}`);
    User.findById(req.params.userId)
      .then(user => user.destroy())
      .then(() => sendResponse(res, 204, null))
      .catch(next)
  })

module.exports = apiRouter