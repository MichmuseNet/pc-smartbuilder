from datetime import datetime
import uuid
from sqlmodel import Field, SQLModel

class CompatibilityCheck(SQLModel, table=True):
    __tablename__ = "compatibility_checks"

    id: uuid.UUID = Field(default_factory=uuid.uuid4, primary_key=True)
    user_id: uuid.UUID = Field(foreign_key="users.id")
    cpu: str = ""
    gpu: str = ""
    ram: str = ""
    motherboard: str = ""
    psu: str = ""
    storage: str = ""
    result: str = ""
    is_compatible: bool = False
    created_at: datetime = Field(default_factory=datetime.utcnow)