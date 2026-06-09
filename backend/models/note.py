from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime, timezone
from database import Base


# This class maps directly to the "notes" table in the database
class Note(Base):
    __tablename__ = "notes"

    # Primary key - auto increments
    id = Column(Integer, primary_key=True, index=True)

    # Foreign key - links each note to one ticket
    # Uses ticket_id (e.g. TKT-A1B2) not the numeric id
    ticket_id = Column(String, ForeignKey("tickets.ticket_id"), nullable=False)

    # The actual note text content
    note_text = Column(Text, nullable=False)

    # Optional author name - who added the note (default: Support Agent)
    author = Column(String(100), nullable=True, default="Support Agent")

    # Timestamp - automatically set when note is created
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationship back to ticket - many notes belong to one ticket
    ticket = relationship("Ticket", back_populates="notes")

    # String representation for debugging
    def __repr__(self):
        return f"<Note {self.id} for {self.ticket_id}>"