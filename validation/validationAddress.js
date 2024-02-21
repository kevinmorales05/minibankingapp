const { body, query } = require("express-validator");

const validationTransaction = [
  body("githubId").notEmpty().withMessage("GithubId is required!"),
  body("mainStreet").notEmpty().withMessage("Main Street is required!"),
  body("city").notEmpty().withMessage("City is required!"),
  body("state").notEmpty().withMessage("State is required!"),
  body("country").notEmpty().withMessage("Country destiny is required!"),
  body("houseNumber").notEmpty().withMessage("House number is required"),
  body("reference").notEmpty().withMessage("Reference is required")
];

module.exports = validationTransaction;
