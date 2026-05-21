"""
FinSmart — news-events-service
"""
from fastapi import FastAPI
from app.routers import router

app = FastAPI(title="FinSmart news-events-service", version="0.1.0")
app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "news-events-service"}
