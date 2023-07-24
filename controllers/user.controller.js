const cognitoUsersSdk = require('../cognito/sdk/list-users');

const getUsers = async (req, res) => {
    try {
       let user = await cognitoUsersSdk.getUsers();
        res.status(200).json(user);
    } catch (err) {
        console.error(`Error while getting users `, err.message);
        next(err);
    }
}


module.exports = {
    getUsers
};