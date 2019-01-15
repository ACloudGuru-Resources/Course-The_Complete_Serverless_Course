import boto3
import json
import logging
from pprint import pformat

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def ingest_gdelt_data(event, context):
    logging.info("EVENT: %s", pformat(event))

    s3 = boto3.resource('s3')

    # Parse SNS payload JSON

    message = json.loads(event['Records'][0]['Sns']['Message'])
    logger.info("Parsed message JSON: %s", pformat(message))

    s3_event = message['Records'][0]

    # Sanity check event type

    if s3_event['eventSource'] != 'aws:s3':
        logger.error("eventSource is not 'aws:s3': %s", pformat(s3_event))
        return

    if s3_event['eventName'] != 'ObjectCreated:Put':
        logger.warning("Not a put event, skipping: %s", s3_event['eventName'])
        return

    # Extract bucket name and key

    bucket_name = s3_event['s3']['bucket']['name']
    object_key = s3_event['s3']['object']['key']

    if not object_key.startswith('v2/events/'):
        logger.info("Not a new GDELT events file, skipping: %s", object_key)
        return

    logger.info("Found GDELT events file: %s/%s", bucket_name, object_key)

    s3_object = s3.Object(bucket_name, object_key)
    s3_object.download_file('/tmp/gdelt_event.csv')
    logger.info("Wrote s3 object %s to /tmp/gdelt_event.csv", object_key)



    # Download CSV data

    # Process/transform data

    # Send data to firehose

    return
