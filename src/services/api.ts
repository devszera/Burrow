import { PaymentDetails, Request, StatusUpdate, Warehouse } from '../types';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const text = await response.text();
    let message = text;

    if (text) {
      try {
        const data = JSON.parse(text);
        if (data && typeof data === 'object') {
          if ('message' in data && typeof data.message === 'string') {
            message = data.message;
          } else if ('error' in data && typeof data.error === 'string') {
            message = data.error;
          }
        }
      } catch (parseError) {
        console.warn('Failed to parse error response', parseError);
      }
    }

    throw new Error(message || 'Request failed');
  }

  return response.json() as Promise<T>;
}

export interface RequestQueryParams {
  userId?: string;
  status?: string;
}

export interface CreateRequestPayload {
  userId: string;
  orderNumber: string;
  platform: string;
  productDescription: string;
  warehouseId: string;
  originalETA: string;
  scheduledDeliveryDate: string;
  deliveryTimeSlot: string;
  destinationAddress: Request['destinationAddress'];
  paymentDetails: PaymentDetails;
  status?: Request['status'];
  statusHistory?: StatusUpdate[];
  notes?: string;
  receiptUrl?: string | null;
}

export const api = {
  async getWarehouses(): Promise<Warehouse[]> {
    const response = await fetch(`${API_BASE_URL}/api/warehouses`);
    return handleResponse<Warehouse[]>(response);
  },

  async createWarehouse(data: Partial<Warehouse>): Promise<Warehouse> {
    const response = await fetch(`${API_BASE_URL}/api/warehouses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return handleResponse<Warehouse>(response);
  },

  async updateWarehouse(id: string, data: Partial<Warehouse>): Promise<Warehouse> {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return handleResponse<Warehouse>(response);
  },

  async deleteWarehouse(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/warehouses/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Failed to delete warehouse');
    }
  },

  async getRequests(params: RequestQueryParams = {}): Promise<Request[]> {
    const url = new URL(`${API_BASE_URL}/api/requests`);
    if (params.userId) {
      url.searchParams.set('userId', params.userId);
    }
    if (params.status) {
      url.searchParams.set('status', params.status);
    }

    const response = await fetch(url.toString());
    return handleResponse<Request[]>(response);
  },

  async getRequest(id: string): Promise<Request> {
    const response = await fetch(`${API_BASE_URL}/api/requests/${id}`);
    return handleResponse<Request>(response);
  },

  async createRequest(payload: CreateRequestPayload): Promise<Request> {
    const response = await fetch(`${API_BASE_URL}/api/requests`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    return handleResponse<Request>(response);
  },

  async updateRequest(id: string, data: Partial<Request>): Promise<Request> {
    const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });

    return handleResponse<Request>(response);
  },

  async deleteRequest(id: string): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/api/requests/${id}`, {
      method: 'DELETE'
    });

    if (!response.ok) {
      const message = await response.text();
      throw new Error(message || 'Failed to delete request');
    }
  }
};
