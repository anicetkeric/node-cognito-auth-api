const express = require('express');
const { validationResult } = require("express-validator");
const { userLoginValidators } = require("../utils/validatiors");
const cognitoUsersSdk = require('../cognito/sdk/list-users');
const cognitoAuthSdk = require('../cognito/sdk/initiate-auth');

const router = express.Router();
router.use(express.json());


router.get('/', (request, response) => {
    response.json({ info: 'Node.js, Express with AWS cognito' });
});

router.get('/users', async function (req, res, next) {
    try {
        res.json(await cognitoUsersSdk.getUsers());
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
});

router.post('/login', userLoginValidators , async function (req, res, next) {
    try {
        const errors = validationResult(req);

        // if there is error then return Error
        if (!errors.isEmpty()) {
          return res.status(400).json({
            success: false,
            errors: errors.array(),
          });
        }

        var body = req.body;
        res.json(await cognitoAuthSdk.initiateAuth(body.username, body.password));

    } catch (err) {
        console.error(`Error while authentication: `, err.message);
        next(err);
    }
});

module.exports = router;