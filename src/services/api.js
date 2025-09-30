const BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

const buildUrl = (path) => {
  if (path.startsWith('http')) return path;
  return `${BASE_URL}${path}`;
};

const defaultHeaders = {
  'Content-Type': 'application/json',
};

const handleResponse = async (response) => {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || 'Request failed';
    const error = new Error(message);
    error.details = data.details;
    throw error;
  }
  return data;
};

export const apiClient = async (path, options = {}) => {
  const response = await fetch(buildUrl(path), {
    headers: { ...defaultHeaders, ...(options.headers || {}) },
    ...options,
  });
  return handleResponse(response);
};

export const login = (email, password) =>
  apiClient('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });

export const register = (payload) =>
  apiClient('/api/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const fetchWarehouses = () => apiClient('/api/warehouses');

export const fetchRequests = (params = {}) => {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      query.append(key, value);
    }
  });
  const suffix = query.toString() ? `?${query.toString()}` : '';
  return apiClient(`/api/requests${suffix}`);
};

export const fetchRequestById = (id) => apiClient(`/api/requests/${id}`);

export const createRequest = (payload) =>
  apiClient('/api/requests', {
    method: 'POST',
    body: JSON.stringify(payload),
  });

export const updateRequestStatus = (id, payload) =>
  apiClient(`/api/requests/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
