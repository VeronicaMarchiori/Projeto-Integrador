const BASE_URL = "http://localhost:3000";

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
      "Content-Type": "application/json",
      ...options.headers,
    };

    if (this.accessToken) {
      headers["Authorization"] = `Bearer ${this.accessToken}`;
    }

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.message || "Erro na requisição");
    }

    return data;
  }

  // =====================
  // AUTENTICAÇÃO
  // =====================

  async login(email: string, senha: string) {
    return this.request("/login", {
      method: "POST",
      body: JSON.stringify({ email, senha }),
    });
  }

  async signup(data: {
    email: string;
    password: string;
    name: string;
    role: string;
    cpf: string;
  }) {
    return this.request("/signup", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =====================
  // ESTABELECIMENTOS
  // =====================

  async createEstablishment(data: any) {
    return this.request("/establishments", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getEstablishments() {
    return this.request("/establishments");
  }

  async updateEstablishment(id: string, data: any) {
    return this.request(`/establishments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  // =====================
  // ROTAS
  // =====================

  async createRoute(data: any) {
    return this.request("/routes", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRoutes() {
    return this.request("/routes");
  }

  async deleteRoute(id: string) {
    return this.request(`/routes/${id}`, {
      method: "DELETE",
    });
  }

  async getRoutePoints(routeId: string) {
    return this.request(`/routes/${routeId}/points`);
  }

  // =====================
  // FUNCIONÁRIOS
  // =====================

  async getEmployees() {
    return this.request("/employees");
  }

  // =====================
  // RONDAS
  // =====================

  async createRound(data: any) {
    return this.request("/rounds", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getRounds() {
    return this.request("/rounds");
  }

  async updateRound(id: string, data: any) {
    return this.request(`/rounds/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async finishRound(id: string) {
    return this.request(`/rounds/${id}/finish`, {
      method: "POST",
    });
  }

  // =====================
  // CHECKPOINTS
  // =====================

  async createCheckpoint(data: any) {
    return this.request("/checkpoints", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getCheckpoints(roundId: string) {
    return this.request(`/checkpoints/${roundId}`);
  }

  async verifyCheckpoint(data: any) {
    return this.request("/checkpoints/verify", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  // =====================
  // OCORRÊNCIAS
  // =====================

  async createOccurrence(data: any) {
    return this.request("/occurrences", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getOccurrences(routeId?: string) {
    const query = routeId ? `?routeId=${routeId}` : "";
    return this.request(`/occurrences${query}`);
  }

  async getEmergencies() {
    return this.request("/emergencies");
  }

  // =====================
  // CHAT
  // =====================

  async sendMessage(data: any) {
    return this.request("/chat/messages", {
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async getMessages(channelId?: string) {
    const query = channelId ? `?channelId=${channelId}` : "";
    return this.request(`/chat/messages${query}`);
  }

  // =====================
  // RELATÓRIOS
  // =====================

  async getRoundsReport(filters: any = {}) {
    const params = new URLSearchParams(filters);
    return this.request(`/reports/rounds?${params}`);
  }

  // =====================
  // SYNC
  // =====================

  async sync(actions: any[]) {
    return this.request("/sync", {
      method: "POST",
      body: JSON.stringify({ actions }),
    });
  }
}

export const apiClient = new ApiClient();
