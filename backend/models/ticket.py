from sqlalchemy import Column, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
import random
import string
from database import Base


# Helper function to generate unique ticket IDs like TKT-001, TKT-A1B2
def generate_ticket_id():
    # Generates a random 4 character alphanumeric string
    random_part = ''.join(random.choices(string.ascii_uppercase + string.digits, k=4))
    return f"TKT-{random_part}"


# This class maps directly to the "tickets" table in the database
class Ticket(Base):
    __tablename__ = "tickets"

    # Primary key - auto increments
    id = Column(Integer, primary_key=True, index=True)

    # Unique ticket ID like TKT-001
    ticket_id = Column(String, unique=True, index=True, default=generate_ticket_id)

    # Customer information
    customer_name = Column(String(100), nullable=False)
    customer_email = Column(String(150), nullable=False)

    # Ticket information
    subject = Column(String(200), nullable=False)
    description = Column(Text, nullable=False)

    # Status can only be: Open, In Progress, Closed
    status = Column(String(50), nullable=False, default="Open")

    # Timestamps - set automatically
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc))

    # Relationship to notes - one ticket can have many notes
    notes = relationship("Note", back_populates="ticket", cascade="all, delete-orphan")

    # String representation for debugging
    def __repr__(self):
        return f"<Ticket {self.ticket_id} - {self.subject} [{self.status}]>"