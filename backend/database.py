from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL - defaults to SQLite for local development
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./support_crm.db")

# Render's PostgreSQL gives "postgres://" but SQLAlchemy needs "postgresql://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# SQLite needs special connect args, PostgreSQL doesn't
connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

# Create SQLAlchemy engine (works with both SQLite and PostgreSQL)
engine = create_engine(
    DATABASE_URL,
    connect_args=connect_args
)

# Each instance will be a database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all database models
Base = declarative_base()


# Dependency function - opens and closes DB session for each request
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()