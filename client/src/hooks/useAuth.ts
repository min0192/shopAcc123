import { useState, useEffect } from 'react';
import { getCookie } from 'cookies-next/client';
import jwt from 'jsonwebtoken';

import { userJwtPayload } from "@/types/userJwtPayload";

interface AuthState {
  token: string | null;
  user: userJwtPayload | null;
} 

// Hàm lấy cookie theo tên
// function getCookie(name: string): string | null {
//   if (typeof document === 'undefined') return null;
//   const value = `; ${document.cookie}`;
//   const parts = value.split(`; ${name}=`);
//   if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
//   return null;
// }

// // Hàm set cookie
// function setCookie(name: string, value: string, days: number = 1) {
//   const maxAge = days * 24 * 60 * 60;
//   document.cookie = `${name}=${value}; path=/; max-age=${maxAge}; SameSite=Strict`;
// }

// // Hàm xóa cookie
// function deleteCookie(name: string) {
//   document.cookie = `${name}=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
// }

export function useAuth() {
  const [authState, setAuthState] = useState<AuthState>({
    token: null,
    user: null
  });

  useEffect(() => {
    // Lấy token từ cookie 'info'
    const token = getCookie('info') as string | undefined;
    let user: userJwtPayload | null = null;

    if (token) {
      try {
        user = jwt.decode(token) as userJwtPayload;
      } catch (error) {
        console.error('Error decoding token:', error);
        user = null;
      }
    }

    setAuthState({
      token: token || null,
      user
    });
  }, []);

  const login = (token: string) => {
    // Lưu token vào cookie 'info'
    document.cookie = `info=${token}; path=/;`;
    // Giải mã user từ token
    let user: userJwtPayload | null = null;
    try {
      user = jwt.decode(token) as userJwtPayload;
    } catch (error) {
      console.error('Error decoding token:', error);
      user = null;
    }
    setAuthState({
      token,
      user
    });
  };

  const logout = () => {
    // Xóa cookie 'info'
    document.cookie = `info=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    setAuthState({
      token: null,
      user: null
    });
  };

  return {
    token: authState.token,
    user: authState.user,
    isAuthenticated: !!authState.token,
    login,
    logout
  };
}
