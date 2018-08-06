/*

Requires env vars:
- PoolPartyTable: e.g my-pool-party-users-bathers

*/
'use strict';

const AWS = require('aws-sdk');

exports.handler = async (event, context, callback) => {

    let bathers = '';
    let sub = '';
    // using https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/DynamoDB/DocumentClient.html#query-property

    // Creating parameters for the call to our bathers table
    if (event.requestContext.authorizer) {
        sub = event.requestContext.authorizer.claims.sub;
        const params = {
            TableName: process.env.PoolPartyTable,
            KeyConditionExpression: 'user_id = :hkey',
            ExpressionAttributeValues: {
                ':hkey': sub
            }
        };

        // Making the call to the dynamo db table with our parameters and asking for a promise back.
        // Since we're using async await, the code wont continue to execute until a result has been received.
        const documentClient = new AWS.DynamoDB.DocumentClient();
        const result = await documentClient.query(params).promise();
        bathers = (result.Items && result.Items[0] && result.Items[0].bathers);
    }


    // Since we're calling this from a frontend, we need to have the access-control-allow-origin header set to avoid cors issues
    // We send back a HTTP response containing a status code, body and headers.
    const payload = {
        statusCode: sub ? 200 : 401,
        body: JSON.stringify({
            'sub': sub || 'Unauthorized',
            'bathers': bathers || 'None set'
        }),
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        }
    }
    callback(null, payload);
}