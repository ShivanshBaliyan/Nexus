from sqlalchemy.orm import Session
from fastapi.security import OAuth2PasswordRequestForm
from app.models import User
from app.schemas import UserCreate, UserLogin
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