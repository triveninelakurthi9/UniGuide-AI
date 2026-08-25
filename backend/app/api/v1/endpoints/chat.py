from fastapi import APIRouter, HTTPException, status
from app.schemas.chat import ChatRequest, ChatResponse
from app.rag.pipeline import RAGPipeline
from app.core.logging import logger

router = APIRouter()

# Instantiate single RAG pipeline instance
rag_pipeline = RAGPipeline()


@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_docs(payload: ChatRequest):
    """
    Accepts a user natural language question, performs vector similarity search in ChromaDB,
    constructs a strict anti-hallucination prompt, calls Gemini LLM, and returns
    the generated answer along with page-level PDF citations.
    """
    if not payload.question.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question text cannot be blank."
        )

    try:
        logger.info(f"Received chat question: '{payload.question}' (Doc filter: {payload.document_name}, History: {len(payload.conversation_history or [])} turns)")
        response = rag_pipeline.answer_question(
            question=payload.question,
            document_name=payload.document_name,
            conversation_history=payload.conversation_history
        )
        return response
    except Exception as e:
        logger.error(f"Error processing chat question: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Chat pipeline error: {str(e)}"
        )
