"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Role } from "@/lib/navigation";

interface LoginRequest {
  email: string;
  password: string;
  role?: string;
}

interface RegisterPayload {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: string;
}

interface AuthUser {
  id: string;
  email: string;
  username: string;
  roles: Role[];
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
  roles: string[];
  isBanned: boolean;
}): AuthUser => ({
  id: String(data.userId),
  email: data.email,
  username: data.username,
  roles: (data.roles ?? []) as Role[],
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
        const parsed = JSON.parse(raw) as {
          userId: number;
          email: string;
          username: string;
          roles: string[];
          isBanned: boolean;
        };
        setUser(mapSessionToUser(parsed));
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (credentials: LoginRequest) => {
    // MOCK IMPLEMENTATION (Wait 1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate successful response
    const mockData = {
      userId: 1,
      email: credentials.email,
      username: credentials.email.split("@")[0],
      roles: [credentials.role || "FARMER"], // Use selected role or fallback to FARMER
      isBanned: false,
    };

    localStorage.setItem("user", JSON.stringify(mockData));
    localStorage.setItem("token", "mock-jwt-token");
    setUser(mapSessionToUser(mockData));
    router.push("/dashboard");
  };

  const register = async (payload: RegisterPayload) => {
    // MOCK IMPLEMENTATION (Wait 1s)
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Simulate successful response
    const mockData = {
      userId: Math.floor(Math.random() * 1000) + 1,
      email: payload.email,
      username: payload.username,
      roles: [payload.role || "FARMER"],
      isBanned: false,
    };

    localStorage.setItem("user", JSON.stringify(mockData));
    localStorage.setItem("token", "mock-jwt-token");
    setUser(mapSessionToUser(mockData));
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
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