from fastapi import APIRouter
from app.api.v1.endpoints import upload, ingest, chat, documents, predictor

api_router = APIRouter()

# Register core v1 API routes
api_router.include_router(upload.router, tags=["Upload"])
api_router.include_router(ingest.router, tags=["Ingest"])
api_router.include_router(chat.router, tags=["Chat"])
api_router.include_router(documents.router, tags=["Documents"])
api_router.include_router(predictor.router, prefix="/predict", tags=["JEE Predictor"])

