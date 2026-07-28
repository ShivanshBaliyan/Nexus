from fastapi import (
    APIRouter,
    Depends,
    HTTPException,
    status,
    Response, 
    Query,
)
from app import services
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy import select
from sqlalchemy.orm import Session, selectinload
from app.core import get_db
from app.auth import get_current_user
from app.models import Community, User
from app.schemas import (
    UserCreate, 
    UserResponse, 
    UserLogin,
    Token,
    PostCreate,
    PostResponse,
    PostUpdate,
    CommentCreate, 
    CommentResponse,
    CommentUpdate,
    CommunityResponse,
    CommunityCreate,
    VoteCreate,
    UserProfileResponse,
)
from app.services import (
    register_user, 
    login_user,
    create_post,
    get_posts,
    get_post,
    update_post,
    delete_post,
    create_comment,
    get_comments,
    update_comment,
    delete_comment,
)
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


@router.post("/posts", response_model=PostResponse)
def create_new_post(
    post: PostCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return create_post(db, post, current_user)


@router.get("/posts", response_model=list[PostResponse])
def read_posts(
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    return get_posts(db, page, limit)


@router.get("/posts/{post_id}", response_model=PostResponse)
def read_post(
    post_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_post(db, post_id)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put("/posts/{post_id}", response_model=PostResponse)
def edit_post(
    post_id: int,
    post: PostUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_post(
            db,
            post_id,
            post,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )


@router.delete("/posts/{post_id}", status_code=204)
def remove_post(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        delete_post(
            db,
            post_id,
            current_user,
        )

        return Response(status_code=204)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )


@router.post(
    "/posts/{post_id}/comments",
    response_model=CommentResponse,
    status_code=201,
)
def add_comment(
    post_id: int,
    comment: CommentCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return create_comment(
            db,
            post_id,
            comment,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.get(
    "/posts/{post_id}/comments",
    response_model=list[CommentResponse],
)
def read_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    try:
        return get_comments(db, post_id)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )


@router.put(
    "/comments/{comment_id}",
    response_model=CommentResponse,
)
def edit_comment(
    comment_id: int,
    comment: CommentUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        return update_comment(
            db,
            comment_id,
            comment,
            current_user,
        )

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )


@router.delete(
    "/comments/{comment_id}",
    status_code=204,
)
def remove_comment(
    comment_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        delete_comment(
            db,
            comment_id,
            current_user,
        )

        return Response(status_code=204)

    except ValueError as e:
        raise HTTPException(
            status_code=404,
            detail=str(e),
        )

    except PermissionError as e:
        raise HTTPException(
            status_code=403,
            detail=str(e),
        )


@router.post(
    "/communities",
    response_model=CommunityResponse,
    status_code=status.HTTP_201_CREATED,
)
def create_community(
    community: CommunityCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    existing = db.scalar(
        select(Community).options(
            selectinload(Community.creator),
            selectinload(Community.memberships),
        )
    )

    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Community name already exists.",
        )

    new_community = Community(
        name=community.name,
        title=community.title,
        description=community.description,
        creator_id=current_user.id,
    )

    db.add(new_community)
    db.commit()
    db.refresh(new_community)

    return new_community


@router.get(
    "/communities",
    response_model=list[CommunityResponse],
)
def get_communities(
    db: Session = Depends(get_db),
):
    communities = db.scalars(
        select(Community).order_by(
            Community.created_at.desc()
        )
    ).all()

    return communities


@router.get(
    "/communities/{name}",
    response_model=CommunityResponse,
)
def get_community(
    name: str,
    db: Session = Depends(get_db),
):
    community = db.scalar(
        select(Community).options(
            selectinload(Community.creator),
            selectinload(Community.memberships),
        )
    )

    if community is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Community not found.",
        )

    return community


@router.get(
    "/communities/{name}/posts",
    response_model=list[PostResponse],
)
def get_community_posts(
    name: str,
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
    db: Session = Depends(get_db),
):
    try:
        return services.get_posts_by_community(
            db,
            name,
            page,
            limit,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post("/posts/{post_id}/vote")
def vote_post(
    post_id: int,
    vote: VoteCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        services.vote_post(
            db,
            post_id,
            vote,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return {
        "message": "Vote recorded."
    }


@router.delete("/posts/{post_id}/vote")
def remove_vote(
    post_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        services.remove_vote(
            db,
            post_id,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return {
        "message": "Vote removed."
    }


@router.get(
    "/users/{username}",
    response_model=UserProfileResponse,
)
def get_user_profile(
    username: str,
    db: Session = Depends(get_db),
):
    try:
        return services.get_user_profile(db, username)
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )


@router.post("/communities/{name}/join")
def join_community(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        services.join_community(
            db,
            name,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return {
        "message": "Joined community."
    }


@router.delete("/communities/{name}/join")
def leave_community(
    name: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    try:
        services.leave_community(
            db,
            name,
            current_user,
        )
    except ValueError as e:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=str(e),
        )

    return {
        "message": "Left community."
    }


@router.get(
    "/feed",
    response_model=list[PostResponse],
)
def get_feed(
    skip: int = 0,
    limit: int = 10,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user),
):
    return services.get_feed(
        db=db,
        current_user=current_user,
        skip=skip,
        limit=limit,
    )


