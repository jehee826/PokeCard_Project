import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  loginId: string | null;
  login: (token: string, loginId: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * JWT의 만료 여부를 확인하는 헬퍼 함수
 */
const isTokenValid = (token: string): boolean => {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    if (payload.exp) {
      return payload.exp * 1000 > Date.now();
    }
    return true;
  } catch (error) {
    return false;
  }
};

/**
 * JWT에서 loginId(sub)를 추출하는 헬퍼 함수
 */
const getLoginIdFromToken = (token: string): string | null => {
  try {
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    return payload.sub || null;
  } catch (error) {
    return null;
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token && isTokenValid(token)) {
        return true;
      }
      if (token) sessionStorage.removeItem('accessToken');
    }
    return false;
  });

  const [loginId, setLoginId] = useState<string | null>(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token && isTokenValid(token)) {
        return getLoginIdFromToken(token);
      }
    }
    return null;
  });

  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === 'accessToken' && !e.newValue) {
        setIsLoggedIn(false);
        setLoginId(null);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (token: string, loginId: string) => {
    sessionStorage.setItem('accessToken', token);
    setIsLoggedIn(true);
    setLoginId(loginId);
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
    setLoginId(null);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, loginId, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};