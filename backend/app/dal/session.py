import asyncio
import httpx
from typing import List
from azure.storage.blob import ContentSettings

from app.config import get_config, get_blob_service_client
from app.model.session import Moment, SessionData, MomentNote, SessionNote
from app.util import get_timestamp


async def create_session_json(user: str, course: str, session: str) -> None:
    '''Create a new session data
    '''
    path = f'{user}/{course}/{session}/data.json'
    data = SessionData(timestamp=get_timestamp())
    async with get_blob_service_client() as blob_service_client:
        blob_client = blob_service_client.get_blob_client(container='focuser', blob=path)
        content_settings = ContentSettings(content_type='application/json')
        await blob_client.upload_blob(data.json(), content_settings=content_settings)


async def create_session_moment_timestamp(user: str, course: str, session: str) -> None:
    '''Create a moment in the session
    '''
    timestamp = get_timestamp()
    path = f'{user}/{course}/{session}/data.json'
    async with get_blob_service_client() as blob_service_client:
        blob_client = blob_service_client.get_blob_client(container='focuser', blob=path)
        stream = await blob_client.download_blob()
        data = SessionData.parse_raw(await stream.readall())
        data.moments.append(Moment(timestamp=timestamp))
        await blob_client.upload_blob(data.json(), overwrite=True)


async def finalize_session(user: str,  course: str, session: str) -> None:
    '''End the session
    '''
    config = get_config()
    path = f'{user}/{course}/{session}/data.json'
    async with get_blob_service_client() as blob_service_client:
        blob_client = blob_service_client.get_blob_client(container='focuser', blob=path)
        stream = await blob_client.download_blob()
        data = SessionData.parse_raw(await stream.readall())
        data.processing = True
        await blob_client.upload_blob(data.json(), overwrite=True)

    async with httpx.AsyncClient() as client:
        await client.post(f'{config.processor_url}/session/finalize?session={session}', timeout=60)


async def get_session_note(user: str, course: str, session: str) -> SessionNote:
    '''Get session note data
    '''
    data_path = f'{user}/{course}/{session}/data.json'
    async with get_blob_service_client() as blob_service_client:
        blob_client = blob_service_client.get_blob_client(container='focuser', blob=data_path)
        stream = await blob_client.download_blob()
        data = SessionData.parse_raw(await stream.readall())

        video_path = f'{user}/{course}/{session}/video.webm'
        video_blob_client = blob_service_client.get_blob_client(
            container='focuser', blob=video_path)
        video_url = video_blob_client.url

        moment_notes: List[MomentNote] = []

        for moment in data.moments:
            image_path = f'{user}/{course}/{session}/images/{str(moment.timestamp)}.jpg'
            image_blob_client = blob_service_client.get_blob_client(
                container='focuser', blob=image_path)
            image_url = image_blob_client.url
            moment_notes.append(MomentNote(video_timestamp=moment.timestamp -
                                data.timestamp, image_url=image_url))

        return SessionNote(video_url=video_url, moments=moment_notes)
