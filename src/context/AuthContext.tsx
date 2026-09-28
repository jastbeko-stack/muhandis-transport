import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { AuthUser, UserRole } from "../types";
import { UNIVERSITIES, AREAS } from "../data/initialData";
import { supabaseService, isSupabaseConfigured } from "../lib/supabase";

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  loginWithPhone: (phone: string, role: UserRole, name?: string) => Promise<boolean>;
  loginWithEmail: (email: string, password: string, role: UserRole) => Promise<boolean>;
  register: (data: Omit<AuthUser, "id">) => Promise<boolean>;
  logout: () => void;
  switchRole: (newRole: UserRole) => void;
  quickDemoLogin: (role: UserRole) => void;
  updateProfile: (data: Partial<AuthUser>) => void;
}

const AUTH_KEY = "khutoot.auth.user";

function loadSavedUser(): AuthUser | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(loadSavedUser);

  useEffect(() => {
    try {
      if (user) {
        localStorage.setItem(AUTH_KEY, JSON.stringify(user));
      } else {
        localStorage.removeItem(AUTH_KEY);
      }
    } catch (err) {
      console.warn("Failed to persist user auth", err);
    }
  }, [user]);

  const loginWithPhone = useCallback(
    async (phone: string, role: UserRole, name?: string) => {
      const cleanPhone = phone.trim();
      const newUser: AuthUser = {
        id: `usr-${Date.now().toString(36)}`,
        name: name?.trim() || (role === "student" ? "طالب جامعي" : "كابتن الخط"),
        phone: cleanPhone,
        role,
        universityId: role === "student" ? UNIVERSITIES[0].id : undefined,
        area: AREAS[0],
        vehicleModel: role === "driver" ? "صالون كيا سيراتو" : undefined,
        vehicleKind: role === "driver" ? "sedan" : undefined,
        totalSeats: role === "driver" ? 4 : undefined,
      };
      setUser(newUser);

      if (isSupabaseConfigured) {
        try {
          await supabaseService.createProfile({
            phone: cleanPhone,
            name: newUser.name,
            role,
            area: newUser.area || "الزبير",
            vehicle_model: newUser.vehicleModel || null,
            vehicle_kind: newUser.vehicleKind || null,
            total_seats: newUser.totalSeats || 4,
          });
        } catch (err) {
          console.warn("Failed to sync profile to Supabase:", err);
        }
      }

      return true;
    },
    []
  );

  const loginWithEmail = useCallback(
    async (email: string, _password: string, role: UserRole) => {
      const namePart = email.split("@")[0] || (role === "student" ? "طالب جامعي" : "كابتن الخط");
      const newUser: AuthUser = {
        id: `usr-${Date.now().toString(36)}`,
        name: namePart,
        email: email.trim(),
        phone: "07701234567",
        role,
        universityId: role === "student" ? UNIVERSITIES[0].id : undefined,
        area: AREAS[0],
        vehicleModel: role === "driver" ? "صالون تويوتا كورولا" : undefined,
        vehicleKind: role === "driver" ? "sedan" : undefined,
        totalSeats: role === "driver" ? 4 : undefined,
      };
      setUser(newUser);

      if (isSupabaseConfigured) {
        try {
          await supabaseService.createProfile({
            phone: newUser.phone,
            name: newUser.name,
            email: newUser.email,
            role,
            area: newUser.area || "الزبير",
            vehicle_model: newUser.vehicleModel || null,
            vehicle_kind: newUser.vehicleKind || null,
            total_seats: newUser.totalSeats || 4,
          });
        } catch (err) {
          console.warn("Failed to sync profile to Supabase:", err);
        }
      }

      return true;
    },
    []
  );

  const register = useCallback(async (data: Omit<AuthUser, "id">) => {
    const newUser: AuthUser = {
      ...data,
      id: `usr-${Date.now().toString(36)}`,
    };
    setUser(newUser);

    if (isSupabaseConfigured) {
      try {
        await supabaseService.createProfile({
          phone: newUser.phone,
          name: newUser.name,
          email: newUser.email || null,
          role: newUser.role,
          university_id: newUser.universityId || null,
          area: newUser.area || "الزبير",
          vehicle_model: newUser.vehicleModel || null,
          vehicle_kind: newUser.vehicleKind || null,
          total_seats: newUser.totalSeats || 4,
        });
      } catch (err) {
        console.warn("Failed to sync profile to Supabase:", err);
      }
    }

    return true;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
  }, []);

  const switchRole = useCallback((newRole: UserRole) => {
    setUser((prev) => {
      if (!prev) return null;
      return {
        ...prev,
        role: newRole,
        universityId: newRole === "student" ? prev.universityId || UNIVERSITIES[0].id : undefined,
        vehicleModel: newRole === "driver" ? prev.vehicleModel || "صالون كيا سيراتو" : undefined,
      };
    });
  }, []);

  const quickDemoLogin = useCallback((role: UserRole) => {
    if (role === "student") {
      setUser({
        id: "usr-demo-student",
        name: "زينب أحمد الفهد",
        phone: "07801234567",
        role: "student",
        universityId: "uob-karmat",
        area: "الزبير",
      });
    } else {
      setUser({
        id: "usr-demo-driver",
        name: "أبو مصطفى الجابري",
        phone: "07701234567",
        role: "driver",
        area: "الزبير",
        vehicleModel: "فان هيونداي H1",
        vehicleKind: "van",
        totalSeats: 14,
        driverLineId: "ln-001",
      });
    }
  }, []);

  const updateProfile = useCallback((data: Partial<AuthUser>) => {
    setUser((prev) => (prev ? { ...prev, ...data } : null));
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loginWithPhone,
      loginWithEmail,
      register,
      logout,
      switchRole,
      quickDemoLogin,
      updateProfile,
    }),
    [
      user,
      loginWithPhone,
      loginWithEmail,
      register,
      logout,
      switchRole,
      quickDemoLogin,
      updateProfile,
    ]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }
  return context;
}
