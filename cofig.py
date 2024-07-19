import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SNS_TOPIC_ARN = os.getenv('SNS_TOPIC_ARN')
    TOPIC_SHIP_ARN = os.getenv('TOPIC_SHIP_ARN')
    ORDERS_TABLE = os.getenv('ORDERS_TABLE')
    PRODUCTION_TABLE = os.getenv('PRODUCTION_TABLE')
    SHIPMENTS_TABLE = os.getenv('SHIPMENTS_TABLE')
