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
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, name: string, extra?: {
    businessName?: string;
    businessCategory?: string;
    location?: string;
    naverPlaceUrl?: string;
  }) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  updateProfile: (data: Partial<Omit<User, 'id' | 'createdAt'>>) => { success: boolean; error?: string };
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userId = session.get();
    if (userId) {
      const existingUser = usersStorage.getById(userId);
      if (existingUser) {
        setUser(existingUser);
      } else {
        session.clear();
      }
    }
    setIsLoading(false);
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const existingUser = usersStorage.getByEmail(email);
    if (!existingUser) {
      return { success: false, error: "등록되지 않은 이메일입니다." };
    }

    // bcrypt hash verification via API
    if (existingUser.password.startsWith("$2")) {
      try {
        const res = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, storedHash: existingUser.password }),
        });
        if (res.ok) {
          session.set(existingUser.id);
          setUser(existingUser);
          return { success: true };
        }
        const data = await res.json();
        return { success: false, error: data.error || "로그인에 실패했습니다." };
      } catch {
        return { success: false, error: "서버 연결에 실패했습니다." };
      }
    }

    // Legacy simpleHash fallback
    const hashedPassword = simpleHash(password);
    if (existingUser.password !== hashedPassword) {
      return { success: false, error: "비밀번호가 일치하지 않습니다." };
    }

    session.set(existingUser.id);
    setUser(existingUser);
    return { success: true };
  }, []);

  const signup = useCallback(async (
    email: string,
    password: string,
    name: string,
    extra?: {
      businessName?: string;
      businessCategory?: string;
      location?: string;
      naverPlaceUrl?: string;
    }
  ): Promise<{ success: boolean; error?: string }> => {
    const existing = usersStorage.getByEmail(email);
    if (existing) {
      return { success: false, error: "이미 등록된 이메일입니다." };
    }

    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, name, ...extra }),
      });

      if (!res.ok) {
        const data = await res.json();
        return { success: false, error: data.error || "회원가입에 실패했습니다." };
      }

      const { hashedPassword } = await res.json();

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
    } catch {
      // Fallback
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
    }
  }, []);

  const logout = useCallback(() => {
    session.clear();
    setUser(null);
  }, []);

  const updateProfile = useCallback((data: Partial<Omit<User, 'id' | 'createdAt'>>): { success: boolean; error?: string } => {
    if (!user) {
      return { success: false, error: "로그인이 필요합니다." };
    }

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
