from pydantic import BaseModel, EmailStr
from uuid import UUID
from datetime import datetime

class UserCreate(BaseModel):
    username: str
    name: str
    lastname: str
    email: str
    password: str

class UserRead(BaseModel):
    id: UUID
    username: str
    name: str
    lastname: str
    email: str
    created_at: datetime

class UserLogin(BaseModel):
    email: str
    password: str

class TokenResponse(BaseModel):
    access_token: str
    token_type: str
    user: UserRead