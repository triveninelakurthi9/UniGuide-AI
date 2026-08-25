from pathlib import Path
from fastapi import APIRouter, HTTPException, status, Depends, BackgroundTasks
from app.core.database import MongoDBDocumentRepository
from app.core.security import require_admin_role
from app.core.logging import logger
from app.schemas.ingest import IngestRequest, IngestResponse
from app.services.pdf_service import PDFService
from app.rag.text_splitter import ChunkingService
from app.rag.vector_store import VectorStoreManager

router = APIRouter()


def perform_background_ingestion(document_id: int = None):
    """
    Executes document text extraction, chunking, and ChromaDB vector indexing asynchronously in background.
    """
    all_docs = MongoDBDocumentRepository.get_all()

    if document_id:
        target_docs = [d for d in all_docs if d.get("id") == document_id]
    else:
        target_docs = [d for d in all_docs if not d.get("is_ingested")]

    if not target_docs:
        logger.info("Background ingestion: No documents pending processing.")
        return

    chunker = ChunkingService()
    vector_store = VectorStoreManager()

    for doc in target_docs:
        file_path_str = doc.get("file_path", "")
        filename = doc.get("filename", "")
        doc_id = doc.get("id")

        if not file_path_str:
            continue

        file_path = Path(file_path_str)
        if not file_path.exists():
            logger.error(f"File path missing for document ID {doc_id}: '{file_path_str}'")
            continue

        try:
            logger.info(f"Starting background ingestion for '{filename}' (ID: {doc_id})...")

            # Step 1: Extract page text and metadata
            extracted_pages = PDFService.extract_text_from_pdf(file_path)

            if not extracted_pages:
                logger.warning(f"No text extracted from document '{filename}'. Skipping.")
                continue

            # Step 2: Create chunked documents
            chunk_documents = chunker.create_chunks(extracted_pages)

            # Step 3: Delete stale vectors if replacing/re-ingesting file
            vector_store.delete_documents_by_filename(filename)

            # Step 4: Index chunks into ChromaDB
            vector_store.add_documents(chunk_documents)

            # Step 5: Update MongoDB Atlas database record
            doc["is_ingested"] = True
            doc["total_pages"] = len(extracted_pages)
            doc["total_chunks"] = len(chunk_documents)
            MongoDBDocumentRepository.save(doc)

            logger.info(f"Finished background ingestion for '{filename}': {len(extracted_pages)} pages, {len(chunk_documents)} chunks indexed.")

        except Exception as e:
            logger.error(f"Background ingestion failed for document ID {doc_id}: {str(e)}")


@router.post(
    "/ingest",
    response_model=IngestResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_admin_role)]
)
async def ingest_documents(background_tasks: BackgroundTasks, payload: IngestRequest = IngestRequest()):
    """
    Triggers asynchronous background document ingestion into ChromaDB (Admin privilege required).
    Responds immediately to avoid gateway timeouts on large PDF files.
    """
    all_docs = MongoDBDocumentRepository.get_all()

    if payload.document_id:
        target_docs = [d for d in all_docs if d.get("id") == payload.document_id]
    else:
        target_docs = [d for d in all_docs if not d.get("is_ingested")]

    if not target_docs:
        logger.info("No documents found matching ingestion criteria.")
        return IngestResponse(
            message="No pending documents to ingest.",
            processed_documents=0,
            total_chunks=0
        )

    # Queue ingestion task in background to prevent 502 HTTP gateway timeouts on Render
    background_tasks.add_task(perform_background_ingestion, payload.document_id)

    return IngestResponse(
        message=f"Ingestion started in background for {len(target_docs)} document(s). Vector indexing in progress.",
        processed_documents=len(target_docs),
        total_chunks=0
    )
