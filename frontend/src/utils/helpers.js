// Format countdown from a future ISO date string
export const getCountdown = (isoDate) => {
  const diff = new Date(isoDate) - Date.now();
  if (diff <= 0) return '00:00:00';
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return [h, m, s].map((n) => String(n).padStart(2, '0')).join(':');
};

// Format ISO date to readable string
export const formatDate = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
};

// Format ISO date to time
export const formatTime = (iso) => {
  if (!iso) return '—';
  return new Date(iso).toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Priority → color class
export const priorityClass = (priority) => {
  const map = { CRITICAL: 'critical', HIGH: 'high', MEDIUM: 'medium', LOW: 'low' };
  return map[priority] || 'info';
};

// Status → display label
export const statusLabel = (status) => {
  const map = {
    AVAILABLE: 'Available',
    MATCHED: 'Matched',
    ACCEPTED: 'Accepted',
    PICKUP_SCHEDULED: 'Pickup Scheduled',
    COMPLETED: 'Completed',
    EXPIRED: 'Expired',
  };
  return map[status] || status;
};

// Status → badge variant
export const statusVariant = (status) => {
  const map = {
    AVAILABLE: 'info',
    MATCHED: 'high',
    ACCEPTED: 'medium',
    PICKUP_SCHEDULED: 'medium',
    COMPLETED: 'success',
    EXPIRED: 'critical',
  };
  return map[status] || 'info';
};
