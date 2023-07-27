require("dotenv").config();
const { CognitoIdentityProviderClient } = require('@aws-sdk/client-cognito-identity-provider');


const poolData = {
    userPoolId: process.env.AWS_COGNITO_USER_POOL_ID, // App pool Id 
    appClientId: process.env.AWS_COGNITO_CLIENT_ID, // The ID of the client associated with the user pool.
    appClientSecret: process.env.AWS_COGNITO_CLIENT_SECRET // App client Secret 
};

const accessKeyMetadata = {
    accessKeyId: process.env.AWS_ACCESS_KEY, // access key id 
    secretAccessKey: process.env.AWS_SECRET_KEY, // secret access key
    region: process.env.AWS_COGNITO_REGION // AWS region
};

const cognitoClient = new CognitoIdentityProviderClient({
    credentials: {
      accessKeyId: accessKeyMetadata.accessKeyId,
      secretAccessKey: accessKeyMetadata.secretAccessKey,
    },
    forcePathStyle: false,
    region: accessKeyMetadata.region,
});

module.exports = { cognitoClient, poolData};


