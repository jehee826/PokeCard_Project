import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// 타입 정의
interface AuthContextType {
  isLoggedIn: boolean;
  login: (token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * JWT의 만료 여부를 확인하는 헬퍼 함수
 */
const isTokenValid = (token: string): boolean => {
  try {
    // JWT는 [header].[payload].[signature] 구조입니다.
    // payload를 디코딩하여 만료 시간(exp)을 확인합니다.
    const payload = JSON.parse(window.atob(token.split('.')[1]));
    if (payload.exp) {
      // payload.exp는 초 단위이므로 1000을 곱해 밀리초로 변환합니다.
      return payload.exp * 1000 > Date.now();
    }
    return true; // exp 필드가 없다면 일단 true 반환 (서버 정책에 따라 조절)
  } catch (error) {
    return false; // 파싱 실패 시 유효하지 않은 토큰으로 간주
  }
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // ✅ 수정 1: Lazy Initialization (지연 초기화)
  // 앱이 로드되는 순간 딱 한 번만 실행되어 '깜빡임' 없이 초기 상태를 결정합니다.
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const token = sessionStorage.getItem('accessToken');
      if (token && isTokenValid(token)) {
        return true;
      }
      // 유효하지 않은 토큰이 들어있다면 미리 정리합니다.
      if (token) sessionStorage.removeItem('accessToken');
    }
    return false;
  });

  // ✅ 수정 2: 멀티 탭 동기화
  // 사용자가 다른 탭에서 로그아웃했을 때 현재 탭도 자동으로 상태를 맞춥니다.
  useEffect(() => {
    const syncLogout = (e: StorageEvent) => {
      if (e.key === 'accessToken' && !e.newValue) {
        setIsLoggedIn(false);
      }
    };
    window.addEventListener('storage', syncLogout);
    return () => window.removeEventListener('storage', syncLogout);
  }, []);

  const login = (token: string) => {
    sessionStorage.setItem('accessToken', token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
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