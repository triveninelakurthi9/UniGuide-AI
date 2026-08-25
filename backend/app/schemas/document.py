from datetime import datetime
from pydantic import BaseModel, Field
from typing import List


class DocumentResponse(BaseModel):
    """
    Schema for document metadata returned in API list and upload responses.
    """
    id: int = Field(..., description="Unique database ID of the document")
    filename: str = Field(..., description="Original filename of the PDF")
    file_size: int = Field(..., description="Size of the file in bytes")
    upload_date: datetime = Field(..., description="Timestamp when the file was uploaded")
    is_ingested: bool = Field(..., description="Whether the document vector embeddings are indexed")
    total_pages: int = Field(..., description="Total pages extracted from the PDF")
    total_chunks: int = Field(..., description="Total vector chunks generated")

    class Config:
        from_attributes = True


class DocumentListResponse(BaseModel):
    """
    Schema for listing all uploaded university documents.
    """
    documents: List[DocumentResponse] = Field(..., description="List of document metadata objects")
    total_count: int = Field(..., description="Total count of documents registered")


class DeleteDocumentResponse(BaseModel):
    """
    Schema for response after deleting a document and its vectors.
    """
    message: str = Field(..., description="Status message detailing deletion outcome")
    document_id: int = Field(..., description="ID of deleted document")
