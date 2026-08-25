import re
from typing import List, Tuple, Optional
from langchain_core.documents import Document
from langchain_community.vectorstores import Chroma
from app.core.config import settings
from app.core.logging import logger
from app.rag.embeddings import EmbeddingManager


class VectorStoreManager:
    """
    Manages persistent vector storage using ChromaDB.
    Handles document indexing, hybrid semantic + keyword re-ranked search queries,
    and document vector deletion.
    """

    def __init__(self):
        """
        Initializes vector store manager configuration.
        Defers ChromaDB connection until first access.
        """
        self.embedding_manager = EmbeddingManager()
        self.persist_directory = str(settings.CHROMA_DB_DIR)
        self.collection_name = settings.CHROMA_COLLECTION_NAME
        self._vector_store: Optional[Chroma] = None

    @property
    def vector_store(self) -> Chroma:
        """
        Lazily initializes persistent Chroma vector store instance upon first query or document index request.
        """
        if self._vector_store is None:
            logger.info(f"Connecting to ChromaDB store at '{self.persist_directory}' [Collection: {self.collection_name}]...")
            embeddings = self.embedding_manager.get_embeddings()
            self._vector_store = Chroma(
                collection_name=self.collection_name,
                embedding_function=embeddings,
                persist_directory=self.persist_directory
            )
        return self._vector_store

    def add_documents(self, documents: List[Document], batch_size: int = 50) -> List[str]:
        """
        Stores chunked document vectors into persistent ChromaDB collection in batches.

        Args:
            documents (List[Document]): List of LangChain document chunks with page metadata.
            batch_size (int): Batch size for vector insertion (default: 50).

        Returns:
            List[str]: Unique document vector IDs inserted into ChromaDB.
        """
        if not documents:
            logger.warning("No documents provided for insertion into vector database.")
            return []

        logger.info(f"Indexing {len(documents)} document chunks into ChromaDB in batches of {batch_size}...")
        all_ids: List[str] = []
        try:
            for i in range(0, len(documents), batch_size):
                batch = documents[i : i + batch_size]
                batch_ids = self.vector_store.add_documents(batch)
                all_ids.extend(batch_ids)
            logger.info(f"Successfully stored {len(all_ids)} document vectors in ChromaDB.")
            return all_ids
        except Exception as e:
            logger.error(f"Error adding documents to ChromaDB: {str(e)}")
            raise RuntimeError(f"Vector store indexing failed: {str(e)}")

    def _expand_query_terms(self, query: str) -> str:
        """
        Generates HyDE-style hypothetical sentence expansions for improved vector embedding retrieval.
        """
        q = query.lower()
        expanded_parts = [query]

        if any(k in q for k in ['course', 'program', 'offered', 'branch', 'stream', 'specialization']):
            expanded_parts.append('Official academic programs offered undergraduate diploma postgraduate degree specializations B.Tech MBA Polytechic')
        if any(k in q for k in ['eligibility', 'eligible', 'qualification', 'marks', 'admission', 'criteria']):
            expanded_parts.append('Admission guidelines eligibility criteria minimum qualification aggregate percentage marks pass 10+2 SSLC THSLC')
        if any(k in q for k in ['polytechnic', 'diploma']):
            expanded_parts.append('3-year Diploma engineering courses Mechanical Civil Chemical Automobile Electrical SSLC THSLC Technical Education')
        if any(k in q for k in ['b.tech', 'btech', 'engineering']):
            expanded_parts.append('4-year B.Tech engineering programs Civil Mechanical Mechatronics Food Technology AICTE APJ Abdul Kalam Technological University')
        if any(k in q for k in ['fee', 'cost', 'tuition', 'charge', 'semester']):
            expanded_parts.append('Official fee structure tuition charges semester annual installment total payment guidelines')
        if any(k in q for k in ['placement', 'job', 'salary', 'package', 'recruiter', 'company', 'lpa']):
            expanded_parts.append('Placement achievements highest salary package INR LPA top recruiting companies campus recruitment')

        return " ".join(expanded_parts)

    def similarity_search(self, query: str, top_k: int = 5, document_name: Optional[str] = None) -> List[Tuple[Document, float]]:
        """
        Performs hybrid vector similarity search with HyDE query expansion, optional document scoping, and BM25 term relevance re-ranking.

        Args:
            query (str): User natural language question.
            top_k (int): Number of top matching document chunks to retrieve (default: 5).
            document_name (Optional[str]): Filename to scope vector search to a single document.

        Returns:
            List[Tuple[Document, float]]: Re-ranked document chunks with hybrid relevance scores.
        """
        expanded_query = self._expand_query_terms(query)
        logger.info(f"Executing hybrid similarity search for query: '{query}' [Doc filter: {document_name or 'All'}] (Expanded: '{expanded_query[:80]}...')")

        try:
            # Prepare optional metadata filter dictionary
            search_filter = {"source": document_name} if document_name else None

            # Retrieve initial candidate pool (k=top_k * 3) for 2-stage re-ranking
            initial_candidates = self.vector_store.similarity_search_with_score(
                expanded_query, k=top_k * 3, filter=search_filter
            )

            if not initial_candidates:
                # Fallback to raw query if expanded search returned empty
                initial_candidates = self.vector_store.similarity_search_with_score(
                    query, k=top_k, filter=search_filter
                )

            # Re-rank candidates using hybrid vector score + BM25 keyword matching
            stop_words = {'what', 'is', 'the', 'for', 'in', 'of', 'a', 'an', 'to', 'and', 'or', 'are', 'with', 'does', 'do', 'can', 'how', 'details', 'tell', 'me', 'about'}
            q_terms = [w.lower() for w in re.findall(r'\w+', query) if w.lower() not in stop_words]

            reranked_results = []
            for doc, distance_score in initial_candidates:
                content_lower = doc.page_content.lower()

                # Calculate term frequency keyword boost
                keyword_matches = sum(1 for term in q_terms if term in content_lower)
                exact_phrase_bonus = 3 if query.lower() in content_lower else 0

                # Combine vector distance (lower is better in cosine/L2) with keyword boost
                hybrid_score = distance_score - (keyword_matches * 0.15) - (exact_phrase_bonus * 0.25)
                reranked_results.append((doc, hybrid_score))

            # Sort by hybrid score ascending
            reranked_results.sort(key=lambda x: x[1])

            top_results = reranked_results[:top_k]
            logger.info(f"Retrieved and re-ranked {len(top_results)} relevant chunks from ChromaDB.")
            return top_results

        except Exception as e:
            logger.error(f"Error performing hybrid similarity search in ChromaDB: {str(e)}")
            raise RuntimeError(f"Vector search failed: {str(e)}")

    def delete_documents_by_filename(self, filename: str) -> None:
        """
        Deletes all vector embeddings associated with a specific PDF filename metadata.

        Args:
            filename (str): Name of the PDF file to remove from ChromaDB.
        """
        logger.info(f"Attempting vector deletion for file metadata: '{filename}'")
        try:
            collection = self.vector_store._collection
            matching_ids = collection.get(where={"source": filename})["ids"]
            
            if matching_ids:
                collection.delete(ids=matching_ids)
                logger.info(f"Deleted {len(matching_ids)} vectors for document '{filename}' from ChromaDB.")
            else:
                logger.info(f"No existing vectors found in ChromaDB for file '{filename}'.")
        except Exception as e:
            logger.error(f"Failed to delete vectors for document '{filename}': {str(e)}")
            raise RuntimeError(f"Failed vector deletion from ChromaDB: {str(e)}")
