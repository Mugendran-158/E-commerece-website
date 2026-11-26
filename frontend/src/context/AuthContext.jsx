import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load persisted auth from localStorage
    try {
      const savedUser = localStorage.getItem('shopease_user');
      const savedToken = localStorage.getItem('shopease_token');
      if (savedUser && savedToken) {
        setUser(JSON.parse(savedUser));
        setToken(savedToken);
      }
    } catch (e) {
      console.error('Failed to parse auth token:', e);
      localStorage.removeItem('shopease_user');
      localStorage.removeItem('shopease_token');
    } finally {
      setLoading(false);
    }
  }, []);

  const saveAuth = (userData, jwtToken) => {
    setUser(userData);
    setToken(jwtToken);
    localStorage.setItem('shopease_user', JSON.stringify(userData));
    localStorage.setItem('shopease_token', jwtToken);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('shopease_user');
    localStorage.removeItem('shopease_token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('shopease_user', JSON.stringify(updatedUser));
  };

  const isAuthenticated = Boolean(token && user);
  const isAdmin = Boolean(user && (user.role === 'ADMIN' || user.role === 'ROLE_ADMIN'));

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated,
        isAdmin,
        saveAuth,
        logout,
        updateUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
