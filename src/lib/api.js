
const DEFAULT_HEADERS = {
  Accept: 'application/json'
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

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

function extractFileNameFromHeaders(contentDisposition = '') {
  if (typeof contentDisposition !== 'string' || !contentDisposition) {
    return '';
  }

  const fileNameMatch = contentDisposition.match(/filename\*=UTF-8''([^;]+)/i);
  if (fileNameMatch?.[1]) {
    try {
      return decodeURIComponent(fileNameMatch[1]);
    } catch {
      return fileNameMatch[1];
    }
  }

  const quotedFileNameMatch = contentDisposition.match(/filename="?([^";]+)"?/i);
  if (quotedFileNameMatch?.[1]) {
    return quotedFileNameMatch[1];
  }

  return '';
}

async function requestBinary(path, options = {}) {
  const url = buildUrl(path);
  const headers = {
    ...(options.headers ?? {})
  };

  if (!headers.Accept && !headers.accept) {
    headers.Accept = '*/*';
  }

  if (authToken && !headers.Authorization) {
    headers.Authorization = authToken.startsWith('Bearer ')
      ? authToken
      : `Bearer ${authToken}`;
  }

  const fetchOptions = {
    method: options.method ?? 'GET',
    ...options,
    headers
  };

  const response = await fetch(url, fetchOptions);

  if (!response.ok) {
    const contentType = response.headers.get('content-type') ?? '';
    let message = response.statusText || 'Failed to download file.';

    try {
      if (contentType.includes('application/json')) {
        const errorPayload = await response.json();
        message = errorPayload?.message || message;
      } else {
        const text = await response.text();
        message = text || message;
      }
    } catch {
      // Swallow parsing errors and use the default message.
    }

    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  const blob = await response.blob();
  const contentDisposition = response.headers.get('content-disposition') ?? '';
  const inferredFileName = extractFileNameFromHeaders(contentDisposition);
  const mimeType = response.headers.get('content-type') || blob.type || 'application/octet-stream';

  return {
    blob,
    fileName: inferredFileName,
    mimeType
  };
}

const apiClient = {
  request,
  get: (path, options = {}) => request(path, { ...options, method: 'GET' }),
  post: (path, body, options = {}) => request(path, { ...options, method: 'POST', body }),
  put: (path, body, options = {}) => request(path, { ...options, method: 'PUT', body }),
  patch: (path, body, options = {}) => request(path, { ...options, method: 'PATCH', body }),
  delete: (path, options = {}) => request(path, { ...options, method: 'DELETE' }),
  download: (path, options = {}) => requestBinary(path, options)
};

export default apiClient;
