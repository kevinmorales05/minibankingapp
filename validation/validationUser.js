const { body, query } = require("express-validator");

const validationUser = [
  body("firstName").notEmpty().withMessage("Name is required!"),
  body("lastName").notEmpty().withMessage("Last name is required!"),
  body("favoriteColor").optional(),
  body("birthday").notEmpty().withMessage("Birthday is required!"),
  body("addressId").notEmpty().withMessage("User address is required!"),
  body("githubId").notEmpty().withMessage("GithubId is required!"),
  body("accountId").notEmpty().withMessage("AccountID is required!"),
  body("email").notEmpty().withMessage("email is required").trim().isEmail().withMessage("Email format is incorrect!")
];

module.exports = validationUser;