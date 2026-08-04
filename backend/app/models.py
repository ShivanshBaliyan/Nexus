from datetime import UTC, datetime
from sqlalchemy import (
    Boolean, 
    DateTime, 
    ForeignKey, 
    String, 
    Text, 
    UniqueConstraint,
    func,
)
from sqlalchemy.orm import (
    DeclarativeBase,
    Mapped,
    mapped_column,
    relationship,
)

class Base(DeclarativeBase):
    pass


class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True)

    username: Mapped[str] = mapped_column(
        String(30),
        unique=True,
        nullable=False,
    )

    email: Mapped[str] = mapped_column(
        String(255),
        unique=True,
        nullable=False,
    )

    password_hash: Mapped[str] = mapped_column(
        String(255),
        nullable=False,
    )

    display_name: Mapped[str | None] = mapped_column(
        String(50),
        nullable=True,
    )

    bio: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    avatar_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    is_active: Mapped[bool] = mapped_column(
        Boolean,
        default=True,
        nullable=False,
    )

    is_verified: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    is_admin: Mapped[bool] = mapped_column(
        Boolean,
        default=False,
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    posts: Mapped[list["Post"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
    )

    comments: Mapped[list["Comment"]] = relationship(
        back_populates="author",
        cascade="all, delete-orphan",
    )

    communities: Mapped[list["Community"]] = relationship(
        back_populates="creator",
        cascade="all, delete-orphan",
    )

    votes: Mapped[list["Vote"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )

    memberships: Mapped[list["CommunityMember"]] = relationship(
        back_populates="user",
        cascade="all, delete-orphan",
    )


class Post(Base):
    __tablename__ = "posts"

    id: Mapped[int] = mapped_column(primary_key=True)

    title: Mapped[str] = mapped_column(
        String(300),
        nullable=False,
    )

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC),
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    author: Mapped["User"] = relationship(
        back_populates="posts",
    )

    comments: Mapped[list["Comment"]] = relationship(
        back_populates="post",
        cascade="all, delete-orphan",
    )

    community_id: Mapped[int] = mapped_column(
        ForeignKey("communities.id"),
        nullable=False,
    )

    community: Mapped["Community"] = relationship(
        back_populates="posts",
    )

    image_url: Mapped[str | None] = mapped_column(
        String(255),
        nullable=True,
    )

    votes: Mapped[list["Vote"]] = relationship(
        back_populates="post",
        cascade="all, delete-orphan",
    )

    @property
    def score(self) -> int:
        return sum(vote.value for vote in self.votes)


class Comment(Base):
    __tablename__ = "comments"

    id: Mapped[int] = mapped_column(primary_key=True)

    content: Mapped[str] = mapped_column(
        Text,
        nullable=False,
    )

    author_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id"),
        nullable=False,
    )

    parent_id: Mapped[int | None] = mapped_column(
        ForeignKey("comments.id"),
        nullable=True,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    updated_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        onupdate=datetime.utcnow,
        nullable=False,
    )

    author: Mapped["User"] = relationship(
        back_populates="comments",
    )

    post: Mapped["Post"] = relationship(
        back_populates="comments",
    )

    parent: Mapped["Comment | None"] = relationship(
        "Comment",
        remote_side=[id],
        back_populates="replies",
    )

    replies: Mapped[list["Comment"]] = relationship(
        "Comment",
        back_populates="parent",
        cascade="all, delete-orphan",
    )


class Community(Base):
    __tablename__ = "communities"

    id: Mapped[int] = mapped_column(primary_key=True)

    name: Mapped[str] = mapped_column(
        String(50),
        unique=True,
        nullable=False,
    )

    title: Mapped[str] = mapped_column(
        String(100),
        nullable=False,
    )

    description: Mapped[str | None] = mapped_column(
        Text,
        nullable=True,
    )

    creator_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime,
        default=datetime.utcnow,
        nullable=False,
    )

    creator: Mapped["User"] = relationship(
        back_populates="communities",
    )

    posts: Mapped[list["Post"]] = relationship(
        back_populates="community",
        cascade="all, delete-orphan",
    )

    memberships: Mapped[list["CommunityMember"]] = relationship(
        back_populates="community",
        cascade="all, delete-orphan",
    )

    @property
    def member_count(self) -> int:
        return len(self.memberships)


class Vote(Base):
    __tablename__ = "votes"

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "post_id",
            name="uq_user_post_vote",
        ),
    )

    id: Mapped[int] = mapped_column(
        primary_key=True,
    )

    value: Mapped[int] = mapped_column()

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    post_id: Mapped[int] = mapped_column(
        ForeignKey("posts.id"),
        nullable=False,
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        server_default=func.now(),
    )

    user: Mapped["User"] = relationship(
        back_populates="votes",
    )

    post: Mapped["Post"] = relationship(
        back_populates="votes",
    )


class CommunityMember(Base):
    __tablename__ = "community_members"

    id: Mapped[int] = mapped_column(primary_key=True)

    user_id: Mapped[int] = mapped_column(
        ForeignKey("users.id"),
        nullable=False,
    )

    community_id: Mapped[int] = mapped_column(
        ForeignKey("communities.id"),
        nullable=False,
    )

    joined_at: Mapped[datetime] = mapped_column(
        server_default=func.now(),
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "community_id",
            name="uq_user_community",
        ),
    )

    user: Mapped["User"] = relationship(
        back_populates="memberships",
    )

    community: Mapped["Community"] = relationship(
        back_populates="memberships",
    )


