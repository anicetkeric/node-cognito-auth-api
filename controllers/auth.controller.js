const cognitoAuthSdk = require('../cognito/sdk/initiate-auth');
const { validationResult } = require("express-validator");


const signIn = async (req, res) => {
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
        res.status(200).json(await cognitoAuthSdk.initiateAuth(body.username, body.password));

    } catch (err) {
        console.error(`Error while authentication: `, err.message);
        res.status(400);
        res.json(err);
    }
}

const getTokenRefresh = async (req, res) => {
    try {
        const errors = validationResult(req);

        // if there is error then return Error
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        res.json(await cognitoAuthSdk.refreshToken(req.query.sub, req.query.token));

    } catch (err) {
        console.error(`Error while refresh token: `, err.message);
        res.status(400);
        res.json(err);
    }
}

const revokeToken = async (req, res) => {
    try {
        const errors = validationResult(req);

        // if there is error then return Error
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                errors: errors.array(),
            });
        }

        res.json(await cognitoAuthSdk.signOut(req.query.token));

    } catch (err) {
        console.error(`Error while signout token: `, err.message);
        res.status(400);
        res.json(err);
    }
}


module.exports = {
    signIn, getTokenRefresh, revokeToken
};