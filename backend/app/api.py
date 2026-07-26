from fastapi import APIRouter, Depends, HTTPException
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from app.core import get_db
from app.schemas import (
    UserCreate, 
    UserResponse, 
    UserLogin, 
    Token,
)
from app.services import register_user, login_user
from app.auth import get_current_user
from app.models import User

router = APIRouter()

@router.post("/auth/register", response_model=UserResponse, status_code=201)
def register(
    user_data: UserCreate,
    db: Session = Depends(get_db),
):
    try:
        return register_user(db, user_data)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))


@router.post("/auth/login", response_model=Token)
def login(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db),
):
    try:
        token = login_user(db, form_data)

        return {
            "access_token": token,
            "token_type": "bearer",
        }

    except ValueError as e:
        raise HTTPException(
            status_code=401,
            detail=str(e),
        )


@router.get("/users/me", response_model=UserResponse)
def get_me(
    current_user: User = Depends(get_current_user),
):
    return current_user