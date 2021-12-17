from typing import Optional
from fastapi import FastAPI, Body, Query, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from app.dal.session import process_session

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=['*'],
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)


@app.get('/')
def get_root():
    return 'Hello world!'


@app.post('/session/finalize')
def finalize_session(session: Optional[str] = None):
    '''Finalize the session
    '''
    process_session('hieu', 'neppi', session or 'test_session')
