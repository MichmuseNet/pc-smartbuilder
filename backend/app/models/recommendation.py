from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel

class Recommendation(SQLModel, table=True):
    __tablename__ = "recommendations"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
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
    result: str = ""
    created_at: datetime = Field(default_factory=datetime.utcnow)