const { body } = require("express-validator");

const userLoginValidators = [
    body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 5 characters"),
    body("username")
    .exists({ checkFalsy: true })
    .withMessage("Username is required")
    .isString()
    .withMessage("Username should be string")
    .isEmail().withMessage("Provide valid email")
];


module.exports = { userLoginValidators };