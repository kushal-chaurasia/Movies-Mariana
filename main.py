from pathlib import Path
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.routes import route


SERVER_PREFIX = "/api"

app = FastAPI(
    title="DUMMY_PROJECT",
    version="1.0.0",
    openapi_url=f"{SERVER_PREFIX}/openapi.json",
    docs_url=f"{SERVER_PREFIX}/docs",
    redoc_url=f"{SERVER_PREFIX}/redoc",
    debug=True,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(route, prefix=SERVER_PREFIX, tags=["api"])
