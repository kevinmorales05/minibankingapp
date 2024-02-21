"use strict";
const express = require('express');
const router = express.Router();

const addressController = require("../controllers/address");
const validationUser = require('../validation/validationUser');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/addressUser/:id', isAuthenticated, addressController.getUserAddress)
  .post('/createAddress', isAuthenticated, validationUser, addressController.createAddress)
  .put('/updateAddress/:id', isAuthenticated, validationUser, addressController.updateAddress)
  .delete('/:id', isAuthenticated, addressController.deleteUserAddress);

module.exports = router;