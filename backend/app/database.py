import os
import logging
from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

logger = logging.getLogger("inovex.database")

# Retrieve and sanitize DATABASE_URL
raw_db_url = (os.getenv("DATABASE_URL") or "").strip()
if not raw_db_url:
    DATABASE_URL = "sqlite:///./inovex.db"
else:
    DATABASE_URL = raw_db_url

# Render provides PostgreSQL URLs starting with 'postgres://' which SQLAlchemy 1.4+ does not support
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

logger.info(f"Database dialect: {'sqlite' if DATABASE_URL.startswith('sqlite') else 'postgresql/other'}")

# Engine configuration with connection pooling and health checks
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL,
        connect_args={"check_same_thread": False},
        pool_pre_ping=True
    )
else:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        pool_recycle=300
    )

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
