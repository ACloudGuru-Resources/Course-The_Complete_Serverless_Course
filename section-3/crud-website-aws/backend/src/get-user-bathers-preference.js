/*

Requires env vars:
- PoolPartyTable: e.g my-pool-party-users-bathers

*/

'use strict';

import { DynamoDB } from 'aws-sdk';
const documentClient = new DynamoDB.DocumentClient();

exports.handler = async (event, context, callback) => {

    // using https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property

    // Creating parameters for the call to our bathers table
    const params = {
        TableName: process.env.PoolPartyTable,
        KeyConditionExpression: 'cognito_identity_id = :hkey',
        ExpressionAttributeValues: {
            ':hkey': event.requestContext.authorizer.claims.sub
        }
    };

    // Making the call to the dynamo db table with our parameters and asking for a promise back.
    // Since we're using async await, the code wont continue to execute until a result has been received.
    const result = await documentClient.query(params).promise();

    // Since we're calling this from a frontend, we need to have the access-control-allow-origin header set to avoid cors issues
    // We send back a HTTP response containing a status code, body and headers.
    return {
        statusCode: 200,
        body: JSON.stringify({
            'sub': event.requestContext.authorizer.claims.sub,
            'bathers': (result.Items && result.Items[0] && result.Items[0].bathers) || 'None set'
        }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
}