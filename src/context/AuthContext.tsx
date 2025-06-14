"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { AuthContextType } from "@/types/auth";
import { UserPayload } from "@/lib/auth";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { readonly children: ReactNode }) {
  const [user, setUser] = useState<UserPayload | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/me", {
        // Đảm bảo cookies được gửi kèm
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Auth check response status:", response.status);

      if (response.ok) {
        const userData = await response.json();
        console.log("Auth check success:", userData);
        setUser(userData.user);
      } else {
        console.log("Auth check failed:", response.status, response.statusText);
        setUser(null);
      }
    } catch (error) {
      console.error("Auth check failed:", error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const checkTokenValidity = async (): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/me", {
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        setUser(null);
        return false;
      }
      const data = await response.json();
      setUser(data.user);
      return true;
    } catch (error) {
      console.error("Token check failed:", error);
      setUser(null);
      return false;
    }
  };

  const login = async (email: string, password: string) => {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      credentials: "include", // Đảm bảo cookies được gửi kèm
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Login response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Login failed");
    }

    const data = await response.json();
    console.log("Login success:", data);
    setUser(data.user);

    // Kiểm tra lại auth sau khi login
    setTimeout(() => {
      checkAuth();
    }, 100);
  };

  const register = async (email: string, password: string) => {
    const response = await fetch("/api/auth/register", {
      method: "POST",
      credentials: "include", // Đảm bảo cookies được gửi kèm
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    console.log("Register response status:", response.status);

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message ?? "Registration failed");
    }

    const data = await response.json();
    console.log("Register success:", data);
    setUser(data.user);

    // Kiểm tra lại auth sau khi register
    setTimeout(() => {
      checkAuth();
    }, 100);
  };

  const logout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include", // Đảm bảo cookies được gửi kèm
      });
      console.log("Logout success");
    } catch (error) {
      console.error("Logout error:", error);
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, logout, loading, checkTokenValidity }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
