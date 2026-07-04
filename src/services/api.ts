// ============================================================
//  src/services/api.ts
//  Service centralisé — tous les appels HTTP passent par ici
// ============================================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// ── Token helpers ──────────────────────────────────────────
export const getAccessToken = () => localStorage.getItem('fittrack_access_token');
export const getRefreshToken = () => localStorage.getItem('fittrack_refresh_token');

export const saveTokens = (access: string, refresh: string) => {
  localStorage.setItem('fittrack_access_token', access);
  localStorage.setItem('fittrack_refresh_token', refresh);
};

export const clearTokens = () => {
  localStorage.removeItem('fittrack_access_token');
  localStorage.removeItem('fittrack_refresh_token');
  localStorage.removeItem('fittrack_user');
};

// ── Core fetch wrapper ─────────────────────────────────────
async function apiFetch<T>(
  endpoint: string,
  options: RequestInit = {},
  retry = true,
): Promise<T> {
  const token = getAccessToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE_URL}${endpoint}`, { ...options, headers });

  // Token expiré → tenter le refresh
  if (res.status === 401 && retry) {
    const refreshed = await tryRefresh();
    if (refreshed) return apiFetch<T>(endpoint, options, false);
    clearTokens();
    window.location.href = '/login';
    throw new Error('Session expirée');
  }

  const json = await res.json();

  if (!res.ok) {
    throw new Error(json.message || `Erreur ${res.status}`);
  }

  // Unwrap envelope { success, data, ... }
  return (json.data !== undefined ? json.data : json) as T;
}

async function tryRefresh(): Promise<boolean> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return false;
  try {
    const res = await fetch(`${BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });
    if (!res.ok) return false;
    const json = await res.json();
    const data = json.data || json;
    saveTokens(data.accessToken, data.refreshToken);
    return true;
  } catch {
    return false;
  }
}

// ── Helpers ────────────────────────────────────────────────
const get = <T>(url: string) => apiFetch<T>(url);
const post = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: 'POST', body: body ? JSON.stringify(body) : undefined });
const patch = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: 'PATCH', body: body ? JSON.stringify(body) : undefined });
const del = <T>(url: string, body?: unknown) =>
  apiFetch<T>(url, { method: 'DELETE', body: body ? JSON.stringify(body) : undefined });

// ================================================================
//  AUTH
// ================================================================
export const authApi = {
  login: (email: string, password: string) =>
    post<{ accessToken: string; refreshToken: string; user: any }>('/auth/login', { email, password }),

  register: (name: string, email: string, password: string, goal?: string, level?: string) =>
    post<{ accessToken: string; refreshToken: string; user: any }>('/auth/register', { name, email, password, goal, level }),

  logout: () =>
    post<{ message: string }>('/auth/logout', { refreshToken: getRefreshToken() }),

  me: () => get<any>('/auth/me'),

  changePassword: (currentPassword: string, newPassword: string) =>
    patch<{ message: string }>('/auth/change-password', { currentPassword, newPassword }),
};

// ================================================================
//  USERS
// ================================================================
export const usersApi = {
  update: (id: string, data: Record<string, any>) => patch<any>(`/users/${id}`, data),
  getStats: () => get<any>('/users/me/stats'),
  getLeaderboard: (limit = 10) => get<any[]>(`/users/leaderboard?limit=${limit}`),
};

// ================================================================
//  PROGRAMS
// ================================================================
export const programsApi = {
  findAll: (params?: { level?: string; category?: string; search?: string; page?: number }) => {
    const q = new URLSearchParams();
    if (params?.level) q.set('level', params.level);
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    if (params?.page) q.set('page', String(params.page));
    return get<{ data: any[]; meta: any }>(`/programs?${q}`);
  },
  findOne: (id: string) => get<any>(`/programs/${id}`),
};

// ================================================================
//  SESSIONS
// ================================================================
export const sessionsApi = {
  findAll: (params?: { completed?: boolean; page?: number; limit?: number }) => {
    const q = new URLSearchParams();
    if (params?.completed !== undefined) q.set('completed', String(params.completed));
    if (params?.page) q.set('page', String(params.page));
    if (params?.limit) q.set('limit', String(params.limit));
    return get<{ data: any[]; meta: any }>(`/sessions?${q}`);
  },
  create: (data: Record<string, any>) => post<any>('/sessions', data),
  update: (id: string, data: Record<string, any>) => patch<any>(`/sessions/${id}`, data),
  remove: (id: string) => del<any>(`/sessions/${id}`),
  getProgress: (weeks = 8) => get<any[]>(`/sessions/progress?weeks=${weeks}`),
};

// ================================================================
//  NUTRITION
// ================================================================
export const nutritionApi = {
  getMeals: (params?: { category?: string; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.search) q.set('search', params.search);
    return get<{ data: any[]; meta: any }>(`/nutrition/meals?${q}`);
  },
  getMenus: () => get<{ data: any[] }>('/nutrition/menus'),
  getMenuByDate: (date: string) => get<any>(`/nutrition/menus/date/${date}`),
  createMenu: (data: Record<string, any>) => post<any>('/nutrition/menus', data),
  updateMenu: (id: string, data: Record<string, any>) => patch<any>(`/nutrition/menus/${id}`, data),
};

// ================================================================
//  PRODUCTS
// ================================================================
export const productsApi = {
  findAll: (params?: { category?: string; inStock?: boolean; search?: string }) => {
    const q = new URLSearchParams();
    if (params?.category) q.set('category', params.category);
    if (params?.inStock !== undefined) q.set('inStock', String(params.inStock));
    if (params?.search) q.set('search', params.search);
    return get<{ data: any[]; meta: any }>(`/products?${q}`);
  },
};

// ================================================================
//  ORDERS
// ================================================================
export const ordersApi = {
  create: (items: { productId: string; quantity: number }[], opts?: { shippingAddress?: string; paymentMethod?: string }) =>
    post<any>('/orders', { items, ...opts }),
  findAll: () => get<{ data: any[] }>('/orders'),
};

// ================================================================
//  GAMIFICATION
// ================================================================
export const gamificationApi = {
  getBadges: () => get<any[]>('/gamification/badges'),
  getMyBadges: () => get<any[]>('/gamification/badges/me'),
  getChallenges: (date?: string) => {
    const q = date ? `?date=${date}` : '';
    return get<any[]>(`/gamification/challenges/me${q}`);
  },
  completeChallenge: (challengeId: string, challengeDate: string) =>
    post<{ message: string; points: number }>('/gamification/challenges/complete', { challengeId, challengeDate }),
  getMyPoints: () => get<{ totalPoints: number }>('/gamification/points/me'),
  getLeaderboard: () => usersApi.getLeaderboard(10),
};

// ================================================================
//  NOTIFICATIONS
// ================================================================
export const notificationsApi = {
  findAll: (unreadOnly = false) =>
    get<{ data: any[]; meta: any }>(`/notifications?unreadOnly=${unreadOnly}`),
  getUnreadCount: () => get<{ count: number }>('/notifications/unread-count'),
  markAsRead: (id: string) => patch<any>(`/notifications/${id}/read`),
  markAllAsRead: () => patch<any>('/notifications/read-all'),
  remove: (id: string) => del<any>(`/notifications/${id}`),
};

// ================================================================
//  WEATHER
// ================================================================
export const weatherApi = {
  getCurrent: (city: string) => get<any>(`/weather/current?city=${encodeURIComponent(city)}`),
  getForecast: (city: string, days = 5) =>
    get<any[]>(`/weather/forecast?city=${encodeURIComponent(city)}&days=${days}`),
  getCurrentByCoords: (lat: number, lon: number) =>
    get<any>(`/weather/current/coords?lat=${lat}&lon=${lon}`),
};

// ================================================================
//  COACHES
// ================================================================
export const coachesApi = {
  findAll: () => get<{ data: any[] }>('/coaches'),
};
