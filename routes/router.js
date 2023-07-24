/**
 * @swagger
 * tags:
 *  - name: User
 *    description: API to manage your books.
 *  - name: Authentication
 *    description: Manage all user endpoints for authentication.
 * components:
 *   schemas:
 *     UserType:
 *       type: object
 *       properties:
 *         sub:
 *           type: string
 *           description: Subject of the JWT (the user)
 *         email_verified:
 *           type: string
 *           description: if user email is verified
 *         name:
 *           type: string
 *           description: The name of user
 *         phone_number_verified:
 *           type: string
 *           description: The user phone number
 *         email:
 *           type: string
 *           description: The user email
 *         enabled:
 *           type: boolean
 *           description: Specifies whether the user is enabled.
 *         createDate:
 *           type: string
 *           format: date
 *           description: The creation date of the user.
 *         lastModifiedDate:
 *           type: string
 *           format: date
 *           description: The last modified date of the user.
 *         status:
 *           type: string
 *           description: The user status. UNCONFIRMED - CONFIRMED - RESET_REQUIRED - UNKNOWN
 *         username:
 *           type: string
 *           description: The user name of the user you want to describe.
 * 
 *     UserLoginRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           description: The user email
 *         password:
 *           type: string
 *           format: password
 *           description: The user password. 
 * 
 *     AuthenticationResultType:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           description: A valid access token that Amazon Cognito issued to the user who you want to authenticate.
 *         expiresIn:
 *           type: number
 *           description: The expiration period of the authentication result in seconds.
 *         idToken:
 *           type: string
 *           description: The ID token.
 *         refreshToken:
 *           type: string
 *           description: The refresh token.
 * 
 * 
 */

const express = require('express');
const { query, validationResult } = require("express-validator");
const { refreshTokenValidators, userLoginValidators } = require("../utils/validatiors");
const users = require('../controllers/user.controller');
const auth = require('../controllers/auth.controller');



const router = express.Router();
router.use(express.json());



/**
 * @swagger
 * /:
 *   get:
 *     summary: api status
 *     responses:
 *       "200":
 *         description: Return message for API status.
 *         content:
 *           application/json:
 *             schema:
 *               type: string
 *       "500":
 *         description: Some server error
 */
router.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express with AWS cognito' });
});


/**
 * @swagger
 * /users:
 *   get:
 *     summary: List all the cognito users
 *     tags: [User]
 *     responses:
 *       "200":
 *         description: The list of users.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserType'
 */
router.get("/users", users.getUsers);

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User Login
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UserLoginRequest'
 *     responses:
 *       "200":
 *         description: The authentication result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResultType'
 */
router.post("/login", userLoginValidators, auth.signIn);

/**
 * @swagger
 * /refresh:
 *   get:
 *     summary: Allow users to get the token refresh
 *     tags: [Authentication]
 *     responses:
 *       "200":
 *         description: The authentication result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthenticationResultType'
 */
router.get("/refresh", refreshTokenValidators, auth.getTokenRefresh);


module.exports = router;