from datetime import datetime
from typing import Dict, Any, Optional


class DocumentModel:
    """
    MongoDB Document metadata class representing an uploaded university PDF document in MongoDB Atlas.
    Tracks metadata including file path, status, page count, and chunk count.
    """
    def __init__(
        self,
        filename: str,
        file_path: str,
        file_size: int,
        id: Optional[int] = None,
        upload_date: Optional[datetime] = None,
        is_ingested: bool = False,
        total_pages: int = 0,
        total_chunks: int = 0
    ):
        self.id = id
        self.filename = filename
        self.file_path = file_path
        self.file_size = file_size
        self.upload_date = upload_date or datetime.utcnow()
        self.is_ingested = is_ingested
        self.total_pages = total_pages
        self.total_chunks = total_chunks

    def to_dict(self) -> Dict[str, Any]:
        """
        Converts document model instance to a MongoDB serializable dictionary.
        """
        return {
            "id": self.id,
            "filename": self.filename,
            "file_path": self.file_path,
            "file_size": self.file_size,
            "upload_date": self.upload_date if isinstance(self.upload_date, datetime) else datetime.utcnow(),
            "is_ingested": self.is_ingested,
            "total_pages": self.total_pages,
            "total_chunks": self.total_chunks
        }

    @classmethod
    def from_dict(cls, data: Dict[str, Any]) -> "DocumentModel":
        """
        Instantiates DocumentModel from a MongoDB document dictionary.
        """
        return cls(
            id=data.get("id"),
            filename=data.get("filename", ""),
            file_path=data.get("file_path", ""),
            file_size=data.get("file_size", 0),
            upload_date=data.get("upload_date") if isinstance(data.get("upload_date"), datetime) else datetime.utcnow(),
            is_ingested=data.get("is_ingested", False),
            total_pages=data.get("total_pages", 0),
            total_chunks=data.get("total_chunks", 0)
        )
