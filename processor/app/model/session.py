from typing import Optional, List
from pydantic import BaseModel


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
