const { body, query } = require("express-validator");

const validationUser = [
  body("firstName").notEmpty().withMessage("Name is required!"),
  body("lastName").notEmpty().withMessage("Last name is required!"),
  body("favoriteColor").optional(),
  body("birthday").notEmpty().withMessage("Birthday is required!"),
  body("email").notEmpty().withMessage("email is required").trim().isEmail().withMessage("Email format is incorrect!")
];

module.exports = validationUser;
