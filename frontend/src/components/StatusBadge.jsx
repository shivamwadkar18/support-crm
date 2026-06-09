// ============================================
// STATUS BADGE COMPONENT
// ============================================
// Shows a colored pill badge for ticket status
// Open = Blue | In Progress = Yellow | Closed = Green

function StatusBadge({ status }) {
  // Define color styles for each status
  const statusStyles = {
    'Open': {
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      dot: 'bg-blue-500',
    },
    'In Progress': {
      bg: 'bg-yellow-100',
      text: 'text-yellow-700',
      dot: 'bg-yellow-500',
    },
    'Closed': {
      bg: 'bg-green-100',
      text: 'text-green-700',
      dot: 'bg-green-500',
    },
  }

  // Fallback for unknown status
  const style = statusStyles[status] || {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    dot: 'bg-gray-500',
  }

  return (
    <span 
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${style.bg} ${style.text}`}
    >
      {/* Colored dot indicator */}
      <span className={`h-1.5 w-1.5 rounded-full ${style.dot}`}></span>
      {status}
    </span>
  )
}

export default StatusBadge