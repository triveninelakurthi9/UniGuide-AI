from pydantic import BaseModel, Field
from typing import List, Optional, Dict


class SourceCitation(BaseModel):
    """
    Citation metadata identifying the source document and page number.
    """
    document: str = Field(..., description="Filename of the source PDF document")
    page: int = Field(..., description="1-based page number where the info was extracted")


class ChatRequest(BaseModel):
    """
    Schema for user question request.
    """
    question: str = Field(..., min_length=2, description="Natural language question about university docs")
    document_name: Optional[str] = Field(None, description="Optional filename to scope RAG search to a specific PDF")
    conversation_history: Optional[List[Dict[str, str]]] = Field(default=[], description="Previous dialogue turns for multi-turn follow-up queries")


class ChatResponse(BaseModel):
    """
    Schema for RAG assistant response containing generated answer, page-level citations,
    pipeline execution latency, and confidence scores.
    """
    answer: str = Field(..., description="AI generated answer based strictly on retrieved context")
    sources: List[SourceCitation] = Field(default=[], description="Unique citations referencing source PDFs and pages")
    execution_time_ms: Optional[float] = Field(None, description="Execution time in milliseconds")
    confidence_score: Optional[float] = Field(None, description="RAG answer confidence score (0.0 to 1.0)")
    confidence_label: Optional[str] = Field(None, description="Confidence rating: High, Medium, or Low")
