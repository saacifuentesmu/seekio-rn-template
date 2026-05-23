// REST implementation of the DataStore port.
//
// Wraps the existing authenticated axios client (services/api/client). The
// resource name is used directly as the URL path segment, and `query` is
// forwarded as axios `params`. The server is expected to return DTO-shaped
// data (neutral ids/dates) — mapping logic can be added here later if a
// concrete backend diverges from the DTO convention.

import {isAxiosError} from 'axios';

import {DataStore} from '@/services/backend/ports/dataStore';
import {api} from '@/services/api/client';

export class RestDataStore implements DataStore {
  async get<T>(resource: string, id: string): Promise<T | null> {
    try {
      const res = await api.get<T>(`/${resource}/${id}`);
      return res.data;
    } catch (err) {
      if (isAxiosError(err) && err.response?.status === 404) {
        return null;
      }
      throw err;
    }
  }

  async list<T>(
    resource: string,
    query?: Record<string, unknown>,
  ): Promise<T[]> {
    const res = await api.get<T[]>(`/${resource}`, {params: query});
    return res.data;
  }

  async create<T>(resource: string, data: Partial<T>): Promise<T> {
    const res = await api.post<T>(`/${resource}`, data);
    return res.data;
  }

  async update<T>(resource: string, id: string, data: Partial<T>): Promise<T> {
    const res = await api.patch<T>(`/${resource}/${id}`, data);
    return res.data;
  }

  async delete(resource: string, id: string): Promise<void> {
    await api.delete(`/${resource}/${id}`);
  }
}
