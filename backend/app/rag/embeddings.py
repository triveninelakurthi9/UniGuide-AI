from langchain_huggingface import HuggingFaceEmbeddings
from app.core.config import settings
from app.core.logging import logger


class EmbeddingManager:
    """
    Lazy-loading singleton manager for sentence transformer embeddings.
    Defers downloading and initializing transformer weights until the first vector query or indexing action.
    """

    _instance = None
    _embeddings = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(EmbeddingManager, cls).__new__(cls)
        return cls._instance

    def _init_embeddings(self):
        """
        Loads HuggingFace embeddings model on demand.
        """
        if self._embeddings is not None:
            return

        model_name = settings.EMBEDDING_MODEL_NAME or "sentence-transformers/all-MiniLM-L6-v2"
        logger.info(f"Loading embedding model: '{model_name}'...")
        try:
            model_kwargs = {"device": "cpu"}
            encode_kwargs = {
                "normalize_embeddings": True  # Normalize vectors for cosine similarity
            }
            
            self._embeddings = HuggingFaceEmbeddings(
                model_name=model_name,
                model_kwargs=model_kwargs,
                encode_kwargs=encode_kwargs
            )
            logger.info(f"Successfully loaded embedding model '{model_name}'.")
        except Exception as e:
            logger.error(f"Failed to load embedding model '{model_name}': {str(e)}")
            raise RuntimeError(f"Embedding model initialization failed: {str(e)}")

    def get_embeddings(self) -> HuggingFaceEmbeddings:
        """
        Returns the HuggingFaceEmbeddings instance, initializing it lazily on first access.
        """
        if self._embeddings is None:
            self._init_embeddings()
        return self._embeddings
