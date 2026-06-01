import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../Services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      authApi.me()
        .then(u => setUser(u))
        .catch(() => localStorage.removeItem('token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (username, password) => {
    const { access_token } = await authApi.login(username, password);
    localStorage.setItem('token', access_token);
    const u = await authApi.me();
    setUser(u);
    return u;
  }, []);

  const register = useCallback(async (data) => {
    await authApi.register(data);
    return login(data.username, data.password);
  }, [login]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
