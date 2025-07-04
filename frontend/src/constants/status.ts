export const statusColorMap: Record<string, { bg: string; icon: string }> = {
  Pending:   { bg: 'bg-orange-100', icon: '#f97316' },  // orange
  Accepted:  { bg: 'bg-green-100',  icon: '#22c55e' },  // green
  Shipped:   { bg: 'bg-blue-100',   icon: '#3b82f6' },  // blue
  Completed: { bg: 'bg-purple-100', icon: '#a855f7' },  // purple
  Rejected:  { bg: 'bg-red-100',    icon: '#ef4444' },  // red
  Cancelled: { bg: 'bg-gray-200',   icon: '#9ca3af' },  // gray
  Refunded:  { bg: 'bg-gray-200',   icon: '#9ca3af' },  // gray
};

export const Statuses = [
    { value: 'Pending', label: 'Pending', color: 'orange' },
    { value: 'Accepted', label: 'Accepted', color: 'green' },
    { value: 'Shipped', label: 'Shipped', color: 'blue' },
    { value: 'Completed', label: 'Completed', color: 'purple' },
    { value: 'Rejected', label: 'Rejected', color: 'red' },
    { value: 'Cancelled', label: 'Cancelled', color: 'gray' },
    { value: 'Refunded', label: 'Refunded', color: 'gray' }
]