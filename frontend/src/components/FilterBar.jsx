// ============================================
// FILTER BAR COMPONENT
// ============================================
// Status filter buttons - All, Open, In Progress, Closed
// Shows count for each status

function FilterBar({ activeFilter, onFilterChange, counts = {} }) {
  // Define all filter options
  const filters = [
    { value: '', label: 'All', color: 'gray' },
    { value: 'Open', label: 'Open', color: 'blue' },
    { value: 'In Progress', label: 'In Progress', color: 'yellow' },
    { value: 'Closed', label: 'Closed', color: 'green' },
  ]

  // Get color classes for active/inactive states
  const getButtonClass = (filter) => {
    const isActive = activeFilter === filter.value
    
    if (isActive) {
      const activeColors = {
        gray: 'bg-gray-800 text-white',
        blue: 'bg-blue-600 text-white',
        yellow: 'bg-yellow-500 text-white',
        green: 'bg-green-600 text-white',
      }
      return activeColors[filter.color]
    }
    
    return 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-300'
  }

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.value}
          onClick={() => onFilterChange(filter.value)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${getButtonClass(filter)}`}
        >
          {filter.label}
          {counts[filter.value] !== undefined && (
            <span className="ml-2 text-xs opacity-75">
              ({counts[filter.value]})
            </span>
          )}
        </button>
      ))}
    </div>
  )
}

export default FilterBar