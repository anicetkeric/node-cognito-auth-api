require("dotenv").config();
const AWS = require('aws-sdk');
const jwt_decode = require('jwt-decode');
const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
const { poolData, iamUser } = require('./aws-credentials');

function getCognitoUser(email) {
    const userData = {
      Username: email,
      Pool: getUserPool()
    };
    return new AmazonCognitoIdentity.CognitoUser(userData);
  }
  function decodeJWTToken(token) {
    const {  email, exp, auth_time , token_use, sub} = jwt_decode(token.idToken);
    return {  token, email, exp, uid: sub, auth_time, token_use };
  }
  function getAuthDetails(email, password) {
    var authenticationData = {
      Username: email,
      Password: password,
     };
    return new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
  }
function signIn(email, password) {
    return new Promise((resolve) => {
      getCognitoUser(email).authenticateUser(getAuthDetails(email, password), {
        onSuccess: (result) => {
          const token = {
            accessToken: result.getAccessToken().getJwtToken(),
            idToken: result.getIdToken().getJwtToken(),
            refreshToken: result.getRefreshToken().getToken(),
          }  
          return resolve({ statusCode: 200, response: decodeJWTToken(token) });
        },
        
        onFailure: (err) => {
          return resolve({ statusCode: 400, response: err.message || JSON.stringify(err)});
        },
      });
    });
  }
  
  module.exports = {
      signIn
  }