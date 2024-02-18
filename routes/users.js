"use strict";
const express = require('express');
const router = express.Router();

const usersController = require("../controllers/users");
const validationUser = require('../validation/validationUser');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/:id', usersController.getSingle)
  .post('/', isAuthenticated, validationUser, usersController.createUser)
  .put('/:id', isAuthenticated, validationUser, usersController.updateUser)
  .delete('/:id', isAuthenticated, usersController.deleteUser)
  .get('/', usersController.getAll);

module.exports = router;
