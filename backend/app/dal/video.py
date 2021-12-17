from azure.storage.blob import ContentSettings
from app.config import get_blob_service_client


async def upload_video_blob(user: str, course: str, session: str, data) -> None:
    '''Append the video blob to the video file
    '''
    path = f'{user}/{course}/{session}/video.webm'
    async with get_blob_service_client() as blob_service_client:
        blob_client = blob_service_client.get_blob_client(container='focuser', blob=path)
        content_settings = ContentSettings(content_type='video/webm')
        await blob_client.upload_blob(data,
                                      content_settings=content_settings)
