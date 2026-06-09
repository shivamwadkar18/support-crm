import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTickets } from '../api'
import TicketCard from '../components/TicketCard'
import SearchBar from '../components/SearchBar'
import FilterBar from '../components/FilterBar'

// ============================================
// HOME PAGE - Lists all tickets
// ============================================

function Home() {
  // State management
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  // ========== FETCH TICKETS FROM API ==========
  const fetchTickets = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await getTickets({
        status: statusFilter,
        search: searchQuery,
      })
      setTickets(data)
    } catch (err) {
      setError('Failed to load tickets. Make sure the backend is running.')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  // ========== DEBOUNCED SEARCH ==========
  // Wait 300ms after user stops typing before searching
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchTickets()
    }, 300)
    return () => clearTimeout(timer)
  }, [searchQuery, statusFilter])

  // ========== CALCULATE COUNTS FOR FILTER BAR ==========
  const getCounts = () => {
    return {
      '': tickets.length,
      'Open': tickets.filter(t => t.status === 'Open').length,
      'In Progress': tickets.filter(t => t.status === 'In Progress').length,
      'Closed': tickets.filter(t => t.status === 'Closed').length,
    }
  }

  return (
    <div className="fade-in">
      {/* ========== PAGE HEADER ========== */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Support Tickets</h1>
          <p className="text-gray-600 mt-1">
            Manage and track all customer support requests
          </p>
        </div>
        <Link
          to="/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-sm"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Create Ticket
        </Link>
      </div>

      {/* ========== SEARCH + FILTER ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 space-y-4">
        <SearchBar
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search by ticket ID, customer name, email, or description..."
        />
        <FilterBar
          activeFilter={statusFilter}
          onFilterChange={setStatusFilter}
          counts={getCounts()}
        />
      </div>

      {/* ========== CONTENT AREA ========== */}
      
      {/* LOADING STATE */}
      {loading && (
        <div className="flex justify-center items-center py-20">
          <div className="spinner"></div>
        </div>
      )}

      {/* ERROR STATE */}
      {error && !loading && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
          <svg className="h-12 w-12 text-red-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-700 font-medium">{error}</p>
          <button onClick={fetchTickets} className="mt-3 text-red-600 hover:text-red-800 underline text-sm">
            Try again
          </button>
        </div>
      )}

      {/* EMPTY STATE */}
      {!loading && !error && tickets.length === 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <svg className="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">
            {searchQuery || statusFilter ? 'No matching tickets found' : 'No tickets yet'}
          </h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || statusFilter 
              ? 'Try adjusting your search or filters' 
              : 'Create your first ticket to get started'}
          </p>
          {!searchQuery && !statusFilter && (
            <Link to="/create" className="btn-primary inline-block">
              Create First Ticket
            </Link>
          )}
        </div>
      )}

      {/* TICKETS LIST */}
      {!loading && !error && tickets.length > 0 && (
        <div className="space-y-3">
          <p className="text-sm text-gray-500 mb-3">
            Showing {tickets.length} ticket{tickets.length !== 1 ? 's' : ''}
          </p>
          {tickets.map((ticket) => (
            <TicketCard key={ticket.ticket_id} ticket={ticket} />
          ))}
        </div>
      )}
    </div>
  )
}

export default Home