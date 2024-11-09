from pymongo import MongoClient
from pymongo.errors import ConnectionFailure
import os
import time
import logging

logger = logging.getLogger(__name__)

class MongoDBClient:
    _instance = None
    _client = None
    _db = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        self.connect()

    def connect(self, max_retries=3, retry_delay=1):
        uri = os.getenv('MONGODB_URI')
        for attempt in range(max_retries):
            try:
                self._client = MongoClient(
                    uri,
                    serverSelectionTimeoutMS=5000,
                    connectTimeoutMS=5000,
                    socketTimeoutMS=5000,
                    maxPoolSize=50,
                    retryWrites=True
                )
                # Test the connection
                self._client.admin.command('ping')
                self._db = self._client.get_default_database()
                logger.info("MongoDB connection successful")
                return
            except ConnectionFailure as e:
                logger.error(f"Connection attempt {attempt + 1} failed: {str(e)}")
                if attempt < max_retries - 1:
                    time.sleep(retry_delay)
                else:
                    raise

    @property
    def db(self):
        if not self._client or not self._db:
            self.connect()
        return self._db

mongodb_client = MongoDBClient.get_instance()