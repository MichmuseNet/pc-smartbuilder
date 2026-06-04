from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class DiagnosticCreate(BaseModel):
    user_id: UUID
    os_version: str = ""
    cpu: str = ""
    gpu: str = ""
    ram: str = ""
    storage: str = ""
    extra_info: str = ""

class DiagnosticRead(BaseModel):
    id: UUID
    user_id: UUID
    os_version: str
    cpu: str
    gpu: str
    ram: str
    storage: str
    result: str
    system_score: int
    created_at: datetime