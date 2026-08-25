import time
from typing import Dict, Any, List, Optional
from pymongo import MongoClient
from pymongo.collection import Collection
from pymongo.database import Database
from app.core.config import settings
from app.core.logging import logger

_mongo_client: Optional[MongoClient] = None
_in_memory_docs: Dict[int, Dict[str, Any]] = {}
_doc_counter: int = 1000


def get_mongo_client() -> Optional[MongoClient]:
    """
    Returns singleton PyMongo client instance connected to MongoDB Atlas.
    """
    global _mongo_client
    if _mongo_client is None:
        try:
            logger.info(f"Connecting to MongoDB Atlas metadata database at {settings.MONGODB_URI[:25]}...")
            _mongo_client = MongoClient(
                settings.MONGODB_URI,
                serverSelectionTimeoutMS=3000,
                connectTimeoutMS=3000
            )
            # Ping database server
            _mongo_client.admin.command('ping')
            logger.info("Successfully connected to MongoDB Atlas!")
        except Exception as e:
            logger.warning(f"MongoDB Atlas connection unverified or offline: {str(e)}. Operating in hybrid metadata mode.")
            _mongo_client = None
    return _mongo_client


def get_db():
    """
    FastAPI dependency yielding MongoDB database reference.
    """
    client = get_mongo_client()
    if client is not None:
        yield client[settings.MONGODB_DB_NAME]
    else:
        yield None


def get_documents_collection() -> Optional[Collection]:
    """
    Returns the 'documents' collection from MongoDB Atlas if available.
    """
    client = get_mongo_client()
    if client is not None:
        return client[settings.MONGODB_DB_NAME]["documents"]
    return None


class MongoDBDocumentRepository:
    """
    Repository wrapper handling metadata CRUD operations on MongoDB Atlas
    with graceful fallback to in-memory cache when offline.
    """

    @staticmethod
    def _generate_id() -> int:
        global _doc_counter
        _doc_counter += 1
        return int(time.time() * 1000) % 100000000 + _doc_counter

    @classmethod
    def get_all(cls) -> List[Dict[str, Any]]:
        col = get_documents_collection()
        if col is not None:
            try:
                docs = list(col.find({}, {"_id": 0}))
                for d in docs:
                    if "id" not in d:
                        d["id"] = cls._generate_id()
                return docs
            except Exception as e:
                logger.error(f"MongoDB find failed: {str(e)}")
        return list(_in_memory_docs.values())

    @classmethod
    def get_by_id(cls, doc_id: int) -> Optional[Dict[str, Any]]:
        col = get_documents_collection()
        if col is not None:
            try:
                doc = col.find_one({"id": doc_id}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                logger.error(f"MongoDB find_one failed: {str(e)}")
        return _in_memory_docs.get(doc_id)

    @classmethod
    def get_by_filename(cls, filename: str) -> Optional[Dict[str, Any]]:
        col = get_documents_collection()
        if col is not None:
            try:
                doc = col.find_one({"filename": filename}, {"_id": 0})
                if doc:
                    return doc
            except Exception as e:
                logger.error(f"MongoDB find_one filename failed: {str(e)}")
        for doc in _in_memory_docs.values():
            if doc.get("filename") == filename:
                return doc
        return None

    @classmethod
    def save(cls, doc_data: Dict[str, Any]) -> Dict[str, Any]:
        if "id" not in doc_data or not doc_data["id"]:
            doc_data["id"] = cls._generate_id()

        col = get_documents_collection()
        if col is not None:
            try:
                col.update_one(
                    {"filename": doc_data["filename"]},
                    {"$set": doc_data},
                    upsert=True
                )
                logger.info(f"Saved document '{doc_data['filename']}' to MongoDB Atlas.")
            except Exception as e:
                logger.error(f"MongoDB save failed: {str(e)}")

        _in_memory_docs[doc_data["id"]] = doc_data
        return doc_data

    @classmethod
    def delete(cls, doc_id: int) -> bool:
        doc = cls.get_by_id(doc_id)
        if not doc:
            return False

        col = get_documents_collection()
        if col is not None:
            try:
                col.delete_one({"id": doc_id})
                col.delete_one({"filename": doc.get("filename")})
                logger.info(f"Deleted document ID {doc_id} from MongoDB Atlas.")
            except Exception as e:
                logger.error(f"MongoDB delete failed: {str(e)}")

        if doc_id in _in_memory_docs:
            del _in_memory_docs[doc_id]
        return True


def init_db():
    """
    Initializes MongoDB Atlas database indexes and verifies collection connectivity.
    """
    col = get_documents_collection()
    if col is not None:
        try:
            col.create_index("filename", unique=True)
            col.create_index("id", unique=True)
            logger.info("MongoDB Atlas indexes verified on 'documents' collection.")
        except Exception as e:
            logger.warning(f"MongoDB index creation skipped: {str(e)}")
