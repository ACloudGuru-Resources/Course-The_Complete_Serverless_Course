'use strict';

const AWS = require('aws-sdk');

module.exports.ingestGdeltData = async (event, context) => {
  const s3 = new AWS.S3({apiVersion: '2006-03-01'});

  console.log("Sns Event: ", event['Records'][0]['Sns']);

  // Parse SNS payload JSON

  const snsMessage = JSON.parse(event['Records'][0]['Sns']['Message']);
  const s3Event = snsMessage['Records'][0];

  // Sanity check event type

  if (s3Event['eventSource'] != 'aws:s3') {
    const err = new Error(`eventSource is not 'aws:s3': ${s3Event}`);
    throw err;
  }

  if (s3Event['eventName'] != 'ObjectCreated:Put') {
    const err = new Error(`eventName is not 'ObjectCreated:Put': ${s3Event}`);
    throw err;
  }

  // Get bucket and key from the SNS event

  const bucketName = s3Event['s3']['bucket']['name'];
  const objectKey = s3Event['s3']['object']['key'];

  if (! objectKey.startsWith('v2/events/')) {
    console.info("Not a GDELT events file, skipping: " + objectKey);
    return;
  }

  console.info(`Found GDELT events file: ${bucketName}/${objectKey}`);

  // Download CSV data

  const objectLocation = {Bucket: bucketName, Key: objectKey};
  const s3Object = s3.getObject(objectLocation);
  
  // Parse and transform data

  // Send data to firehose

  return;
};
