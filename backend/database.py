from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

# Get database URL from environment variable
# Falls back to sqlite if not set
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./support_crm.db")

# Create the SQLAlchemy engine
# connect_args is needed only for SQLite
engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}  # Only needed for SQLite
)

# Each instance of SessionLocal will be a database session
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all our database models
Base = declarative_base()


# Dependency function - used in every API route that needs DB access
# It opens a session, gives it to the route, then closes it when done
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()