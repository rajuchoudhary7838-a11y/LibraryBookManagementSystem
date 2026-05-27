// Django REST Framework API Service
// Backend URL is read from VITE_API_URL in .env — default: http://localhost:8000/api

export const API_BASE_URL =
  (import.meta as any).env?.VITE_API_URL ??
  'http://localhost:8000/api';

// ─── Token Management ───────────────────────────────────────────────────────

const TOKEN_KEY = 'library_access_token';
const REFRESH_KEY = 'library_refresh_token';

export function getAccessToken(): string | null {
  return localStorage.getItem(TOKEN_KEY);
}

export function setTokens(access: string, refresh: string) {
  localStorage.setItem(TOKEN_KEY, access);
  localStorage.setItem(REFRESH_KEY, refresh);
}

export function clearTokens() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(REFRESH_KEY);
}

// ─── Base Fetch ─────────────────────────────────────────────────────────────

async function refreshAccessToken(): Promise<string | null> {

  const refresh = localStorage.getItem(REFRESH_KEY);

  if (!refresh) return null;

  try {

    const res = await fetch(
      `${API_BASE_URL}/auth/token/refresh/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ refresh }),
      }
    );

    if (!res.ok) return null;

    const data = await res.json();

    localStorage.setItem(TOKEN_KEY, data.access);

    return data.access;

  } catch {

    return null;

  }
}

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

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  console.log('API CALL:', `${API_BASE_URL}${endpoint}`);

  const res = await fetch(
    `${API_BASE_URL}${endpoint}`,
    {
      ...options,
      headers,
    }
  );

  if (res.status === 401 && retry) {

    const newToken = await refreshAccessToken();

    if (newToken) {
      return apiFetch<T>(endpoint, options, false);
    }

    clearTokens();

    throw new Error('Session expired. Please log in again.');
  }

  if (!res.ok) {

    const errorData = await res.json().catch(() => ({}));

    console.log('API ERROR:', errorData);

    const message =
      errorData.detail ||
      errorData.message ||
      errorData.non_field_errors?.[0] ||
      `HTTP ${res.status}`;

    throw new Error(message);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  return res.json();
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export interface ApiUser {
  id: string;
  name: string;
  email: string;
  role: 'student' | 'librarian';
  phone: string;
  profile_image: string;
}

export interface LoginResponse {
  access: string;
  refresh: string;
  user: ApiUser;
}

export const authApi = {

  login: (
    email: string,
    password: string
  ) =>
    apiFetch<LoginResponse>(
      '/auth/login/',
      {
        method: 'POST',
        body: JSON.stringify({
          email,
          password,
        }),
      }
    ),

  register: (
    name: string,
    email: string,
    password: string
  ) =>
    apiFetch<LoginResponse>(
      '/auth/register/',
      {
        method: 'POST',
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    ),

  logout: () =>
    apiFetch<void>(
      '/auth/logout/',
      {
        method: 'POST',
      }
    ).catch(() => {}),

  getProfile: () =>
    apiFetch<ApiUser>(
      '/auth/profile/'
    ),

  updateProfile: (
    data: Partial<ApiUser>
  ) =>
    apiFetch<ApiUser>(
      '/auth/profile/',
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),
};

// ─── Books ──────────────────────────────────────────────────────────────────

export interface ApiBook {
  id: string;
  title: string;
  author: string;
  category: string;
  isbn: string;
  quantity: number;
  available_quantity: number;
  description: string;
  image: string;
  thumbnail: string;
  published_date: string;
}

interface Paginated<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

async function apiList<T>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T[]> {

  const data = await apiFetch<Paginated<T> | T[]>(
    endpoint,
    options
  );

  if (Array.isArray(data)) {
    return data;
  }

  if (
    'results' in data &&
    Array.isArray(data.results)
  ) {
    return data.results;
  }

  throw new Error(
    'Unexpected list response format'
  );
}

export const booksApi = {

  list: (
    params?: {
      search?: string;
      category?: string;
    }
  ) => {

    const query = new URLSearchParams();

    if (params?.search) {
      query.set('search', params.search);
    }

    if (
      params?.category &&
      params.category !== 'all'
    ) {
      query.set('category', params.category);
    }

    const qs = query.toString();

    return apiList<ApiBook>(
      `/books/${qs ? `?${qs}` : ''}`
    );
  },

  get: (id: string) =>
    apiFetch<ApiBook>(
      `/books/${id}/`
    ),

  create: (
    data: Omit<ApiBook, 'id'>
  ) =>
    apiFetch<ApiBook>(
      '/books/',
      {
        method: 'POST',
        body: JSON.stringify(data),
      }
    ),

  update: (
    id: string,
    data: Partial<ApiBook>
  ) =>
    apiFetch<ApiBook>(
      `/books/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify(data),
      }
    ),

  delete: (id: string) =>
    apiFetch<void>(
      `/books/${id}/`,
      {
        method: 'DELETE',
      }
    ),
};

// ─── Requests ───────────────────────────────────────────────────────────────

export interface ApiRequest {

  id: string;

  student_id: string;
  student_name?: string;

  book_id: string;
  book_title?: string;
  book_thumbnail?: string;

  status:
    | 'pending'
    | 'approved'
    | 'declined'
    | 'returned';

  request_date: string;
  approved_date?: string;
  return_date?: string;
  due_date?: string;
}

export const requestsApi = {

  // GET ALL REQUESTS
  list: () =>
    apiList<ApiRequest>(
      '/requests/'
    ),

  // CREATE REQUEST
  create: (bookId: string) =>
    apiFetch<ApiRequest>(
      '/requests/',
      {
        method: 'POST',
        body: JSON.stringify({
          book_id: bookId,
        }),
      }
    ),

  // APPROVE
  approve: async (id: string) => {

    console.log('APPROVE:', id);

    return apiFetch<ApiRequest>(
      `/requests/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'approved',
        }),
      }
    );
  },

  // DECLINE
  decline: async (id: string) => {

    console.log('DECLINE:', id);

    return apiFetch<ApiRequest>(
      `/requests/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'declined',
        }),
      }
    );
  },

  // RETURN
  markReturned: async (id: string) => {

    console.log('RETURN:', id);

    return apiFetch<ApiRequest>(
      `/requests/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'returned',
        }),
      }
    );
  },

  // CANCEL
  cancel: async (id: string) => {

    console.log('CANCEL:', id);

    return apiFetch<void>(
      `/requests/${id}/`,
      {
        method: 'DELETE',
      }
    );
  },
};

// ─── Fines ──────────────────────────────────────────────────────────────────

export interface ApiFine {
  id: string;
  student_id: string;
  amount: number;
  status: 'pending' | 'paid';
  payment_date?: string;
  reason: string;
}

export const finesApi = {

  list: () =>
    apiList<ApiFine>(
      '/fines/'
    ),

  pay: (id: string) =>
    apiFetch<ApiFine>(
      `/fines/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'paid',
        }),
      }
    ),
};

// ─── Users ──────────────────────────────────────────────────────────────────

export const usersApi = {

  list: () =>
    apiList<ApiUser>(
      '/users/'
    ),

  get: (id: string) =>
    apiFetch<ApiUser>(
      `/users/${id}/`
    ),

  suspend: (id: string) =>
    apiFetch<ApiUser>(
      `/users/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_active: false,
        }),
      }
    ),

  activate: (id: string) =>
    apiFetch<ApiUser>(
      `/users/${id}/`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          is_active: true,
        }),
      }
    ),
};

// ─── API Health Check ───────────────────────────────────────────────────────

export async function checkApiHealth(): Promise<boolean> {

  try {

    const res = await fetch(
      `${API_BASE_URL}/health/`,
      {
        signal: AbortSignal.timeout(3000),
      }
    );

    return res.ok;

  } catch {

    return false;

  }
}

// ─── Reports ────────────────────────────────────────────────────────────────

export interface ApiStats {
  total_books: number;
  total_users: number;
  pending_requests: number;
  active_loans: number;
  overdue_loans: number;
  total_fines_pending: number;
}

export const reportsApi = {

  stats: () =>
    apiFetch<ApiStats>(
      '/reports/stats/'
    ),
};