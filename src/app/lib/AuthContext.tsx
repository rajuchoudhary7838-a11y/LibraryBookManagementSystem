import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, mockUsers } from './mockData';
import { authApi, setTokens, clearTokens, getAccessToken, checkApiHealth } from './api';

interface AuthContextType {
  user: User | null;
  isApiConnected: boolean;
  hasCheckedApi: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  register: (name: string, email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function apiUserToLocal(apiUser: { id: string; name: string; email: string; role: 'student' | 'librarian'; phone: string; profile_image: string }): User {
  return {
    id: apiUser.id,
    name: apiUser.name,
    email: apiUser.email,
    role: apiUser.role,
    phone: apiUser.phone || '',
    profileImage: apiUser.profile_image || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('library_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [isApiConnected, setIsApiConnected] = useState(false);
  const [hasCheckedApi, setHasCheckedApi] = useState(false);

  useEffect(() => {
    checkApiHealth()
      .then((connected) => setIsApiConnected(connected))
      .finally(() => setHasCheckedApi(true));
  }, []);

  // If token exists and API is up, re-validate the session
  useEffect(() => {
    if (!hasCheckedApi || !isApiConnected || !getAccessToken()) return;
    authApi.getProfile()
      .then((apiUser) => {
        const localUser = apiUserToLocal(apiUser);
        setUser(localUser);
        localStorage.setItem('library_user', JSON.stringify(localUser));
      })
      .catch(() => {
        // Token invalid — fall through to whatever is in localStorage
      });
  }, [isApiConnected]);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Try Django API first while backend health is still being resolved,
    // so we don't prematurely fall back to mock auth.
    if (!hasCheckedApi || isApiConnected) {
      try {
        const { access, refresh, user: apiUser } = await authApi.login(email, password);
        setTokens(access, refresh);
        const localUser = apiUserToLocal(apiUser);
        setUser(localUser);
        localStorage.setItem('library_user', JSON.stringify(localUser));
        return true;
      } catch {
        // Fall through to mock login
      }
    }

    // Mock fallback
    const found = mockUsers.find((u) => u.email === email);
    if (found) {
      setUser(found);
      localStorage.setItem('library_user', JSON.stringify(found));
      return true;
    }
    return false;
  };

  const logout = () => {
    if (isApiConnected) authApi.logout();
    clearTokens();
    setUser(null);
    localStorage.removeItem('library_user');
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    if (!hasCheckedApi || isApiConnected) {
      try {
        const { access, refresh, user: apiUser } = await authApi.register(name, email, password);
        setTokens(access, refresh);
        const localUser = apiUserToLocal(apiUser);
        setUser(localUser);
        localStorage.setItem('library_user', JSON.stringify(localUser));
        return true;
      } catch {
        // Fall through to mock register
      }
    }

    // Mock fallback — always creates a student account
    const newUser: User = {
      id: `user_${Date.now()}`,
      name,
      email,
      role: 'student',
      phone: '',
      profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    };
    setUser(newUser);
    localStorage.setItem('library_user', JSON.stringify(newUser));
    return true;
  };

  return (
    <AuthContext.Provider value={{ user, isApiConnected, hasCheckedApi, login, logout, register }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider');
  return ctx;
}
