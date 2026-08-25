import logging
import sys
from app.core.config import settings


def setup_logging() -> logging.Logger:
    """
    Configures and initializes structured application logging.

    Returns:
        logging.Logger: Configured logger instance for UniGuide AI.
    """
    logger = logging.getLogger("uniguide_ai")

    # Set appropriate logging level based on debug configuration
    log_level = logging.DEBUG if settings.DEBUG else logging.INFO
    logger.setLevel(log_level)

    # Attach stream handler if not already registered
    if not logger.handlers:
        handler = logging.StreamHandler(sys.stdout)
        handler.setLevel(log_level)

        # Standardized log format
        formatter = logging.Formatter(
            "[%(asctime)s] [%(levelname)s] [%(name)s] [%(filename)s:%(lineno)d] - %(message)s"
        )
        handler.setFormatter(formatter)
        logger.addHandler(handler)

    return logger


# Global logger instance ready for import across services
logger = setup_logging()
