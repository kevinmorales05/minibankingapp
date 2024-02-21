const { body, query } = require("express-validator");

const validationTransaction = [
  body("accountOrigin").notEmpty().withMessage("Account origin is required!"),
  body("nameAccountOrigin").notEmpty().withMessage("Accountholder name is required!"),
  body("nameAccountDestiny").notEmpty().withMessage("Accountholder destiny name is required!"),
  body("accountDestiny").notEmpty().withMessage("Account destiny is required!"),
  body("reference").notEmpty().withMessage("email is required").trim().isEmail().withMessage("Email format is incorrect!")
];

module.exports = validationTransaction;
