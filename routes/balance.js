"use strict";
const express = require('express');
const router = express.Router();

const balanceController = require("../controllers/balance");
const validationUser = require('../validation/validationUser');
const { isAuthenticated } = require('../middleware/authenticate');
//get balance
router
  .get('/:githubId', isAuthenticated, balanceController.getSingleBalance);

module.exports = router;
