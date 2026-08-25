from pathlib import Path
from fastapi import APIRouter, HTTPException, status, Depends
from app.core.config import settings
from app.core.database import MongoDBDocumentRepository
from app.core.security import require_admin_role
from app.core.logging import logger
from app.schemas.document import DocumentListResponse, DocumentResponse, DeleteDocumentResponse
from app.rag.vector_store import VectorStoreManager
from app.rag.pipeline import RAGPipeline

router = APIRouter()
rag_pipeline = RAGPipeline()


@router.get("/documents/stats", status_code=status.HTTP_200_OK)
async def get_document_stats():
    """
    Returns aggregate stats on uploaded documents, total indexed vector chunks, and system configuration from MongoDB Atlas.
    """
    documents = MongoDBDocumentRepository.get_all()
    total_docs = len(documents)
    total_ingested = sum(1 for d in documents if d.get("is_ingested"))
    total_pages = sum(d.get("total_pages", 0) or 0 for d in documents)
    total_chunks = sum(d.get("total_chunks", 0) or 0 for d in documents)

    return {
        "total_documents": total_docs,
        "total_ingested": total_ingested,
        "total_pages": total_pages,
        "total_chunks": total_chunks,
        "embedding_model": settings.EMBEDDING_MODEL_NAME,
        "llm_model": settings.LLM_MODEL_NAME,
        "metadata_database": "MongoDB Atlas",
        "status": "operational"
    }


@router.get("/documents/{document_id}/faqs", status_code=status.HTTP_200_OK)
async def get_document_faqs(document_id: int):
    """
    Auto-generates structured FAQs (questions and verified answers) extracted from an ingested PDF document.
    """
    doc = MongoDBDocumentRepository.get_by_id(document_id)
    if not doc:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found."
        )

    try:
        faq_topics = [
            "What programs and courses are offered?",
            "What is the admission eligibility criteria?",
            "What is the fee structure?",
            "What placement and career support is available?",
            "What infrastructure and campus facilities exist?"
        ]

        faqs = []
        for q in faq_topics:
            res = rag_pipeline.answer_question(question=q, top_k=3, document_name=doc.get("filename"))
            if res.answer and "couldn't find" not in res.answer.lower():
                faqs.append({
                    "question": q,
                    "answer": res.answer,
                    "sources": res.sources
                })

        return {
            "document_id": document_id,
            "filename": doc.get("filename"),
            "faqs": faqs
        }
    except Exception as e:
        logger.error(f"Failed to generate FAQs for document {document_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to generate FAQs: {str(e)}"
        )


@router.get("/documents", response_model=DocumentListResponse, status_code=status.HTTP_200_OK)
async def list_documents():
    """
    Lists all uploaded university PDF documents and their ingestion metadata from MongoDB Atlas.
    """
    documents = MongoDBDocumentRepository.get_all()
    doc_responses = [DocumentResponse.model_validate(doc) for doc in documents]
    return DocumentListResponse(documents=doc_responses, total_count=len(doc_responses))


@router.delete(
    "/documents/{document_id}",
    response_model=DeleteDocumentResponse,
    status_code=status.HTTP_200_OK,
    dependencies=[Depends(require_admin_role)]
)
async def delete_document(document_id: int):
    """
    Deletes a university PDF document from disk storage, removes vector embeddings
    from ChromaDB, and removes document metadata from MongoDB Atlas database (Admin privilege required).
    """
    doc = MongoDBDocumentRepository.get_by_id(document_id)

    if not doc:
        logger.warning(f"Deletion requested for non-existent document ID: {document_id}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Document with ID {document_id} not found."
        )

    try:
        filename = doc.get("filename", "")
        file_path_str = doc.get("file_path", "")

        # Step 1: Remove vectors from ChromaDB
        if filename:
            vector_store = VectorStoreManager()
            vector_store.delete_documents_by_filename(filename)

        # Step 2: Delete physical file from uploads folder
        if file_path_str:
            file_path = Path(file_path_str)
            if file_path.exists():
                file_path.unlink()
                logger.info(f"Deleted physical file: '{file_path}'")

        # Step 3: Remove record from MongoDB Atlas
        MongoDBDocumentRepository.delete(document_id)

        logger.info(f"Successfully deleted document ID {document_id} ('{filename}').")
        return DeleteDocumentResponse(
            message=f"Document '{filename}' and its associated vector embeddings were deleted.",
            document_id=document_id
        )

    except Exception as e:
        logger.error(f"Failed to delete document ID {document_id}: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )
