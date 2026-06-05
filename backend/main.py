from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.db.init_db import init_db
from app.routers import auth, recommendation, compatibility, diagnostics

@asynccontextmanager
async def lifespan(app: FastAPI):
    await init_db()
    yield

app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://pc-smartbuilder.vercel.app"
    ],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(recommendation.router)
app.include_router(compatibility.router)
app.include_router(diagnostics.router)

@app.get("/")
async def root():
    return {"message": "PC SmartBuilder API Online"}