import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { createTicket } from '../api'

// ============================================
// CREATE TICKET PAGE
// ============================================

function CreateTicket() {
  const navigate = useNavigate()

  // Form state
  const [formData, setFormData] = useState({
    customer_name: '',
    customer_email: '',
    subject: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Basic validation
    if (!formData.customer_name.trim() || !formData.customer_email.trim() 
        || !formData.subject.trim() || !formData.description.trim()) {
      setError('Please fill in all fields')
      return
    }

    try {
      setLoading(true)
      setError(null)
      const result = await createTicket(formData)
      setSuccess(result.ticket_id)
      
      // Redirect to ticket detail page after 1.5 seconds
      setTimeout(() => {
        navigate(`/tickets/${result.ticket_id}`)
      }, 1500)
    } catch (err) {
      const errorMsg = err.response?.data?.detail || 'Failed to create ticket. Please try again.'
      setError(typeof errorMsg === 'string' ? errorMsg : 'Invalid input data')
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto fade-in">
      {/* ========== HEADER ========== */}
      <div className="mb-6">
        <Link to="/" className="text-blue-600 hover:text-blue-700 text-sm flex items-center gap-1 mb-3">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to tickets
        </Link>
        <h1 className="text-3xl font-bold text-gray-900">Create New Ticket</h1>
        <p className="text-gray-600 mt-1">Fill in the details below to submit a support request</p>
      </div>

      {/* ========== SUCCESS MESSAGE ========== */}
      {success && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4 flex items-center gap-3 fade-in">
          <svg className="h-6 w-6 text-green-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <p className="font-semibold text-green-800">Ticket created successfully!</p>
            <p className="text-sm text-green-700">
              Ticket ID: <span className="font-mono font-semibold">{success}</span> • Redirecting...
            </p>
          </div>
        </div>
      )}

      {/* ========== ERROR MESSAGE ========== */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-4 flex items-center gap-3">
          <svg className="h-6 w-6 text-red-600 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {/* ========== FORM ========== */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        
        {/* Customer Name */}
        <div>
          <label htmlFor="customer_name" className="form-label">
            Customer Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="customer_name"
            name="customer_name"
            value={formData.customer_name}
            onChange={handleChange}
            placeholder="e.g. John Doe"
            disabled={loading || success}
            className="input-field"
          />
        </div>

        {/* Customer Email */}
        <div>
          <label htmlFor="customer_email" className="form-label">
            Customer Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            id="customer_email"
            name="customer_email"
            value={formData.customer_email}
            onChange={handleChange}
            placeholder="e.g. john@example.com"
            disabled={loading || success}
            className="input-field"
          />
        </div>

        {/* Subject */}
        <div>
          <label htmlFor="subject" className="form-label">
            Subject <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            placeholder="Brief summary of the issue"
            disabled={loading || success}
            className="input-field"
          />
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="form-label">
            Description <span className="text-red-500">*</span>
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Provide detailed information about the issue..."
            rows={6}
            disabled={loading || success}
            className="input-field resize-none"
          />
          <p className="text-xs text-gray-500 mt-1">
            {formData.description.length} characters
          </p>
        </div>

        {/* ========== BUTTONS ========== */}
        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={loading || success}
            className="btn-primary flex-1 flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Creating...
              </>
            ) : (
              <>
                <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create Ticket
              </>
            )}
          </button>
          <Link to="/" className="btn-secondary">
            Cancel
          </Link>
        </div>
      </form>
    </div>
  )
}

export default CreateTicket