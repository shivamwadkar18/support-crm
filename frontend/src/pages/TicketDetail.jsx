import { useState, useEffect, useCallback } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { getTicketById, updateTicket, deleteTicket, formatDate, getRelativeTime } from '../api'
import StatusBadge from '../components/StatusBadge'

// ============================================
// TICKET DETAIL PAGE
// ============================================

function TicketDetail() {
  const { ticketId } = useParams()
  const navigate = useNavigate()

  // State
  const [ticket, setTicket] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [updating, setUpdating] = useState(false)
  const [newNote, setNewNote] = useState('')

  // ========== FETCH TICKET DETAILS ==========
  const fetchTicket = useCallback(async () => {
    try {
      setLoading(true)
      const data = await getTicketById(ticketId)
      setTicket(data)
    } catch (err) {
      setError('Ticket not found or failed to load')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }, [ticketId])

  useEffect(() => {
    // Call fetchTicket asynchronously to avoid synchronous setState within effect
    const t = setTimeout(() => {
      fetchTicket()
    }, 0)
    return () => clearTimeout(t)
  }, [fetchTicket])

  // ========== HANDLE STATUS UPDATE ==========
  const handleStatusUpdate = async (status) => {
    try {
      setUpdating(true)
      await updateTicket(ticketId, { status })
      await fetchTicket() // Refresh data
    } catch (err) {
      alert('Failed to update status')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  // ========== HANDLE ADD NOTE ==========
  const handleAddNote = async (e) => {
    e.preventDefault()
    if (!newNote.trim()) return

    try {
      setUpdating(true)
      await updateTicket(ticketId, { note_text: newNote })
      setNewNote('')
      await fetchTicket() // Refresh data
    } catch (err) {
      alert('Failed to add note')
      console.error(err)
    } finally {
      setUpdating(false)
    }
  }

  // ========== HANDLE DELETE ==========
  const handleDelete = async () => {
    if (!window.confirm(`Are you sure you want to delete ticket ${ticketId}? This cannot be undone.`)) {
      return
    }
    try {
      await deleteTicket(ticketId)
      navigate('/')
    } catch (err) {
      alert('Failed to delete ticket')
      console.error(err)
    }
  }

  // ========== LOADING STATE ==========
  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="spinner"></div>
      </div>
    )
  }

  // ========== ERROR STATE ==========
  if (error || !ticket) {
    return (
      <div className="max-w-2xl mx-auto text-center py-20">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Ticket Not Found</h2>
        <p className="text-gray-600 mb-4">{error}</p>
        <Link to="/" className="btn-primary inline-block">
          Back to Tickets
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto fade-in">
      {/* ========== BACK LINK ========== */}
      <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-4">
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to tickets
      </Link>

      {/* ========== TICKET HEADER CARD ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2 flex-wrap">
              <span className="text-sm font-mono font-semibold text-blue-600 bg-blue-50 px-3 py-1 rounded">
                {ticket.ticket_id}
              </span>
              <StatusBadge status={ticket.status} />
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-1">{ticket.subject}</h1>
            <p className="text-sm text-gray-500">
              Created {formatDate(ticket.created_at)} • Updated {getRelativeTime(ticket.updated_at)}
            </p>
          </div>

          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="text-red-600 hover:text-red-800 hover:bg-red-50 p-2 rounded-lg transition-colors"
            title="Delete ticket"
          >
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6M1 7h22M9 7V4a2 2 0 012-2h2a2 2 0 012 2v3" />
            </svg>
          </button>
        </div>

        {/* Customer Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
          <div>
            <p className="text-xs text-gray-500 mb-1">Customer Name</p>
            <p className="text-sm font-semibold text-gray-900">{ticket.customer_name}</p>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <a href={`mailto:${ticket.customer_email}`} className="text-sm text-blue-600 hover:underline">
              {ticket.customer_email}
            </a>
          </div>
        </div>
      </div>

      {/* ========== DESCRIPTION CARD ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Description
        </h2>
        <p className="text-gray-900 whitespace-pre-wrap leading-relaxed">
          {ticket.description}
        </p>
      </div>

      {/* ========== STATUS UPDATE ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Update Status
        </h2>
        <div className="flex flex-wrap gap-2">
          {['Open', 'In Progress', 'Closed'].map((status) => (
            <button
              key={status}
              onClick={() => handleStatusUpdate(status)}
              disabled={updating || ticket.status === status}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                ticket.status === status
                  ? 'bg-blue-600 text-white cursor-default'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              } ${updating ? 'opacity-50' : ''}`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* ========== ADD NOTE FORM ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 mb-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-3">
          Add Note
        </h2>
        <form onSubmit={handleAddNote}>
          <textarea
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder="Add a comment or internal note..."
            rows={3}
            className="input-field resize-none mb-3"
            disabled={updating}
          />
          <button
            type="submit"
            disabled={updating || !newNote.trim()}
            className="btn-primary flex items-center gap-2"
          >
            {updating ? 'Adding...' : 'Add Note'}
          </button>
        </form>
      </div>

      {/* ========== NOTES TIMELINE ========== */}
      <div className="bg-white rounded-xl border border-gray-200 p-6">
        <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-wide mb-4">
          Notes & History ({ticket.notes?.length || 0})
        </h2>
        
        {ticket.notes && ticket.notes.length > 0 ? (
          <div className="space-y-4">
            {ticket.notes.slice().reverse().map((note) => (
              <div key={note.id} className="flex gap-3 pb-4 border-b border-gray-100 last:border-0 last:pb-0">
                {/* Avatar */}
                <div className="bg-blue-100 text-blue-700 h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0">
                  {(note.author || 'SA').charAt(0).toUpperCase()}
                </div>
                {/* Note content */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-sm font-semibold text-gray-900">
                      {note.author || 'Support Agent'}
                    </span>
                    <span className="text-xs text-gray-500">
                      {getRelativeTime(note.created_at)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 whitespace-pre-wrap">
                    {note.note_text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">
            No notes yet. Add the first note above.
          </p>
        )}
      </div>
    </div>
  )
}

export default TicketDetail