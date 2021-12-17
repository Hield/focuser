from functools import lru_cache
from azure.storage.blob.aio import BlobServiceClient
from pydantic import BaseSettings, Field


class Config(BaseSettings):
    '''Config
    '''
    storage_connection_string: str = Field(..., env='STORAGE_CONNECTION_STRING')
    processor_url: str = Field(..., env='PROCESSOR_URL')


@lru_cache
def get_config() -> Config:
    return Config()


def get_blob_service_client() -> BlobServiceClient:
    '''Get async `BlobServiceClient`
    '''
    config = Config()
    return BlobServiceClient.from_connection_string(config.storage_connection_string)
