import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, status, Depends
from app.core.config import settings
from app.core.database import MongoDBDocumentRepository
from app.core.security import require_admin_role
from app.core.logging import logger
from app.models.document import DocumentModel
from app.schemas.document import DocumentResponse

router = APIRouter()


@router.post(
    "/upload",
    response_model=DocumentResponse,
    status_code=status.HTTP_201_CREATED,
    dependencies=[Depends(require_admin_role)]
)
async def upload_pdf(file: UploadFile = File(...)):
    """
    Uploads a university PDF document, validates format, stores file in uploads directory,
    and registers document metadata in MongoDB Atlas database (Admin privilege required).
    """
    if not file.filename:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Filename cannot be empty."
        )

    # Validate PDF file extension
    if not file.filename.lower().endswith(".pdf"):
        logger.warning(f"Rejected non-PDF upload attempt: '{file.filename}'")
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only PDF files are supported."
        )

    target_path = settings.UPLOAD_DIR / file.filename

    # Save uploaded file to disk
    try:
        with open(target_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        file_size = target_path.stat().st_size
        logger.info(f"File uploaded successfully: '{file.filename}' ({file_size} bytes)")
    except Exception as e:
        logger.error(f"Failed to save uploaded file '{file.filename}': {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save file: {str(e)}"
        )

    # Check if document already exists in MongoDB Atlas metadata collection
    existing_doc = MongoDBDocumentRepository.get_by_filename(file.filename)
    if existing_doc:
        existing_doc["file_size"] = file_size
        existing_doc["is_ingested"] = False
        saved_doc = MongoDBDocumentRepository.save(existing_doc)
        logger.info(f"Updated existing document record for '{file.filename}' in MongoDB Atlas.")
        return DocumentResponse.model_validate(saved_doc)

    # Create new document record in MongoDB Atlas
    new_doc_model = DocumentModel(
        filename=file.filename,
        file_path=str(target_path),
        file_size=file_size,
        is_ingested=False,
        total_pages=0,
        total_chunks=0
    )
    saved_doc = MongoDBDocumentRepository.save(new_doc_model.to_dict())

    logger.info(f"Registered new document ID {saved_doc['id']} in MongoDB Atlas database.")
    return DocumentResponse.model_validate(saved_doc)
