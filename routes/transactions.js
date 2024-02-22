"use strict";
const express = require('express');
const router = express.Router();

const transactionsController = require("../controllers/transaction");
const validationTransaction = require('../validation/validationTransaction');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/:githubId', isAuthenticated, transactionsController.getUserTransactions)
  .post('/sendMoney', isAuthenticated, validationTransaction, transactionsController.createTransaction)
  .delete('/reverse/:id', isAuthenticated, transactionsController.reverseTransaction)
  .put('/fund/:githubId', isAuthenticated, transactionsController.fundAccount )
  

module.exports = router;
