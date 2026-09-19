import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string) => void;
  logout: () => void;
  isAuthModalOpen: boolean;
  setIsAuthModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default logged in test customer for instant frictionless preview
  const [user, setUser] = useState<User | null>({
    id: 2,
    email: 'user@ghartak.com',
    fullName: 'Shubham Kumar',
    phone: '9811223344',
    address: 'Lake Road, Matwari',
    city: 'Hazaribagh (Main Town)',
    pincode: '825301',
    role: 'CUSTOMER'
  });
  const [token, setToken] = useState<string | null>('mock-jwt-token-ghartak');
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);

  const login = (userData: User, authToken: string) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem('ghartak_token', authToken);
    localStorage.setItem('ghartak_user', JSON.stringify(userData));
    setIsAuthModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('ghartak_token');
    localStorage.removeItem('ghartak_user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        login,
        logout,
        isAuthModalOpen,
        setIsAuthModalOpen
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
