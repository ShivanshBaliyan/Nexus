from fastapi import HTTPException, status
from sqlalchemy import select, or_
from sqlalchemy.orm import Session, selectinload
from fastapi.security import OAuth2PasswordRequestForm
from app.models import (
    User, 
    Post, 
    Comment, 
    Community, 
    Vote,
    CommunityMember,
)
from app.schemas import (
    UserCreate, 
    UserLogin, 
    PostCreate, 
    PostUpdate,
    CommentCreate,
    CommentUpdate,
    VoteCreate,
    UserUpdate,
)
from app.auth import (
    hash_password,
    verify_password,
    create_access_token,
)


def register_user(db: Session, user_data: UserCreate) -> User:
    existing_user = (
        db.query(User)
        .filter(User.username == user_data.username)
        .first()
    )

    if existing_user:
        raise ValueError("Username already exists")

    existing_email = (
        db.query(User)
        .filter(User.email == user_data.email)
        .first()
    )

    if existing_email:
        raise ValueError("Email already exists")

    password_hash = hash_password(user_data.password)

    user = User(
        username=user_data.username,
        email=user_data.email,
        password_hash=password_hash,
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def login_user(db: Session, form_data: OAuth2PasswordRequestForm) -> str:
    user = (
        db.query(User)
        .filter(User.email == form_data.username)
        .first()
    )

    if user is None:
        raise ValueError("Invalid email or password")

    if not verify_password(
        form_data.password,
        user.password_hash,
    ):
        raise ValueError("Invalid email or password")

    token = create_access_token(
        {"sub": str(user.id)}
    )

    return token


def update_profile(
    db: Session,
    current_user: User,
    user_data: UserUpdate,
):
    if user_data.display_name is not None:
        current_user.display_name = user_data.display_name

    if user_data.bio is not None:
        current_user.bio = user_data.bio

    if user_data.avatar_url is not None:
        current_user.avatar_url = user_data.avatar_url

    db.commit()
    db.refresh(current_user)

    return current_user


def create_post(
    db: Session,
    post_data: PostCreate,
    current_user: User,
) -> Post:
    community = db.get(Community, post_data.community_id)

    if community is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found.",
        )

    post = Post(
        title=post_data.title,
        content=post_data.content,
        image_url=post_data.image_url,
        author_id=current_user.id,
        community_id=post_data.community_id,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return post


def get_posts(
    db: Session,
    page: int = 1,
    limit: int = 10,
) -> list[Post]:
    offset = (page - 1) * limit

    return (
        db.query(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.community),
            selectinload(Post.votes),
        )
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_post(
    db: Session,
    post_id: int,
) -> Post:
    post = (
        db.query(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.community),
            selectinload(Post.votes),
        )
        .filter(Post.id == post_id)
        .first()
    )

    if post is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found.",
        )

    return post


def update_post(
    db: Session,
    post_id: int,
    post_data: PostUpdate,
    current_user: User,
) -> Post:
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise ValueError("Post not found")

    if post.author_id != current_user.id:
        raise PermissionError("You are not allowed to edit this post")

    post.title = post_data.title
    post.content = post_data.content
    post.community_id = post_data.community_id
    post.image_url = post_data.image_url

    db.commit()
    db.refresh(post)

    return post


def delete_post(
    db: Session,
    post_id: int,
    current_user: User,
) -> None:
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise ValueError("Post not found")

    if post.author_id != current_user.id:
        raise PermissionError("You are not allowed to delete this post")

    db.delete(post)
    db.commit()


def create_comment(
    db: Session,
    post_id: int,
    comment_data: CommentCreate,
    current_user: User,
) -> Comment:
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise ValueError("Post not found")

    comment = Comment(
        content=comment_data.content,
        author_id=current_user.id,
        post_id=post.id,
        parent_id=comment_data.parent_id,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return comment


def get_comments(
    db: Session,
    post_id: int,
):
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise ValueError("Post not found")

    comments = (
        db.query(Comment)
        .options(
            selectinload(Comment.author),
        )
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )

    for comment in comments:
        comment.replies = []

    comment_map = {
        comment.id: comment
        for comment in comments
    }

    root_comments = []

    for comment in comments:
        if comment.parent_id is None:
            root_comments.append(comment)
        else:
            parent = comment_map.get(comment.parent_id)

            if parent:
                parent.replies.append(comment)

    return root_comments


def update_comment(
    db: Session,
    comment_id: int,
    comment_data: CommentUpdate,
    current_user: User,
) -> Comment:
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if comment is None:
        raise ValueError("Comment not found")

    if comment.author_id != current_user.id:
        raise PermissionError("Not authorized to update this comment")

    comment.content = comment_data.content

    db.commit()
    db.refresh(comment)

    return comment


def delete_comment(
    db: Session,
    comment_id: int,
    current_user: User,
):
    comment = (
        db.query(Comment)
        .filter(Comment.id == comment_id)
        .first()
    )

    if comment is None:
        raise ValueError("Comment not found")

    if comment.author_id != current_user.id:
        raise PermissionError("Not authorized to delete this comment")

    db.delete(comment)
    db.commit()


def get_posts_by_community(
    db: Session,
    community_name: str,
    page: int = 1,
    limit: int = 10,
) -> list[Post]:
    offset = (page - 1) * limit

    community = db.scalar(
        select(Community).where(
            Community.name == community_name
        )
    )

    if community is None:
        raise ValueError("Community not found")

    return (
        db.query(Post)
        .options(
            selectinload(Post.author),
            selectinload(Post.community),
            selectinload(Post.votes),
        )
        .filter(Post.community_id == community.id)
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def vote_post(
    db: Session,
    post_id: int,
    vote_data: VoteCreate,
    current_user: User,
):
    post = db.get(Post, post_id)

    if post is None:
        raise ValueError("Post not found")

    vote = db.scalar(
        select(Vote).where(
            Vote.user_id == current_user.id,
            Vote.post_id == post_id,
        )
    )

    if vote:
        vote.value = vote_data.value
    else:
        vote = Vote(
            value=vote_data.value,
            user_id=current_user.id,
            post_id=post_id,
        )
        db.add(vote)

    db.commit()


def remove_vote(
    db: Session,
    post_id: int,
    current_user: User,
):
    vote = db.scalar(
        select(Vote).where(
            Vote.user_id == current_user.id,
            Vote.post_id == post_id,
        )
    )

    if vote is None:
        raise ValueError("Vote not found")

    db.delete(vote)
    db.commit()


def get_user_profile(db: Session, username: str):
    user = db.scalar(
        select(User)
        .where(User.username == username)
        .options(
            selectinload(User.posts).selectinload(Post.author),
            selectinload(User.posts).selectinload(Post.community),
            selectinload(User.posts).selectinload(Post.votes),

            selectinload(User.communities),

            selectinload(User.memberships).selectinload(
                CommunityMember.community
            ),
        )
    )

    if user is None:
        raise ValueError("User not found")

    return {
        "id": user.id,
        "username": user.username,
        "display_name": user.display_name,
        "bio": user.bio,
        "avatar_url": user.avatar_url,   # ← ADD THIS
        "created_at": user.created_at,

        "posts": user.posts,

        "created_communities": user.communities,

        "joined_communities": [
            membership.community
            for membership in user.memberships
        ],
    }


def join_community(
    db: Session,
    community_name: str,
    current_user: User,
):
    community = db.scalar(
        select(Community).where(
            Community.name == community_name
        )
    )

    if community is None:
        raise ValueError("Community not found")

    membership = db.scalar(
        select(CommunityMember).where(
            CommunityMember.user_id == current_user.id,
            CommunityMember.community_id == community.id,
        )
    )

    if membership is not None:
        raise ValueError("Already a member")

    membership = CommunityMember(
        user_id=current_user.id,
        community_id=community.id,
    )

    db.add(membership)
    db.commit()


def leave_community(
    db: Session,
    community_name: str,
    current_user: User,
):
    community = db.scalar(
        select(Community).where(
            Community.name == community_name
        )
    )

    if community is None:
        raise ValueError("Community not found")

    membership = db.scalar(
        select(CommunityMember).where(
            CommunityMember.user_id == current_user.id,
            CommunityMember.community_id == community.id,
        )
    )

    if membership is None:
        raise ValueError("Not a member")

    db.delete(membership)
    db.commit()


def get_feed(
    db: Session,
    current_user: User,
    page: int = 1,
    limit: int = 10,
):
    community_ids = db.scalars(
        select(CommunityMember.community_id).where(
            CommunityMember.user_id == current_user.id
        )
    ).all()

    if not community_ids:
        return []

    offset = (page - 1) * limit

    posts = db.scalars(
        select(Post)
        .where(Post.community_id.in_(community_ids))
        .options(
            selectinload(Post.author),
            selectinload(Post.community),
            selectinload(Post.votes),
        )
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
    ).all()

    return posts


def search(
    db: Session,
    query: str,
):
    pattern = f"%{query}%"

    users = db.scalars(
        select(User).where(
            or_(
                User.username.ilike(pattern),
                User.display_name.ilike(pattern),
            )
        )
    ).all()

    communities = db.scalars(
        select(Community).where(
            or_(
                Community.name.ilike(pattern),
                Community.title.ilike(pattern),
            )
        )
    ).all()

    posts = db.scalars(
        select(Post)
        .where(Post.title.ilike(pattern))
        .options(
            selectinload(Post.votes),
        )
    ).all()

    return {
        "users": users,
        "communities": communities,
        "posts": posts,
    }


