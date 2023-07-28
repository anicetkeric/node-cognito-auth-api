const { query, body } = require("express-validator");

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

const userRegisterValidators = [
    body("password")
    .exists()
    .withMessage("Password is required")
    .isString()
    .withMessage("Password should be string")
    .isLength({ min: 8 })
    .withMessage("Password should be at least 5 characters"),
    body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email should be string")
    .isEmail().withMessage("Provide valid email"),
    body("name")
    .exists()
    .withMessage("Name is required")
    .isString()
    .withMessage("Name should be string"),
    body("phoneNumber")
    .exists()
    .withMessage("phoneNumber is required")
    .isString()
    .withMessage("phoneNumber should be string"),
    body("roles")
    .notEmpty()
    .isArray().withMessage('roles must be in an array.')
];

const refreshTokenValidators = [
    query('token')
    .isString().notEmpty().withMessage('Refresh Token is required'),
    query('sub')
    .isString().notEmpty().withMessage('Sub username is required')
];

const signOutValidators = [
    query('token')
    .isString().notEmpty().withMessage('Refresh Token is required')
];


const confirmSignUpValidators = [
    body("code")
    .exists()
    .withMessage("Code is required")
    .isString()
    .withMessage("Code should be string"),
    body("email")
    .exists({ checkFalsy: true })
    .withMessage("Email is required")
    .isString()
    .withMessage("Email should be string")
    .isEmail().withMessage("Provide valid email")
];

module.exports = { userLoginValidators, refreshTokenValidators, userRegisterValidators, confirmSignUpValidators, signOutValidators};