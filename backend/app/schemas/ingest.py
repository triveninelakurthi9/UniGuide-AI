from typing import Optional
from pydantic import BaseModel, Field


class IngestRequest(BaseModel):
    """
    Schema for document ingestion request.
    If document_id is omitted, ingests all uploaded un-ingested PDFs.
    """
    document_id: Optional[int] = Field(None, description="Optional specific document ID to ingest")


class IngestResponse(BaseModel):
    """
    Schema for response after PDF text extraction, chunking, and embedding storage.
    """
    message: str = Field(..., description="Summary status message of ingestion process")
    processed_documents: int = Field(..., description="Number of documents successfully ingested")
    total_chunks: int = Field(..., description="Total vector chunks generated and stored in ChromaDB")
