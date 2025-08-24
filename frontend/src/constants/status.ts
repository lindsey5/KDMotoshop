export const statusColorMap: Record<string, { bg: string; icon: string }> = {
  Pending:   { bg: 'bg-orange-100', icon: '#f97316' },  // orange
  Confirmed:  { bg: 'bg-green-100',  icon: '#22c55e' },  // green
  Shipped:   { bg: 'bg-blue-100',   icon: '#3b82f6' },  // blue
  Delivered: { bg: 'bg-purple-100', icon: '#a855f7' },  // purple
  Rated: { bg: 'bg-yellow-100', icon: '#d4c712ff' },  // purple
  Rejected:  { bg: 'bg-red-100',    icon: '#ef4444' },  // red
  Failed:  { bg: 'bg-red-100',    icon: '#ef4444' },
  Cancelled: { bg: 'bg-gray-200',   icon: '#9ca3af' },  // gray
};

export const Statuses = [
    { value: 'All', label: 'All', color: 'gray' },
    { value: 'Pending', label: 'Pending', color: 'orange' },
    { value: 'Confirmed', label: 'Confirmed', color: 'green' },
    { value: 'Shipped', label: 'Shipped', color: 'blue' },
    { value: 'Delivered', label: 'Delivered', color: 'purple' },
    { value: 'Rated', label: 'Rated', color: 'gold' },
    { value: 'Rejected', label: 'Rejected', color: 'red' },
    { value: 'Failed', label: 'Failed', color: 'red' },
    { value: 'Cancelled', label: 'Cancelled', color: 'gray' },
]