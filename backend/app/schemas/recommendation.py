from pydantic import BaseModel
from uuid import UUID
from datetime import datetime

class RecommendationCreate(BaseModel):
    user_id: UUID
    use_case: str
    budget: float
    preferred_brand: str = ""
    resolution: str = ""
    target_fps: int = 0
    advanced: bool = False
    ram: str = ""
    gpu: str = ""
    cpu: str = ""
    storage: str = ""

class RecommendationRead(BaseModel):
    id: UUID
    user_id: UUID
    use_case: str
    budget: float
    result: str
    created_at: datetime