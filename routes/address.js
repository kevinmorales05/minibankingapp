"use strict";
const express = require('express');
const router = express.Router();

const addressController = require("../controllers/address");
const validationAddress = require('../validation/validationAddress');
const { isAuthenticated } = require('../middleware/authenticate');

router
  .get('/addressUser/:githubId', isAuthenticated, addressController.getUserAddress)
  .post('/createAddress', validationAddress, isAuthenticated,  addressController.createAddress)
  .put('/updateAddress/:id', validationAddress, isAuthenticated, addressController.updateAddress)
  .delete('/:id', isAuthenticated, addressController.deleteUserAddress);

module.exports = router;