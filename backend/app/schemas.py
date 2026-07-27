from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime


class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str


class UserResponse(BaseModel):
    id: int
    username: str
    email: EmailStr

    model_config = {
        "from_attributes": True
    }


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class Token(BaseModel):
    access_token: str
    token_type: str


class PostCreate(BaseModel):
    title: str = Field(
        min_length=5,
        max_length=300,
        description="Post title",
    )

    content: str = Field(
        min_length=1,
        max_length=10000,
        description="Post content",
    )


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    author: PostAuthor
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class PostUpdate(BaseModel):
    title: str = Field(
        min_length=5,
        max_length=300,
    )

    content: str = Field(
        min_length=1,
        max_length=10000,
    )


class PostAuthor(BaseModel):
    id: int
    username: str
    display_name: str | None

    model_config = ConfigDict(from_attributes=True)