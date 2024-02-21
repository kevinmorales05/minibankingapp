"use strict";
const express = require('express');
const router = express.Router();

const usersController = require("../controllers/users");
const validationUser = require('../validation/validationUser');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/:githubId', usersController.getSingle)
  .post('/', isAuthenticated, validationUser, usersController.createUser)
  .put('/:githubId', isAuthenticated, validationUser, usersController.updateUser)
  .delete('/:githubId', isAuthenticated, usersController.deleteUser)
  .get('/', usersController.getAll);

module.exports = router;
