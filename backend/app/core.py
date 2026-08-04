import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.orm import Session

load_dotenv()

DATABASE_URL = (
    f"postgresql+psycopg://"
    f"{os.getenv('DATABASE_USER')}:"
    f"{os.getenv('DATABASE_PASSWORD')}@"
    f"{os.getenv('DATABASE_HOST')}:"
    f"{os.getenv('DATABASE_PORT')}/"
    f"{os.getenv('DATABASE_NAME')}"
)

SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = os.getenv("ALGORITHM")
ACCESS_TOKEN_EXPIRE_MINUTES = int(
    os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
)

engine = create_engine(
    DATABASE_URL,
    echo=True,
)

SessionLocal = sessionmaker(
    bind=engine,
    autoflush=False,
    autocommit=False,
)


def get_db():
    db: Session = SessionLocal()
    try:
        yield db
    finally:
        db.close()

