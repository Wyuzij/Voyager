"""日志模块 - 同时输出到控制台和文件"""

import sys
import logging
from pathlib import Path
from logging.handlers import RotatingFileHandler

# 日志文件路径（容器里若不可写则落到 /tmp）
LOG_DIR = Path(__file__).parent.parent.parent / "logs"
try:
    LOG_DIR.mkdir(exist_ok=True)
except OSError:
    LOG_DIR = Path("/tmp/travel-logs")
    LOG_DIR.mkdir(exist_ok=True)
LOG_FILE = LOG_DIR / "app.log"

# 日志格式
CONSOLE_FMT = "%(asctime)s | %(levelname)-5s | %(message)s"
FILE_FMT = "%(asctime)s | %(levelname)-5s | %(name)s | %(message)s"
DATE_FMT = "%H:%M:%S"

def setup_logger(name: str = "travel") -> logging.Logger:
    logger = logging.getLogger(name)

    if logger.handlers:
        return logger

    logger.setLevel(logging.DEBUG)

    # 控制台 handler
    console = logging.StreamHandler(sys.stdout)
    console.setLevel(logging.INFO)
    console.setFormatter(logging.Formatter(CONSOLE_FMT, DATE_FMT))

    # 文件 handler (最多保留 5 个文件，每个最大 5MB)
    file_handler = RotatingFileHandler(
        LOG_FILE, maxBytes=5 * 1024 * 1024, backupCount=5, encoding="utf-8"
    )
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(FILE_FMT, DATE_FMT))

    logger.addHandler(console)
    logger.addHandler(file_handler)

    return logger


def get_logger(name: str = "travel") -> logging.Logger:
    return logging.getLogger(name)


# 全局 logger 实例
_log = None


def log() -> logging.Logger:
    global _log
    if _log is None:
        _log = setup_logger("travel")
    return _log
