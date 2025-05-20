"use client";

import React, { createContext, useContext } from "react";
import { UserType } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCurrentUser } from "@/lib/data/auth";

type AuthContextType = {
  user: UserType | null;
  isLoading: boolean;
  isError: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const {
    data: user,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["get-currentUser"],
    queryFn: getCurrentUser,
  });

  return (
    <AuthContext.Provider
      value={{
        user: user || null,
        isLoading,
        isError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
