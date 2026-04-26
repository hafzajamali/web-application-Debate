import { createContext, useState, useContext, useEffect } from 'react';
import { getProfile } from '../services/authService';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(null);
  const [loading, setLoading] = useState(true);

  // On app load: restore user from token
  useEffect(() => {
    const token = localStorage.getItem('debateai_token');
    if (token) {
      getProfile()
        .then(res => setUser(res.data))
        .catch(() => localStorage.removeItem('debateai_token'))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const loginUser = (userData, token) => {
    localStorage.setItem('debateai_token', token);
    setUser(userData);
  };

  const logoutUser = () => {
    localStorage.removeItem('debateai_token');
    setUser(null);
  };

  const refreshUser = async () => {
    try {
      const res = await getProfile();
      setUser(res.data);
    } catch {}
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loginUser, logoutUser, refreshUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
