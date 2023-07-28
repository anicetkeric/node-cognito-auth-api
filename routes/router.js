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
 *     UserSignupRequest:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: The user last name.
 *         phoneNumber:
 *           type: string
 *           description: The user phone number.
 *         email:
 *           type: string
 *           description: The user email.
 *         password:
 *           type: string
 *           format: password
 *           description: The user password. 
 *         roles:
 *           type: array
 *           items:
 *             type: string
 *           description: array of roles
 * 
 *     UserConfirmSignUpRequest:
 *       type: object
 *       required:
 *         - email
 *         - code
 *       properties:
 *         email:
 *           type: string
 *           description: The user name of the user whose registration you want to confirm.
 *         code:
 *           type: string
 *           description: The confirmation code sent by a user's request to confirm registration.
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
 *     ApiResponse:
 *       type: object
 *       properties:
 *         message:
 *           type: string
 *           description: A valid access token that Amazon Cognito issued to the user who you want to authenticate.
 *         data:
 *           type: object
 *           description: The expiration period of the authentication result in seconds.
 * 
 */

const express = require('express');
const { refreshTokenValidators, userLoginValidators, userRegisterValidators, confirmSignUpValidators, signOutValidators } = require("../utils/validatiors");
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
 * /signup:
 *   post:
 *     summary: Registers the user in the specified user pool and creates a user name, password, and user attributes.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UserSignupRequest'
 *     responses:
 *       "200":
 *         description: The output of SignUpCommand.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.post("/signup", userRegisterValidators, users.signUp);


/**
 * @swagger
 * /confirm-sign-up: 
 *   put:
 *     summary: Confirms registration of a new user.
 *     tags: [User]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *               $ref: '#/components/schemas/UserConfirmSignUpRequest'
 *     responses:
 *       "200":
 *         description: Represents the response from the server for the registration confirmation.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.put("/confirm-sign-up", confirmSignUpValidators, users.confirmSignUp);


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


/**
 * @swagger
 * /token-revoke:
 *   delete:
 *     summary: Revokes all of the access tokens generated by, and at the same time as, the specified refresh token. 
 *     tags: [Authentication]
 *     parameters:
 *      - in: query
 *        name: token
 *        required: true
 *        schema:
 *         type: string
 *        description: access tokens.
 *     responses:
 *       "200":
 *         description: The authentication result.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.delete("/token-revoke", signOutValidators, auth.revokeToken);


module.exports = router;