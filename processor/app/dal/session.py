import time
import os
import tempfile
import ffmpeg
from azure.storage.blob import ContentSettings

from app.config import get_blob_service_client
from app.model.session import SessionData


def process_session(user: str, course: str, session: str) -> None:
    '''Process the session
    '''
    video_path = f'{user}/{course}/{session}/video.webm'
    session_data_path = f'{user}/{course}/{session}/data.json'
    blob_service_client = get_blob_service_client()

    video_blob_client = blob_service_client.get_blob_client(container='focuser', blob=video_path)
    for _ in range(6):
        try:
            print('try try')
            video_stream = video_blob_client.download_blob()
            video_data = video_stream.readall()
            break
        except:
            print('fail fail')
            time.sleep(5)
    fd, tmp_video_path = tempfile.mkstemp(suffix='.webm')
    try:
        with os.fdopen(fd, 'w+b') as tmp_video:
            tmp_video.write(video_data)

        print(os.path.getsize(tmp_video_path))

        session_blob_client = blob_service_client.get_blob_client(
            container='focuser', blob=session_data_path)
        session_stream = session_blob_client.download_blob()
        session_data = SessionData.parse_raw(session_stream.readall())

        for moment in session_data.moments:
            img_fd, tmp_img_path = tempfile.mkstemp(suffix='.jpg')
            ffmpeg.input(tmp_video_path, ss=moment.timestamp -
                         session_data.timestamp).output(tmp_img_path, vframes=1).run(overwrite_output=True)
            img_path = f'{user}/{course}/{session}/images/{str(moment.timestamp)}.jpg'
            img_blob_client = blob_service_client.get_blob_client(
                container='focuser', blob=img_path)
            try:
                with os.fdopen(img_fd, 'r+b') as tmp_img:
                    content_settings = ContentSettings(content_type='image/jpeg')
                    img_blob_client.upload_blob(tmp_img, content_settings=content_settings)
            finally:
                os.remove(tmp_img_path)

        session_data.processing = False
        session_blob_client.upload_blob(session_data.json(), overwrite=True)
    finally:
        os.remove(tmp_video_path)
