"use strict";
const express = require('express');
const router = express.Router();

const accountController = require("../controllers/account");
const { isAuthenticated } = require('../middleware/authenticate');
//get balance
router
  .get('/:id', isAuthenticated, accountController.getUserAccounts);

module.exports = router;
