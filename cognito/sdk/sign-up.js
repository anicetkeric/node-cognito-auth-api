const { SignUpCommand, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { poolData, cognitoClient } = require('./config');
const crypto = require('crypto');
const hasher = crypto.createHmac('SHA256', poolData.appClientSecret)


async function signUp(password, email, name, phoneNumber) {

  hasher.update(`${email}${poolData.appClientId}`)

  const command = new SignUpCommand({
    ClientId: poolData.appClientId,
    Username: email,
    Password: password,
    SecretHash: hasher.digest('base64'),
    UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name }, { Name: "phone_number", Value: phoneNumber }],
  });

  const cognitoUser = await cognitoClient.send(command);

  console.log(`user signUp result : ${JSON.stringify(cognitoUser)} `);

  return {
    "message": "User created successfully",
    "data": cognitoUser.CodeDeliveryDetails
  };
}

async function addGroup(email, name, phoneNumber) {

  hasher.update(`${email}${poolData.appClientId}`)

  const command = new SignUpCommand({
    ClientId: poolData.appClientId,
    Username: email,
    Password: password,
    SecretHash: hasher.digest('base64'),
    UserAttributes: [{ Name: "email", Value: email }, { Name: "name", Value: name }, { Name: "phone_number", Value: phoneNumber }],
  });

  const cognitoUser = await cognitoClient.send(command);

  console.log(`user signUp result : ${JSON.stringify(cognitoUser)} `);

  return {
    "message": "User created successfully",
    "data": cognitoUser.CodeDeliveryDetails
  };
}

async function confirmSignup(email, code) {

  hasher.update(`${email}${poolData.appClientId}`)

  const command = new ConfirmSignUpCommand({
    ClientId: poolData.appClientId,
    ConfirmationCode: code,
    Username: email,
    SecretHash: hasher.digest('base64')
  });

  const response = await cognitoClient.send(command);

  console.log(`user confirm signUp result : ${JSON.stringify(response)} `);

  return {
    "message": "Confirmed user account",
    "data": response
  };
}

module.exports = {
  signUp, confirmSignup
}