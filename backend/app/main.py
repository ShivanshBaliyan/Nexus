from fastapi import FastAPI
from sqlalchemy import text
from app.core import engine
from app.api import router

app = FastAPI(title="Nexus API")
app.include_router(router)


@app.get("/")
def root():
    return {"message": "Welcome to Nexus"}


@app.get("/health")
def health():
    with engine.connect() as connection:
        connection.execute(text("SELECT 1"))

    return {
        "status": "healthy",
        "database": "connected",
    }