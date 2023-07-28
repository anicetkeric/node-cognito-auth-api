const { SignUpCommand, ConfirmSignUpCommand, AdminAddUserToGroupCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { poolData, cognitoClient } = require('./config');
const crypto = require('crypto');
const hasher = crypto.createHmac('SHA256', poolData.appClientSecret)
var groups = ["ROLE_ADMIN", "ROLE_USER", "ROLE_GUEST"];


async function signUp(password, email, name, phoneNumber, roles) {

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

  // add group to user
  roles.forEach(role => {
    if (groups.includes(role)) {
      addGroup(email, role);
    }
  });


  return {
    "message": "User created successfully",
    "data": cognitoUser.CodeDeliveryDetails
  };
}

// Adds the specified user to the specified group.
async function addGroup(email, groupName) {

  const command = new AdminAddUserToGroupCommand({
    UserPoolId: poolData.userPoolId,
    Username: email,
    GroupName: groupName
  });

  const cognitoUser = await cognitoClient.send(command);

  console.log(`add group to user result : ${JSON.stringify(cognitoUser)} `);

  return cognitoUser;

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