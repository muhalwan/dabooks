import logging
import sys

def setup_logging():
    # Create logger
    logger = logging.getLogger('dabooks')
    logger.setLevel(logging.INFO)

    # Create console handler and set level to debug
    handler = logging.StreamHandler(sys.stdout)
    handler.setLevel(logging.INFO)

    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )

    # Add formatter to handler
    handler.setFormatter(formatter)

    # Add handler to logger
    logger.addHandler(handler)

    return logger