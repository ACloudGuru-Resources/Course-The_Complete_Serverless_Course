'use strict';

const AWS = require('aws-sdk');
const uuid = require('uuid');

module.exports.submitContactForm = async (event, context) => {
  console.log("EVENT: ", event);

  const sns = new AWS.SNS();

  const messageData = JSON.parse(event.body);
  console.log("Message: ", messageData);

  let message = "Hello, world!";
  let statusCode = 200;

  let response = {
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Credentials": true
    },
  };

  if (typeof messageData.name != 'string' || messageData.name.length === 0) {
    statusCode = 400;
    message = "Name is required";
  }

  if (typeof messageData.email != 'string' || messageData.email.length === 0) {
    statusCode = 400;
    message = "Email address is required";
  }

  if (typeof messageData.message != 'string' || messageData.message.length === 0) {
    statusCode = 400;
    message = "A message is required";
  }

  const snsMessage = {
    TopicArn: process.env.CONTACT_TOPIC_ARN,
    Subject: "Message from Contactotron",
    Message: `
Contact Form Message

From: ${messageData.name} <${messageData.email}>
Message:
${messageData.message}
    `
  };

  const result = await sns.publish(snsMessage).promise();
  console.log("PUBLISH RESULT: ", result);
  // { ResponseMetadata: { RequestId: '25f27025-32f8-59ad-8f53-248fc5a553d8' },
  //   MessageId: 'cf6561fb-09d6-57f7-9ab7-3551fe8bad82' }

  response.statusCode = statusCode;
  response.body = JSON.stringify({ message: message });

  console.log("RESPONSE: ", JSON.stringify(response));

  return response;
};

module.exports.saveContactMessage = async (event, context) => {
  console.log("SNS EVENT: ", event);
  const dynamoDB = new AWS.DynamoDB();
  const snsObject = event.Records[0].Sns;

  const dbItem = {
    TableName: process.env.CONTACT_TABLE_NAME,
    Item: {
      'id': {S: uuid.v4()},
      'Timestamp': {S: snsObject.Timestamp},
      'MessageId': {S: snsObject.MessageId},
      'Message': {S: snsObject.Message},
      'Subject': {S: snsObject.Subject}
    }
  };
  console.log("SAVING: ", dbItem);
  await dynamoDB.putItem(dbItem).promise();
  console.log("SAVED");

  return;
}
