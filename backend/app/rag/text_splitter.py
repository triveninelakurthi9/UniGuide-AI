from typing import List, Dict, Any
from langchain_core.documents import Document
try:
    from langchain_text_splitters import RecursiveCharacterTextSplitter
except ImportError:
    try:
        from langchain.text_splitter import RecursiveCharacterTextSplitter
    except ImportError:
        from langchain_community.text_splitter import RecursiveCharacterTextSplitter
from app.core.config import settings
from app.core.logging import logger


class ChunkingService:
    """
    Service for splitting page-extracted PDF text into contextual chunks
    using LangChain's RecursiveCharacterTextSplitter while maintaining metadata.
    """

    def __init__(self, chunk_size: int = settings.CHUNK_SIZE, chunk_overlap: int = settings.CHUNK_OVERLAP):
        """
        Initializes the RecursiveCharacterTextSplitter with specified chunk dimensions.

        Args:
            chunk_size (int): Maximum character length of each chunk (default: 1000).
            chunk_overlap (int): Character overlap between adjacent chunks (default: 200).
        """
        self.chunk_size = chunk_size
        self.chunk_overlap = chunk_overlap
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=self.chunk_size,
            chunk_overlap=self.chunk_overlap,
            length_function=len,
            separators=["\n\n", "\n", ". ", " ", ""]
        )

    def create_chunks(self, pages_data: List[Dict[str, Any]]) -> List[Document]:
        """
        Takes raw page text dictionaries and generates chunked LangChain Document objects,
        preserving essential page-level citations (source, page).

        Args:
            pages_data (List[Dict[str, Any]]): Extracted page content and metadata.

        Returns:
            List[Document]: Chunks converted into LangChain Document format with page metadata.
        """
        documents: List[Document] = []

        for page in pages_data:
            page_text = page["content"]
            metadata = {
                "source": page["source"],
                "page": page["page"]
            }

            # Split individual page text into smaller chunks
            chunks = self.text_splitter.split_text(page_text)

            for idx, chunk_str in enumerate(chunks):
                chunk_metadata = metadata.copy()
                chunk_metadata["chunk_index"] = idx
                
                doc = Document(
                    page_content=chunk_str.strip(),
                    metadata=chunk_metadata
                )
                documents.append(doc)

        logger.info(f"Split {len(pages_data)} pages into {len(documents)} text chunks.")
        return documents
