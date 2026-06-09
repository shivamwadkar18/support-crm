# This file makes the "models" folder a Python package
# It also lets us import models easily from other files

from models.ticket import Ticket
from models.note import Note

# Now in other files we can do:
# from models import Ticket, Note
# instead of:
# from models.ticket import Ticket
# from models.note import Note

__all__ = ["Ticket", "Note"]