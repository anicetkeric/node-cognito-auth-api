require("dotenv").config();
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');

const poolData = {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID, // Your user pool id here    
    appClientId: process.env.AWS_COGNITO_CLIENT_ID, // Your client id here
    appClientSecret: process.env.AWS_COGNITO_CLIENT_SECRET // Your client secret here
};

const accessKeyMetadata = {
    accessKeyId: process.env.AWS_ACCESS_KEY, // Your user pool id here    
    secretAccessKey: process.env.AWS_SECRET_KEY, // Your client id here
    region: process.env.AWS_COGNITO_REGION // Your client secret here
};

const cognitoClient = new CognitoIdentityProviderClient({
    credentials: {
      accessKeyId: accessKeyMetadata.accessKeyId,
      secretAccessKey: accessKeyMetadata.secretAccessKey,
    },
    forcePathStyle: false,
    region: accessKeyMetadata.region,
});

module.exports = { cognitoClient, poolData };


