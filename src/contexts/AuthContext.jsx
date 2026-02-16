import React, { createContext, useContext } from 'react';

const AuthContext = createContext({
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  // This is a dummy provider and will be replaced by SupabaseAuthProvider.
  // It's kept for simplicity in other components until the full switch.
  const value = {
    isAuthenticated: false,
    login: () => console.log('Login not implemented'),
    logout: () => console.log('Logout not implemented'),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};