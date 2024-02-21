"use strict";
const express = require('express');
const router = express.Router();

const transactionsController = require("../controllers/transaction");
const validationTransaction = require('../validation/validationTransaction');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/:id', isAuthenticated, transactionsController.getUserTransactions)
  .post('/sendMoney', isAuthenticated, validationTransaction, transactionsController.createTransaction)
  .delete('/reverse/:id', isAuthenticated, transactionsController.reverseTransaction)
  

module.exports = router;
