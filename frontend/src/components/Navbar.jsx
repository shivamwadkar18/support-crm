import { Link, useLocation } from 'react-router-dom'

// ============================================
// NAVBAR COMPONENT
// ============================================
// Top navigation bar - appears on every page
// Shows app logo, navigation links, and a "Create Ticket" button

function Navbar() {
  // Get current URL path to highlight active link
  const location = useLocation()
  const isActive = (path) => location.pathname === path

  return (
    <nav className="bg-white border-b border-gray-200 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          
          {/* ========== LOGO / BRAND ========== */}
          <Link to="/" className="flex items-center gap-2 group">
            {/* Logo icon - a simple ticket SVG */}
            <div className="bg-blue-600 text-white p-2 rounded-lg group-hover:bg-blue-700 transition-colors">
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-5 w-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" 
                />
              </svg>
            </div>
            
            {/* Brand text */}
            <div>
              <h1 className="text-xl font-bold text-gray-900">Support CRM</h1>
              <p className="text-xs text-gray-500 -mt-1">Datastraw Technologies</p>
            </div>
          </Link>

          {/* ========== NAVIGATION LINKS ========== */}
          <div className="flex items-center gap-2 sm:gap-4">
            
            {/* Home / Tickets Link */}
            <Link
              to="/"
              className={`px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isActive('/')
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              <span className="flex items-center gap-2">
                {/* Inbox icon */}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                </svg>
                <span className="hidden sm:inline">All Tickets</span>
              </span>
            </Link>

            {/* Create New Ticket Button */}
            <Link
              to="/create"
              className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/create')
                  ? 'bg-blue-700 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow'
              }`}
            >
              {/* Plus icon */}
              <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="hidden sm:inline">New Ticket</span>
              <span className="sm:hidden">New</span>
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar