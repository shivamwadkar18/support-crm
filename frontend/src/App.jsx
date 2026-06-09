import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import CreateTicket from './pages/CreateTicket'
import TicketDetail from './pages/TicketDetail'

function App() {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateTicket />} />
          <Route path="/tickets/:ticketId" element={<TicketDetail />} />
          <Route 
            path="*" 
            element={
              <div className="text-center py-20">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-600">Page not found</p>
                <a href="/" className="inline-block mt-6 btn-primary">
                  Go Home
                </a>
              </div>
            } 
          />
        </Routes>
      </main>

      <footer className="mt-16 py-6 border-t border-gray-200 bg-white">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>
            Support CRM • Built with FastAPI + React • 
            <span className="text-blue-600 font-medium"> Datastraw Technologies</span>
          </p>
        </div>
      </footer>
    </div>
  )
}

export default App