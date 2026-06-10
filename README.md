# Support CRM System

A full-stack customer support ticketing system built with FastAPI, React, and SQLite.


## 🌐 Live Demo

🌐 App:        https://crm.aiservices.codes
🔌 API:        https://api.crm.aiservices.codes
📚 Docs:       https://api.crm.aiservices.codes/docs

## ✨ Features

- ✅ Create support tickets with customer info
- ✅ List all tickets with clean card-based UI
- ✅ Real-time search (by name, email, ID, subject, description)
- ✅ Filter by status (Open, In Progress, Closed)
- ✅ Detailed ticket view with full info
- ✅ Update ticket status
- ✅ Add notes/comments to tickets (timeline view)
- ✅ Delete tickets
- ✅ Auto-generated unique ticket IDs (TKT-XXXX format)
- ✅ Mobile responsive design
- ✅ Loading states, error handling, empty states

## 🛠️ Tech Stack

### Backend
- **Framework:** FastAPI (Python)
- **Database:** SQLite with SQLAlchemy ORM
- **Validation:** Pydantic
- **Server:** Uvicorn

### Frontend
- **Framework:** React 18 (Vite)
- **Styling:** Tailwind CSS
- **Routing:** React Router v6
- **HTTP Client:** Axios

### Deployment
- **Backend:** Render.com
- **Frontend:** Vercel
- **Database:** SQLite (persistent disk)

## 📂 Project Structure

\`\`\`
support-crm/
├── backend/
│   ├── models/          # SQLAlchemy database models
│   ├── routers/         # API route handlers
│   ├── database.py      # DB connection setup
│   ├── main.py          # FastAPI app entry point
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/  # Reusable React components
│   │   ├── pages/       # Page components
│   │   ├── api.js       # API client
│   │   ├── App.jsx      # Routes
│   │   └── main.jsx     # Entry point
│   └── package.json
└── README.md
\`\`\`

## 🚀 Local Setup

### Prerequisites
- Python 3.10+
- Node.js 18+

### Backend Setup

\`\`\`bash
cd backend
python -m venv venv

# Windows
venv\\Scripts\\activate

# Mac/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn main:app --reload
\`\`\`

Backend runs at: `http://localhost:8000`  
API Docs: `http://localhost:8000/docs`

### Frontend Setup

\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

Frontend runs at: `http://localhost:5173`

## 🔌 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tickets` | Create a new ticket |
| GET | `/api/tickets` | List all tickets (supports `?status=` and `?search=`) |
| GET | `/api/tickets/{ticket_id}` | Get a specific ticket with notes |
| PUT | `/api/tickets/{ticket_id}` | Update status or add note |
| DELETE | `/api/tickets/{ticket_id}` | Delete a ticket |

## 💾 Database Schema

### `tickets` table
- id (PK)
- ticket_id (unique, e.g., TKT-A1B2)
- customer_name
- customer_email
- subject
- description
- status (Open / In Progress / Closed)
- created_at
- updated_at

### `notes` table
- id (PK)
- ticket_id (FK → tickets)
- note_text
- author
- created_at

## 🌐 Environment Variables

### Backend (`.env`)
\`\`\`
DATABASE_URL=sqlite:///./support_crm.db
APP_ENV=development
\`\`\`

### Frontend (`.env`)
\`\`\`
VITE_API_URL=http://localhost:8000
\`\`\`

## 👨‍💻 Author

**Shivam Wadkar**  


## 📝 License

MIT
