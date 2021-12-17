from typing import Optional, List
from pydantic import BaseModel, Field


class Moment(BaseModel):
    '''A captured moment in the session
    '''
    timestamp: float
    note: Optional[str] = None


class SessionData(BaseModel):
    '''Session data
    '''
    timestamp: float
    moments: List[Moment] = []
    processing: bool = False


class MomentNote(BaseModel):
    '''A captured moment note
    '''
    video_timestamp: float = Field(..., alias='videoTimestamp')
    image_url: str = Field(..., alias='imageUrl')

    class Config:
        allow_population_by_field_name = True


class SessionNote(BaseModel):
    '''Session note 
    '''
    video_url: str = Field(..., alias='videoUrl')
    moments: List[MomentNote] = []

    class Config:
        allow_population_by_field_name = True
