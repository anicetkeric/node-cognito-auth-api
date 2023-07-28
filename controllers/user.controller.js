const cognitoUsersSdk = require('../cognito/sdk/list-users');
const cognitoSignupSdk = require('../cognito/sdk/sign-up');
const { validationResult } = require("express-validator");

const getUsers = async (req, res) => {
    try {
       let user = await cognitoUsersSdk.getUsers();
        res.status(200).json(user);
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        res.status(400);
        res.json(err);
    }
}


const signUp = async (req, res) => {
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

        res.status(200).json(await cognitoSignupSdk.signUp(body.password, body.email, body.name, body.phoneNumber, body.roles));

    } catch (err) {
        console.error(`Error while user signUp: `, err.message);
        res.status(400);
        res.json(err);
    }
}



const confirmSignUp = async (req, res) => {
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

        res.json(await cognitoSignupSdk.confirmSignup(body.email, body.code));

    } catch (err) {
        console.error(`Error while refresh token: `, err.message);
        res.status(400);
        res.json(err);
    }
}



module.exports = {
    getUsers, signUp, confirmSignUp
};