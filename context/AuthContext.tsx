"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/navigation";
import axiosInstance from "@/utils/axiosInstance";
import apiPaths from "@/utils/apiPaths";

interface LoginRequest {
  email: string;
  password: string;
}

interface RegisterPayload {
  email: string;
  username: string;
  password: string;
  role: string;
}

interface AuthUser {
  id: string;
  email: string;
  username: string;
  role: Role | null;
  isBanned: boolean;
}

interface AuthContextType {
  user: AuthUser | null;
  login: (credentials: LoginRequest) => Promise<void>;
  register: (payload: RegisterPayload) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(null);

const mapSessionToUser = (data: {
  userId: number;
  email: string;
  username: string;
  role: string;
  isBanned: boolean;
}): AuthUser => ({
  id: String(data.userId),
  email: data.email,
  username: data.username,
  role: data.role ? (data.role as Role) : null,
  isBanned: data.isBanned,
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (raw) {
        const parsed = JSON.parse(raw);
        setUser(mapSessionToUser(parsed));
      }
    } catch (e) {
      console.error("Failed to parse user from local storage", e);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const startSession = async (path: string, body: LoginRequest | RegisterPayload) => {
    const { data } = await axiosInstance.post(path, body);

    localStorage.setItem("user", JSON.stringify(data));
    localStorage.setItem("token", data.token);
    if (data.refreshToken) {
      localStorage.setItem("refreshToken", data.refreshToken);
    }

    setUser(mapSessionToUser(data));
    router.push("/dashboard");
  };

  const login = (credentials: LoginRequest) =>
    startSession(apiPaths.auth.login, credentials);

  const register = (payload: RegisterPayload) =>
    startSession(apiPaths.auth.register, payload);

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setUser(null);
    router.push("/auth");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};