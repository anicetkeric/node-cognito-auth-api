const { AuthFlowType, InitiateAuthCommand, RevokeTokenCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { poolData, cognitoClient } = require('./config');
const crypto = require('crypto');
const hasher = crypto.createHmac('SHA256', poolData.appClientSecret)


async function initiateAuth(username, password) {

    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.USER_PASSWORD_AUTH,
        ClientId: poolData.appClientId,
        UserPoolId: poolData.userPoolId,
        AuthParameters: {
            USERNAME: username,
            PASSWORD: password,
            SECRET_HASH: getSecretHash(username),
        }
    });

    const cognitoUser = await cognitoClient.send(command);

    console.log(` cognitoUser result : ${JSON.stringify(cognitoUser)} `);

    return getAuthenticationToken(cognitoUser);
}

async function refreshToken(sub, requestRefreshToken) {

    const command = new InitiateAuthCommand({
        AuthFlow: AuthFlowType.REFRESH_TOKEN_AUTH,
        ClientId: poolData.appClientId,
        UserPoolId: poolData.userPoolId,
        AuthParameters: {
            REFRESH_TOKEN: requestRefreshToken,
            SECRET_HASH: getSecretHash(sub),
        }
    });

    const cognitoUser = await cognitoClient.send(command);

    console.log(`Refresh token result : ${JSON.stringify(cognitoUser)} `);

    return getAuthenticationToken(cognitoUser);
}

async function signOut(token) {

    const command = new RevokeTokenCommand({
        Token: token,
        ClientId: poolData.appClientId,
        ClientSecret: poolData.appClientSecret
    });

    const response = await cognitoClient.send(command);

    console.log(`Revoke token result : ${JSON.stringify(cognitoUser)} `);
    return {
        "message": "Token deleted",
        "data": response
    };
}


function getAuthenticationToken(cognitoUser) {

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

function getSecretHash(username) {
    hasher.update(`${username}${poolData.appClientId}`)
    return hasher.digest('base64');
}

module.exports = {
    initiateAuth, refreshToken, signOut
}