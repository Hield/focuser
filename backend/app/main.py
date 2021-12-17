from typing import Optional
from fastapi import FastAPI, Body, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.dal.session import create_session_json, create_session_moment_timestamp, finalize_session, get_session_note
from app.dal.video import upload_video_blob
from app.model.session import SessionNote


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/')
def read_root():
    return 'Hello world!'


@app.get('/session/note', response_model=SessionNote)
async def get_session_note_endpoint(session: Optional[str] = None):
    return await get_session_note('hieu', 'neppi', session or 'test_session')


@app.post('/session')
async def create_session(session: Optional[str] = None):
    await create_session_json('hieu', 'neppi', session or 'test_session')


@app.post('/session/moment')
async def create_sesion_moment(session: Optional[str] = None):
    await create_session_moment_timestamp('hieu', 'neppi', session or 'test_session')


@app.post('/session/end')
async def end_session(session: Optional[str] = None):
    await finalize_session('hieu', 'neppi', session or 'test_session')


@app.post('/video/upload')
async def upload_video(file: UploadFile = File(...), session: Optional[str] = None):
    await upload_video_blob('hieu', 'neppi', session or 'test_session', await file.read())
