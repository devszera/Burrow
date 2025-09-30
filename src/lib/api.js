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

const resolveBaseUrl = () => {
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
};

class ApiClient {
  constructor() {
    this.baseUrl = resolveBaseUrl();
    this.authToken = null;
  }

  setAuthToken(token) {
    this.authToken = token || null;
  }

  buildUrl(path) {
    if (!path) {
      throw new Error('A request path is required.');
    }

    if (/^https?:\/\//i.test(path)) {
      return path;
    }

    if (this.baseUrl) {
      return `${this.baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
    }

    return path.startsWith('/') ? path : `/${path}`;
  }

  async parseJsonResponse(response) {
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

  async request(path, options = {}) {
    const url = this.buildUrl(path);
    const headers = {
      ...DEFAULT_HEADERS,
      ...(options.headers ?? {})
    };

    const hasBody = options.body !== undefined && options.body !== null;

    if (hasBody && !(headers['Content-Type'] || headers['content-type'])) {
      headers['Content-Type'] = 'application/json';
    }

    if (this.authToken && !headers.Authorization) {
      headers.Authorization = this.authToken.startsWith('Bearer ')
        ? this.authToken
        : `Bearer ${this.authToken}`;
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
    const payload = await this.parseJsonResponse(response);

    if (!response.ok) {
      const error = new Error(payload?.message || response.statusText);
      error.status = response.status;
      error.data = payload;
      throw error;
    }

    return payload?.data ?? payload;
  }

  get(path, options = {}) {
    return this.request(path, { ...options, method: 'GET' });
  }

  post(path, body, options = {}) {
    return this.request(path, { ...options, method: 'POST', body });
  }

  put(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PUT', body });
  }

  patch(path, body, options = {}) {
    return this.request(path, { ...options, method: 'PATCH', body });
  }

  delete(path, options = {}) {
    return this.request(path, { ...options, method: 'DELETE' });
  }
}

const apiClient = new ApiClient();

export default apiClient;
