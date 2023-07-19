const { ListUsersCommand } = require('@aws-sdk/client-cognito-identity-provider');
const { poolData, cognitoClient } = require('./config');


async function getUsers() {

  const command = new ListUsersCommand({
    UserPoolId: poolData.userPoolId,
  });
  const response = [];

  const cognitoUser = await cognitoClient.send(command);

  cognitoUser.Users.forEach(user => {
    const result = {};
    user.Attributes.forEach(elt => {
      result[elt.Name] = elt.Value;
    });
    result.enabled = user.Enabled;
    result.createDate = user.UserCreateDate;
    result.lastModifiedDate = user.UserLastModifiedDate;
    result.status = user.UserStatus;
    result.username = user.Username;

    response.push(result);
  });

  console.log(`cognitoUser result : ${JSON.stringify(cognitoUser)} `);

  return response;
}


module.exports = {
  getUsers
}