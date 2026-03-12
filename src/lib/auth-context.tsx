"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { User, usersStorage, sessionStorage as session, simpleHash } from "./storage";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => { success: boolean; error?: string };
  signup: (email: string, password: string, name: string, extra?: {
    businessName?: string;
    businessCategory?: string;
    location?: string;
    naverPlaceUrl?: string;
  }) => { success: boolean; error?: string };
  logout: () => void;
  updateProfile: (data: Partial<Omit<User, 'id' | 'createdAt'>>) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // On mount: check localStorage for existing session
  useEffect(() => {
    const userId = session.get();
    if (userId) {
      const existingUser = usersStorage.getById(userId);
      if (existingUser) {
        setUser(existingUser);
      } else {
        // Invalid session, clear it
        session.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback((email: string, password: string): { success: boolean; error?: string } => {
    const existingUser = usersStorage.getByEmail(email);
    if (!existingUser) {
      return { success: false, error: "등록되지 않은 이메일입니다." };
    }

    const hashedPassword = simpleHash(password);
    if (existingUser.password !== hashedPassword) {
      return { success: false, error: "비밀번호가 일치하지 않습니다." };
    }

    session.set(existingUser.id);
    setUser(existingUser);
    return { success: true };
  }, []);

  const signup = useCallback((
    email: string,
    password: string,
    name: string,
    extra?: {
      businessName?: string;
      businessCategory?: string;
      location?: string;
      naverPlaceUrl?: string;
    }
  ): { success: boolean; error?: string } => {
    // Check if email already exists
    const existing = usersStorage.getByEmail(email);
    if (existing) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }

    const hashedPassword = simpleHash(password);
    const newUser = usersStorage.create({
      email,
      password: hashedPassword,
      name,
      businessName: extra?.businessName,
      businessCategory: extra?.businessCategory,
      location: extra?.location,
      naverPlaceUrl: extra?.naverPlaceUrl,
    });

    session.set(newUser.id);
    setUser(newUser);
    return { success: true };
  }, []);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<Omit<User, 'id' | 'createdAt'>>): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

    // If changing password, hash it
    const updateData = { ...data };
    if (updateData.password) {
      updateData.password = simpleHash(updateData.password);
    }

    const updated = usersStorage.update(user.id, updateData);
    if (!updated) {
      return { success: false, error: "프로필 업데이트에 실패했습니다." };
    }

    setUser(updated);
    return { success: true };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        signup,
        logout,
        updateProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
