from pydantic import BaseModel, ConfigDict, EmailStr, Field
from datetime import datetime
from typing import Literal


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

    community_id: int


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    community: PostCommunity
    author: PostAuthor
    score: int
    created_at: datetime
    updated_at: datetime | None

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


class PostCommunity(BaseModel):
    id: int
    name: str
    title: str

    model_config = ConfigDict(from_attributes=True)


class CommentAuthor(BaseModel):
    id: int
    username: str
    display_name: str | None

    model_config = ConfigDict(from_attributes=True)


class CommentCreate(BaseModel):
    content: str = Field(
        min_length=1,
        max_length=5000,
    )


class CommentUpdate(BaseModel):
    content: str = Field(
        min_length=1,
        max_length=5000,
    )


class CommentResponse(BaseModel):
    id: int
    content: str
    author: CommentAuthor
    post_id: int
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(from_attributes=True)


class CommunityCreate(BaseModel):
    name: str = Field(
        min_length=3,
        max_length=21,
        pattern=r"^[A-Za-z0-9_]+$",
    )
    title: str = Field(
        min_length=3,
        max_length=100,
    )
    description: str | None = Field(
        default=None,
        max_length=500,
    )


class CommunityResponse(BaseModel):
    id: int
    name: str
    title: str
    description: str | None

    creator: UserResponse

    member_count: int

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VoteCreate(BaseModel):
    value: Literal[-1, 1]


class UserProfilePost(BaseModel):
    id: int
    title: str
    score: int
    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class UserProfileCommunity(BaseModel):
    id: int
    name: str
    title: str

    model_config = ConfigDict(from_attributes=True)


class UserProfileResponse(BaseModel):
    id: int
    username: str
    display_name: str | None
    bio: str | None
    created_at: datetime

    posts: list[UserProfilePost]
    communities: list[UserProfileCommunity]

    model_config = ConfigDict(from_attributes=True)


class SearchUser(BaseModel):
    id: int
    username: str
    display_name: str | None

    model_config = ConfigDict(from_attributes=True)


class SearchCommunity(BaseModel):
    id: int
    name: str
    title: str

    model_config = ConfigDict(from_attributes=True)


class SearchPost(BaseModel):
    id: int
    title: str
    score: int

    model_config = ConfigDict(from_attributes=True)


class SearchResponse(BaseModel):
    users: list[SearchUser]
    communities: list[SearchCommunity]
    posts: list[SearchPost]


