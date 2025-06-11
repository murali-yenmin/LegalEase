import { User } from "@shared/schema";

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export const getStoredAuth = (): AuthState => {
  try {
    const token = localStorage.getItem("token");
    const userStr = localStorage.getItem("user");
    
    if (token && userStr) {
      const user = JSON.parse(userStr);
      return {
        user,
        token,
        isAuthenticated: true
      };
    }
  } catch (error) {
    console.error("Error parsing stored auth:", error);
  }
  
  return {
    user: null,
    token: null,
    isAuthenticated: false
  };
};

export const storeAuth = (token: string, user: User): void => {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
};

export const clearAuth = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export const getAuthHeaders = (): { Authorization?: string } => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};
