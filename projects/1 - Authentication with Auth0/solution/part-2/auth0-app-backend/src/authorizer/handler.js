'use strict';

/**
 * Required Env consts:
 * AUTH0_DOMAIN
 */

const auth0RS256TokenValidator = require('./authorizer');

const generatePolicy = (principalId, effect, resource) => {

    const authResponse = {
        principalId
    };

    if (effect && resource) {
        const policyDocument = {
            Version: '2012-10-17',
            Statement: [
                {
                    Action: 'execute-api:Invoke', // default action
                    Effect: effect,
                    Resource: resource,
                }
            ]
        }
        authResponse.policyDocument = policyDocument;
    }

    return authResponse;
};

module.exports.handler = async (event) => {

    const authToken = event.authorizationToken;
    const methodArn = event.methodArn;
    const Auth0ApiBaseUrl = process.env.AUTH0_DOMAIN;

    if (!methodArn) {
        throw new Error('Missing method ARN in event. Can only be called as an API Gateway Authorizer');
    }

    // Validate the authorization token
    await auth0RS256TokenValidator(authToken, Auth0ApiBaseUrl, 'RS256');

    // Generate a response for the token that allows the user to call the API endpoint
    return generatePolicy('user', 'allow', methodArn);

};

