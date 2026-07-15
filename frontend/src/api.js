const jsonHeaders = {
  'Content-Type': 'application/json',
};

async function request(path, options = {}) {
  const response = await fetch(path, {
    headers: options.body ? jsonHeaders : undefined,
    ...options,
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Request failed');
  }

  return response.json();
}

export const api = {
  getCredits: () => request('/api/credits'),
  loadCredits: (payload) => request('/api/credits/load', { method: 'POST', body: JSON.stringify(payload) }),
  getSchedule: () => request('/api/schedule'),
  getTickets: () => request('/api/tickets'),
};