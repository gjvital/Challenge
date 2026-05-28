import { APIRequestContext, APIResponse } from '@playwright/test';
import { config } from '../../utils/config';

export interface CreateUserPayload {
  name: string;
  job: string;
}

export interface RegisterPayload {
  email: string;
  password?: string;
}

export interface LoginPayload {
  email?: string;
  password?: string;
}

export class ReqResClient {
  constructor(private readonly request: APIRequestContext) {}

  private headers(): Record<string, string> {
    return {
      'Content-Type': 'application/json',
      'x-api-key': config.api.apiKey,
      'X-Reqres-Env': config.api.env,
      'User-Agent': 'Constellation-QA-Challenge/1.0',
    };
  }

  async getUsers(params?: { page?: number; delay?: number }): Promise<APIResponse> {
    const search = new URLSearchParams();
    if (params?.page) search.set('page', String(params.page));
    if (params?.delay) search.set('delay', String(params.delay));
    const query = search.toString();
    return this.request.get(`/api/users${query ? `?${query}` : ''}`, {
      headers: this.headers(),
    });
  }

  async getUserById(id: number | string): Promise<APIResponse> {
    return this.request.get(`/api/users/${id}`, { headers: this.headers() });
  }

  async createUser(payload: CreateUserPayload): Promise<APIResponse> {
    return this.request.post('/api/users', {
      headers: this.headers(),
      data: payload,
    });
  }

  async updateUser(
    id: number | string,
    payload: CreateUserPayload,
  ): Promise<APIResponse> {
    return this.request.put(`/api/users/${id}`, {
      headers: this.headers(),
      data: payload,
    });
  }

  async deleteUser(id: number | string): Promise<APIResponse> {
    return this.request.delete(`/api/users/${id}`, {
      headers: this.headers(),
    });
  }

  async register(payload: RegisterPayload): Promise<APIResponse> {
    return this.request.post('/api/register', {
      headers: this.headers(),
      data: payload,
    });
  }

  async login(payload: LoginPayload): Promise<APIResponse> {
    return this.request.post('/api/login', {
      headers: this.headers(),
      data: payload,
    });
  }
}
