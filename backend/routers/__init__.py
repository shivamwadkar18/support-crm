# This file makes the "routers" folder a Python package
# Import the router so we can use it cleanly in main.py

from routers.tickets import router as tickets_router

__all__ = ["tickets_router"]