import { getAccessToken } from './api';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

async function adminFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getAccessToken();
  const res = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers as Record<string, string>),
    },
  });
  const json = await res.json();
  if (!res.ok) throw new Error(json.message || `Erreur ${res.status}`);
  return (json.data !== undefined ? json.data : json) as T;
}

const get = <T>(url: string) => adminFetch<T>(url);
const post = <T>(url: string, body?: unknown) => adminFetch<T>(url, { method: 'POST', body: JSON.stringify(body) });
const patch = <T>(url: string, body?: unknown) => adminFetch<T>(url, { method: 'PATCH', body: JSON.stringify(body) });
const del = <T>(url: string) => adminFetch<T>(url, { method: 'DELETE' });

export const adminUsersApi = {
  findAll: (page = 1, limit = 20) => get<any>(`/users?page=${page}&limit=${limit}`),
  updateRole: (id: string, role: string) => patch<any>(`/users/${id}/role`, { role }),
  deactivate: (id: string) => del<any>(`/users/${id}`),
};

export const adminProductsApi = {
  findAll: (page = 1) => get<any>(`/products?page=${page}&limit=50`),
  create: (data: Record<string, any>) => post<any>('/products', data),
  update: (id: string, data: Record<string, any>) => patch<any>(`/products/${id}`, data),
  remove: (id: string) => del<any>(`/products/${id}`),
};

export const adminProgramsApi = {
  findAll: () => get<any>('/programs?limit=50'),
  create: (data: Record<string, any>) => post<any>('/programs', data),
  update: (id: string, data: Record<string, any>) => patch<any>(`/programs/${id}`, data),
  remove: (id: string) => del<any>(`/programs/${id}`),
};

export const adminNutritionApi = {
  findAll: () => get<any>('/nutrition/meals?limit=50'),
  create: (data: Record<string, any>) => post<any>('/nutrition/meals', data),
  update: (id: string, data: Record<string, any>) => patch<any>(`/nutrition/meals/${id}`, data),
  remove: (id: string) => del<any>(`/nutrition/meals/${id}`),
};

export const adminGamificationApi = {
  getBadges: () => get<any[]>('/gamification/badges'),
  createBadge: (data: Record<string, any>) => post<any>('/gamification/badges', data),
  getChallenges: () => get<any[]>('/gamification/challenges'),
  createChallenge: (data: Record<string, any>) => post<any>('/gamification/challenges', data),
};

export const adminNotificationsApi = {
  send: (data: { userId: string; type: string; title: string; message: string; icon?: string }) =>
    post<any>('/notifications', data),
};

export const adminStatsApi = {
  getLeaderboard: () => get<any[]>('/users/leaderboard?limit=20'),
  getOrders: () => get<any>('/orders?limit=100'),
};
