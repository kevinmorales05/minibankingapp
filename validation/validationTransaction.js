const { body, query } = require("express-validator");

const validationTransaction = [
  body("accountOrigin").notEmpty().withMessage("Account origin is required!"),
  body("amount").notEmpty().withMessage("Amount is required!"),
  body("nameAccountOrigin").notEmpty().withMessage("Accountholder name is required!"),
  body("nameAccountDestiny").notEmpty().withMessage("Accountholder destiny name is required!"),
  body("accountDestiny").notEmpty().withMessage("Account destiny is required!"),
  body("reference").notEmpty().withMessage("Reference is required"),
  body("githubId").notEmpty().withMessage("Github ID is required")


];

module.exports = validationTransaction;
