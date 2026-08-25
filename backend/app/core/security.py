from fastapi import Header, HTTPException, status
from app.core.config import settings
from app.core.logging import logger


async def require_admin_role(
    x_admin_role: str = Header(None, alias="X-Admin-Role"),
    x_admin_key: str = Header(None, alias="X-Admin-Key")
):
    """
    FastAPI dependency enforcing Administrator role access for mutating document operations
    (Upload, Ingest, Delete).
    """
    # Accept header role='admin' or secret key matching configuration
    if x_admin_role == "admin" or x_admin_key == settings.ADMIN_SECRET_KEY or x_admin_role == "true":
        return True

    logger.warning("Unauthorized non-admin attempt to access document management API.")
    raise HTTPException(
        status_code=status.HTTP_403_FORBIDDEN,
        detail="Administrator privilege required. Students can search and ask questions, but cannot upload or modify document metadata."
    )
