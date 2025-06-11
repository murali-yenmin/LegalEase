import { useState, useEffect } from "react";
import { User } from "@shared/schema";
import { getStoredAuth, storeAuth, clearAuth } from "@/lib/auth";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true
  });

  useEffect(() => {
    const storedAuth = getStoredAuth();
    setAuthState({
      ...storedAuth,
      isLoading: false
    });
  }, []);

  const login = (token: string, user: User) => {
    storeAuth(token, user);
    setAuthState({
      user,
      token,
      isAuthenticated: true,
      isLoading: false
    });
  };

  const logout = () => {
    clearAuth();
    setAuthState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false
    });
  };

  const hasRole = (roles: string | string[]): boolean => {
    if (!authState.user) return false;
    const userRole = authState.user.role;
    if (Array.isArray(roles)) {
      return roles.includes(userRole);
    }
    return userRole === roles;
  };

  const hasPermission = (permission: string): boolean => {
    if (!authState.user) return false;
    
    // Admin has all permissions
    if (authState.user.role === "admin") return true;
    
    // Add more permission logic as needed
    return true;
  };

  return {
    ...authState,
    login,
    logout,
    hasRole,
    hasPermission
  };
};
