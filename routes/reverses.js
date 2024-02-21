"use strict";
const express = require('express');
const router = express.Router();

const reversesController = require("../controllers/reverses");
const { isAuthenticated } = require('../middleware/authenticate');
//get balance
router
  .get('/:id', isAuthenticated, reversesController.getUserReverses);

module.exports = router;
