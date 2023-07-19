const { AuthFlowType, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { poolData, cognitoClient } = require('./config');
const crypto = require('crypto');
const hasher = crypto.createHmac('SHA256', poolData.appClientSecret)


async function initiateAuth(username, password) {

    hasher.update(`${username}${poolData.appClientId}`)
    const secretHash = hasher.digest('base64');

    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: poolData.appClientId,
        UserPoolId: poolData.userPoolId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: secretHash,
        }
    });

    const cognitoUser = await cognitoClient.send(command);

    console.log(` cognitoUser result : ${JSON.stringify(cognitoUser)} `);

    // extract tokens
    const accessToken = cognitoUser.AuthenticationResult.AccessToken;
    const refreshToken = cognitoUser.AuthenticationResult.RefreshToken;
    const idToken = cognitoUser.AuthenticationResult.IdToken;
    const expiresIn = cognitoUser.AuthenticationResult.ExpiresIn;

    return {
        "accessToken": accessToken,
        "refreshToken": refreshToken,
        "idToken": idToken,
        "expiresIn": expiresIn
    };
}

async function refreshToken(refreshToken) {

    hasher.update(`${username}${poolData.appClientId}`)
    const secretHash = hasher.digest('base64');

    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: poolData.appClientId,
        UserPoolId: poolData.userPoolId,
        AuthParameters: {
            REFRESH_TOKEN: refreshToken,
            SECRET_HASH: secretHash,
        }
    });

    const cognitoUser = await cognitoClient.send(command);

    console.log(` refresh token result : ${JSON.stringify(cognitoUser)} `);

    // extract tokens
    const accessToken = cognitoUser.AuthenticationResult.AccessToken;
    //const refreshToken = cognitoUser.AuthenticationResult.RefreshToken;
    const idToken = cognitoUser.AuthenticationResult.IdToken;
    const expiresIn = cognitoUser.AuthenticationResult.ExpiresIn;

    return {
        "accessToken": accessToken,
     //   "refreshToken": refreshToken,
        "idToken": idToken,
        "expiresIn": expiresIn
    };
}

module.exports = {
    initiateAuth, refreshToken
}