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

    display_name: str | None
    bio: str | None
    avatar_url: str | None

    model_config = {
        "from_attributes": True
    }


class UserLogin(BaseModel):
    email: EmailStr
    password: str


class UserUpdate(BaseModel):
    display_name: str | None = None
    bio: str | None = None
    avatar_url: str | None = None


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

    image_url: str | None = None

    community_id: int


class PostResponse(BaseModel):
    id: int
    title: str
    content: str
    image_url: str | None

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

    image_url: str | None = None


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

    parent_id: int | None = None


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
    parent_id: int | None

    created_at: datetime
    updated_at: datetime

    replies: list["CommentResponse"] = []

    model_config = ConfigDict(from_attributes=True)

CommentResponse.model_rebuild()


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

    is_member: bool = False

    created_at: datetime

    model_config = ConfigDict(from_attributes=True)


class VoteCreate(BaseModel):
    value: Literal[-1, 1]


class UserProfilePost(BaseModel):
    id: int
    title: str
    content: str

    community: PostCommunity
    author: PostAuthor

    score: int

    created_at: datetime
    updated_at: datetime | None

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
    avatar_url: str | None

    posts: list[PostResponse]

    created_communities: list[UserProfileCommunity]
    joined_communities: list[UserProfileCommunity]

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


class AvatarUploadResponse(BaseModel):
    upload_url: str
    public_url: str
    key: str


