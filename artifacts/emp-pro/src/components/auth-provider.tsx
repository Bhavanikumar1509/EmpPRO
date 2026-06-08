import React, { createContext, useContext, useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useGetCurrentUser, UserProfile } from "@workspace/api-client-react";
import { getToken, removeToken } from "@/lib/auth";

type AuthContextType = {
  user: UserProfile | null;
  isLoading: boolean;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const token = getToken();
  const { data: user, isLoading, isError } = useGetCurrentUser({
    query: {
      enabled: !!token,
      retry: false,
    }
  });

  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!isLoading) {
      setInitialLoading(false);
    }
  }, [isLoading]);

  useEffect(() => {
    if (isError) {
      removeToken();
      setLocation("/login");
    }
  }, [isError, setLocation]);

  const logout = () => {
    removeToken();
    setLocation("/login");
  };

  return (
    <AuthContext.Provider value={{ user: user || null, isLoading: initialLoading, logout }}>
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
