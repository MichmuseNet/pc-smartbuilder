from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel

class Diagnostic(SQLModel, table=True):
    __tablename__ = "diagnostics"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    os_version: str = ""
    cpu: str = ""
    gpu: str = ""
    ram: str = ""
    storage: str = ""
    extra_info: str = ""
    result: str = ""
    system_score: int = 0
    created_at: datetime = Field(default_factory=datetime.utcnow)