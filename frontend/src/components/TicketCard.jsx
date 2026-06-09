import { Link } from 'react-router-dom'
import StatusBadge from './StatusBadge'
import { getRelativeTime } from '../api'

// ============================================
// TICKET CARD COMPONENT
// ============================================
// Displays a single ticket in the list view
// Clicking the card navigates to ticket detail page

function TicketCard({ ticket }) {
  return (
    <Link
      to={`/tickets/${ticket.ticket_id}`}
      className="block bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md hover:border-blue-300 transition-all duration-200 fade-in"
    >
      <div className="flex items-start justify-between gap-4">
        {/* ========== LEFT SIDE - Ticket Info ========== */}
        <div className="flex-1 min-w-0">
          
          {/* Header row: Ticket ID + Status */}
          <div className="flex items-center gap-3 mb-2 flex-wrap">
            <span className="text-xs font-mono font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded">
              {ticket.ticket_id}
            </span>
            <StatusBadge status={ticket.status} />
          </div>

          {/* Subject */}
          <h3 className="text-base font-semibold text-gray-900 mb-1 truncate">
            {ticket.subject}
          </h3>

          {/* Customer info */}
          <div className="flex items-center gap-4 text-sm text-gray-600 flex-wrap">
            {/* Customer name with icon */}
            <span className="flex items-center gap-1.5">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
              {ticket.customer_name}
            </span>

            {/* Email with icon */}
            <span className="flex items-center gap-1.5 text-gray-500 truncate">
              <svg className="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="truncate">{ticket.customer_email}</span>
            </span>
          </div>
        </div>

        {/* ========== RIGHT SIDE - Time + Arrow ========== */}
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="text-xs text-gray-500 whitespace-nowrap">
            {getRelativeTime(ticket.created_at)}
          </span>
          <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}

export default TicketCard