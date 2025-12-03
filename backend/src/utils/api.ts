import { projectId, publicAnonKey } from './supabase/info';

const BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-76b0b579`;

export class ApiClient {
  private accessToken: string | null = null;

  setAccessToken(token: string | null) {
    this.accessToken = token;
  }

  getAccessToken() {
    return this.accessToken;
  }

  private async request(endpoint: string, options: RequestInit = {}) {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.accessToken || publicAnonKey}`,
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Request failed' }));
      throw new Error(error.error || 'Request failed');
    }

    return response.json();
  }

  // Auth
  async signup(data: { email: string; password: string; name: string; role: string; cpf: string }) {
    return this.request('/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Establishments
  async createEstablishment(data: any) {
    return this.request('/establishments', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getEstablishments() {
    return this.request('/establishments');
  }

  async updateEstablishment(id: string, data: any) {
    return this.request(`/establishments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // Routes
  async createRoute(data: any) {
    return this.request('/routes', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRoutes() {
    return this.request('/routes');
  }

  async deleteRoute(id: string) {
    return this.request(`/routes/${id}`, {
      method: 'DELETE',
    });
  }

  async getRoutePoints(routeId: string) {
    return this.request(`/routes/${routeId}/points`);
  }

  // Employees
  async getEmployees() {
    return this.request('/employees');
  }

  // Rounds
  async createRound(data: any) {
    return this.request('/rounds', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getRounds() {
    return this.request('/rounds');
  }

  async updateRound(id: string, data: any) {
    return this.request(`/rounds/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async finishRound(id: string) {
    return this.request(`/rounds/${id}/finish`, {
      method: 'POST',
    });
  }

  // Checkpoints
  async createCheckpoint(data: any) {
    return this.request('/checkpoints', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getCheckpoints(roundId: string) {
    return this.request(`/checkpoints/${roundId}`);
  }

  async verifyCheckpoint(data: any) {
    return this.request('/checkpoints/verify', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // Occurrences
  async createOccurrence(data: any) {
    return this.request('/occurrences', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getOccurrences(routeId?: string) {
    const query = routeId ? `?routeId=${routeId}` : '';
    return this.request(`/occurrences${query}`);
  }

  async getEmergencies() {
    return this.request('/emergencies');
  }

  // Chat
  async sendMessage(data: any) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getMessages(channelId?: string) {
    const query = channelId ? `?channelId=${channelId}` : '';
    return this.request(`/chat/messages${query}`);
  }

  async sendChatMessage(data: any) {
    return this.request('/chat/messages', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async getChatMessages(routeId: string) {
    return this.request(`/chat/messages?routeId=${routeId}`);
  }

  // Reports
  async getRoundsReport(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reports/rounds?${params}`);
  }

  // Sync
  async sync(actions: any[]) {
    return this.request('/sync', {
      method: 'POST',
      body: JSON.stringify({ actions }),
    });
  }
}

export const apiClient = new ApiClient();