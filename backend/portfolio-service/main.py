"""
FinSmart — portfolio-service
"""
from fastapi import FastAPI
from app.routers import router

app = FastAPI(title="FinSmart portfolio-service", version="0.1.0")
app.include_router(router, prefix="/api/v1")


@app.get("/health")
async def health():
    return {"status": "ok", "service": "portfolio-service"}
