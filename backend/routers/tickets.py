from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

from database import get_db
from models import Ticket, Note


# Create a router - all routes here will be prefixed with /api/tickets
router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


# ============================================
# PYDANTIC SCHEMAS (Request/Response models)
# ============================================

# Schema for creating a new ticket (request body)
class TicketCreate(BaseModel):
    customer_name: str
    customer_email: EmailStr
    subject: str
    description: str


# Schema for updating a ticket (request body)
class TicketUpdate(BaseModel):
    status: Optional[str] = None
    note_text: Optional[str] = None


# Schema for a single note (response)
class NoteResponse(BaseModel):
    id: int
    note_text: str
    author: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True


# Schema for listing tickets (summary view)
class TicketListResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    status: str
    created_at: datetime

    class Config:
        from_attributes = True


# Schema for ticket detail view (full info)
class TicketDetailResponse(BaseModel):
    ticket_id: str
    customer_name: str
    customer_email: str
    subject: str
    description: str
    status: str
    created_at: datetime
    updated_at: datetime
    notes: List[NoteResponse] = []

    class Config:
        from_attributes = True


# ============================================
# API ENDPOINTS
# ============================================

# 1. CREATE TICKET - POST /api/tickets
@router.post("", status_code=201)
def create_ticket(ticket_data: TicketCreate, db: Session = Depends(get_db)):
    """Create a new support ticket"""
    
    # Create new Ticket object from the request data
    new_ticket = Ticket(
        customer_name=ticket_data.customer_name,
        customer_email=ticket_data.customer_email,
        subject=ticket_data.subject,
        description=ticket_data.description,
        status="Open"  # All new tickets start as Open
    )
    
    # Add to database and save
    db.add(new_ticket)
    db.commit()
    db.refresh(new_ticket)  # Reload from DB to get auto generated ticket_id
    
    return {
        "ticket_id": new_ticket.ticket_id,
        "created_at": new_ticket.created_at,
        "message": "Ticket created successfully"
    }


# 2. LIST ALL TICKETS - GET /api/tickets
@router.get("", response_model=List[TicketListResponse])
def list_tickets(
    status: Optional[str] = Query(None, description="Filter by status: Open, In Progress, Closed"),
    search: Optional[str] = Query(None, description="Search by name, email, ticket ID, or description"),
    db: Session = Depends(get_db)
):
    """List all tickets with optional filtering and search"""
    
    # Start with base query
    query = db.query(Ticket)
    
    # Apply status filter if provided
    if status:
        query = query.filter(Ticket.status == status)
    
    # Apply search filter - searches across multiple fields
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Ticket.customer_name.ilike(search_pattern),
                Ticket.customer_email.ilike(search_pattern),
                Ticket.ticket_id.ilike(search_pattern),
                Ticket.subject.ilike(search_pattern),
                Ticket.description.ilike(search_pattern)
            )
        )
    
    # Order by newest first
    tickets = query.order_by(Ticket.created_at.desc()).all()
    
    return tickets


# 3. GET SINGLE TICKET - GET /api/tickets/{ticket_id}
@router.get("/{ticket_id}", response_model=TicketDetailResponse)
def get_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Get full details of a single ticket including all notes"""
    
    # Find the ticket
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    # If not found, return 404
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    
    return ticket


# 4. UPDATE TICKET - PUT /api/tickets/{ticket_id}
@router.put("/{ticket_id}")
def update_ticket(
    ticket_id: str,
    update_data: TicketUpdate,
    db: Session = Depends(get_db)
):
    """Update ticket status and/or add a new note"""
    
    # Find the ticket
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    
    # Update status if provided
    if update_data.status:
        # Validate the status value
        valid_statuses = ["Open", "In Progress", "Closed"]
        if update_data.status not in valid_statuses:
            raise HTTPException(
                status_code=400,
                detail=f"Invalid status. Must be one of: {valid_statuses}"
            )
        ticket.status = update_data.status
    
    # Add a new note if provided
    if update_data.note_text and update_data.note_text.strip():
        new_note = Note(
            ticket_id=ticket.ticket_id,
            note_text=update_data.note_text.strip()
        )
        db.add(new_note)
    
    # Save changes
    db.commit()
    db.refresh(ticket)
    
    return {
        "success": True,
        "updated_at": ticket.updated_at,
        "message": "Ticket updated successfully"
    }


# 5. DELETE TICKET - DELETE /api/tickets/{ticket_id} (BONUS)
@router.delete("/{ticket_id}")
def delete_ticket(ticket_id: str, db: Session = Depends(get_db)):
    """Delete a ticket and all its notes"""
    
    ticket = db.query(Ticket).filter(Ticket.ticket_id == ticket_id).first()
    
    if not ticket:
        raise HTTPException(status_code=404, detail=f"Ticket {ticket_id} not found")
    
    db.delete(ticket)
    db.commit()
    
    return {"success": True, "message": f"Ticket {ticket_id} deleted"}