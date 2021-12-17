from functools import lru_cache
from azure.storage.blob import BlobServiceClient
from pydantic import BaseSettings, Field


class Config(BaseSettings):
    '''Config
    '''
    storage_connection_string: str = Field(..., env='STORAGE_CONNECTION_STRING')


@lru_cache
def get_config() -> Config:
    return Config()


def get_blob_service_client() -> BlobServiceClient:
    '''Get `BlobServiceClient`
    '''
    config = Config()
    return BlobServiceClient.from_connection_string(config.storage_connection_string)
