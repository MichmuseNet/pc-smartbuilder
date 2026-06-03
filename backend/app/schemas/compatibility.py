from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class CompatibilityCreate(BaseModel):
    user_id: UUID
    cpu: str = ""
    gpu: str = ""
    ram: str = ""
    motherboard: str = ""
    psu: str = ""
    storage: str = ""

class CompatibilityRead(BaseModel):
    id: UUID
    user_id: UUID
    cpu: str
    gpu: str
    ram: str
    motherboard: str
    psu: str
    storage: str
    result: str
    is_compatible: bool
    created_at: datetime