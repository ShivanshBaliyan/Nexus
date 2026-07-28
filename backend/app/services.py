from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.models import User, Post, Comment
from app.schemas import (
    UserCreate, 
    UserLogin, 
    PostCreate, 
    PostUpdate,
    CommentCreate,
    CommentUpdate,
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


def create_post(
    db: Session,
    post_data: PostCreate,
    current_user: User,
) -> Post:
    post = Post(
        title=post_data.title,
        content=post_data.content,
        author_id=current_user.id,
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
        .order_by(Post.created_at.desc())
        .offset(offset)
        .limit(limit)
        .all()
    )


def get_post(
    db: Session,
    post_id: int,
) -> Post:
    post = db.query(Post).filter(Post.id == post_id).first()

    if post is None:
        raise ValueError("Post not found")

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

    return (
        db.query(Comment)
        .filter(Comment.post_id == post_id)
        .order_by(Comment.created_at.asc())
        .all()
    )


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