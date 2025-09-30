const DEFAULT_HEADERS = {
  Accept: 'application/json'
};

const nodeProcess = typeof globalThis !== 'undefined' ? globalThis.process : undefined;

const normaliseBaseUrl = (baseUrl) => baseUrl?.replace(/\/$/, '') ?? '';

const resolveDevApiPort = () => {
  const explicitPort =
    (typeof import.meta !== 'undefined' && import.meta.env?.VITE_DEV_API_PORT) ||
    nodeProcess?.env?.VITE_DEV_API_PORT;

  if (explicitPort) {
    return explicitPort;
  }

  if (typeof window !== 'undefined') {
    const currentPort = window.location?.port;
    if (currentPort === '5173' || currentPort === '4173') {
      return '4000';
    }
  }

  return undefined;
};

const API_BASE_URL = (() => {
  if (typeof import.meta !== 'undefined') {
    const fromVite = import.meta.env?.VITE_API_BASE_URL ?? '';
    if (fromVite) {
      return normaliseBaseUrl(fromVite);
    }
  }

  const envBaseUrl = nodeProcess?.env?.VITE_API_BASE_URL ?? '';
  if (envBaseUrl) {
    return normaliseBaseUrl(envBaseUrl);
  }

  if (typeof window !== 'undefined' && window.location) {
    const { protocol, hostname } = window.location;
    const devPort = resolveDevApiPort();

    if (devPort) {
      const derivedPort = devPort.replace(/^:/, '');
      return normaliseBaseUrl(`${protocol}//${hostname}:${derivedPort}`);
    }

    if (window.location.origin) {
      return normaliseBaseUrl(window.location.origin);
    }
  }

  return '';

const API_BASE_URL = (() => {
  if (typeof import.meta !== 'undefined') {
    const baseUrl = import.meta.env?.VITE_API_BASE_URL ?? '';
    return baseUrl?.replace(/\/$/, '') ?? '';
  }
  const envBaseUrl = nodeProcess?.env?.VITE_API_BASE_URL ?? '';
  return envBaseUrl?.replace(/\/$/, '') ?? '';

})();

let authToken = null;

export const setAuthToken = (token) => {
  authToken = token || null;
};

function buildUrl(path) {
  if (!path) {
    throw new Error('A request path is required.');
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }


  if (API_BASE_URL) {
    return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
  }

  return path.startsWith('/') ? path : `/${path}`;

  if (!API_BASE_URL) {
    throw new Error('VITE_API_BASE_URL is not configured.');
  }

  return `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

}

async function parseJsonResponse(response) {
  const text = await response.text();
  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const parseError = new Error('Failed to parse server response as JSON.');
    parseError.cause = error;
    throw parseError;
  }
}

async function request(path, options = {}) {
  const url = buildUrl(path);
  const headers = {
    ...DEFAULT_HEADERS,
    ...(options.headers ?? {})
  };

  const hasBody = options.body !== undefined && options.body !== null;

  if (hasBody && !(headers['Content-Type'] || headers['content-type'])) {
    headers['Content-Type'] = 'application/json';
  }

  if (authToken && !headers.Authorization) {
    headers.Authorization = authToken.startsWith('Bearer ')
      ? authToken
      : `Bearer ${authToken}`;
  }

  const fetchOptions = {
    method: options.method ?? (hasBody ? 'POST' : 'GET'),
    ...options,
    headers,
    body: hasBody && typeof options.body !== 'string'
      ? JSON.stringify(options.body)
      : options.body
  };

  const response = await fetch(url, fetchOptions);
  const payload = await parseJsonResponse(response);

  if (!response.ok) {
    const error = new Error(payload?.message || response.statusText);
    error.status = response.status;
    error.data = payload;
    throw error;
  }

  return payload?.data ?? payload;
}

const apiClient = {
  request,
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' })
};

export default apiClient;
