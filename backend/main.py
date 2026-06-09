from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from database import engine, Base
from routers import tickets_router

# Import models so SQLAlchemy knows about them when creating tables
from models import Ticket, Note


# ============================================
# DATABASE INITIALIZATION
# ============================================

# Lifespan event - runs when the app starts and shuts down
@asynccontextmanager
async def lifespan(app: FastAPI):
    # STARTUP: Create all database tables
    print("Starting up... Creating database tables")
    Base.metadata.create_all(bind=engine)
    print("Database ready!")
    
    yield  # App runs here
    
    # SHUTDOWN
    print("Shutting down...")


# ============================================
# CREATE FASTAPI APP
# ============================================

app = FastAPI(
    title="Support CRM API",
    description="A simple customer support ticketing system",
    version="1.0.0",
    lifespan=lifespan
)


# ============================================
# CORS - Allow frontend to call this API
# ============================================

# CORS lets the browser allow requests from your frontend
# We allow all origins for development. In production, restrict this.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins (change in production)
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods (GET, POST, PUT, DELETE)
    allow_headers=["*"],  # Allow all headers
)


# ============================================
# INCLUDE ROUTERS
# ============================================

# All endpoints from tickets.py become available
app.include_router(tickets_router)


# ============================================
# ROOT ENDPOINT - Health check
# ============================================

@app.get("/")
def read_root():
    """Welcome endpoint - confirms the API is running"""
    return {
        "message": "Support CRM API is running!",
        "docs": "/docs",
        "endpoints": {
            "create_ticket": "POST /api/tickets",
            "list_tickets": "GET /api/tickets",
            "get_ticket": "GET /api/tickets/{ticket_id}",
            "update_ticket": "PUT /api/tickets/{ticket_id}",
            "delete_ticket": "DELETE /api/tickets/{ticket_id}"
        }
    }


@app.get("/health")
def health_check():
    """Health check endpoint - used by deployment services"""
    return {"status": "healthy"}

# ============================================
# RUN WITH UVICORN (for production)
# ============================================
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)