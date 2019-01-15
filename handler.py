import logging
from pprint import pformat

logger = logging.getLogger()
logger.setLevel(logging.INFO)

def ingest_gdelt_data(event, context):
    logging.info("EVENT: %s", pformat(event))

    return
    
