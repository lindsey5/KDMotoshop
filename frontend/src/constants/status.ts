export const statusColorMap: Record<string, { bg: string; icon: string }> = {
  Pending: { bg: 'bg-yellow-100', icon: '#eab308' },
  Accepted: { bg: 'bg-blue-200', icon: '#3b82f6' },
  Shipped: { bg: 'bg-purple-200', icon: '#a855f7' },
  Completed: { bg: 'bg-green-200', icon: '#22c55e' },
  Rejected: { bg: 'bg-red-200', icon: '#ef4444' },
  Cancelled: { bg: 'bg-gray-200', icon: '#9ca3af' },
  Refunded: { bg: 'bg-gray-200', icon: '#9ca3af' },
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