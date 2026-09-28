import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { TransportLine, CoverageRequest, NewLineSubmission } from "../types";
import { INITIAL_LINES, ADMIN_CODE } from "../data/initialData";
import { supabaseService, isSupabaseConfigured } from "../lib/supabase";

interface PlatformContextType {
  lines: TransportLine[];
  activeLines: TransportLine[];
  vipLines: TransportLine[];
  pendingLines: TransportLine[];
  coverageRequests: CoverageRequest[];
  isAdmin: boolean;
  signIn: (code: string) => boolean;
  signOut: () => void;
  submitLine: (data: NewLineSubmission) => TransportLine;
  approveLine: (id: string, asVip: boolean) => void;
  rejectLine: (id: string) => void;
  toggleVip: (id: string) => void;
  removeLine: (id: string) => void;
  submitCoverageRequest: (data: Omit<CoverageRequest, "id" | "createdAt">) => CoverageRequest;
  resetDemoData: () => void;
}

const LINES_KEY = "khutoot.lines.v1";
const REQUESTS_KEY = "khutoot.requests.v1";
const ADMIN_KEY = "khutoot.admin.v1";

function loadStorage<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`تعذر قراءة البيانات المحلية (${key})`, err);
    return fallback;
  }
}

function saveStorage<T>(key: string, data: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(data));
  } catch (err) {
    console.warn(`تعذر حفظ البيانات المحلية (${key})`, err);
  }
}

const PlatformContext = createContext<PlatformContextType | null>(null);

export function PlatformProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<TransportLine[]>(() => loadStorage(LINES_KEY, INITIAL_LINES));
  const [coverageRequests, setCoverageRequests] = useState<CoverageRequest[]>(() =>
    loadStorage(REQUESTS_KEY, [])
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => loadStorage(ADMIN_KEY, false));

  useEffect(() => {
    saveStorage(LINES_KEY, lines);
  }, [lines]);

  useEffect(() => {
    saveStorage(REQUESTS_KEY, coverageRequests);
  }, [coverageRequests]);

  useEffect(() => {
    saveStorage(ADMIN_KEY, isAdmin);
  }, [isAdmin]);

  // Sync with Supabase on mount if configured
  useEffect(() => {
    if (!isSupabaseConfigured) return;
    supabaseService.getLines().then((remoteLines) => {
      if (remoteLines && remoteLines.length > 0) {
        const formatted: TransportLine[] = remoteLines.map((row: any) => ({
          id: row.id,
          universityId: row.university_id,
          driverName: row.driver_name,
          driverPhone: row.driver_phone,
          fromArea: row.from_area,
          toArea: row.to_area,
          seatsAvailable: row.seats_available,
          monthlyPrice: row.monthly_price,
          departTime: row.depart_time,
          returnTime: row.return_time,
          vehicle: {
            kind: row.vehicle_type === "فان" ? "van" : row.vehicle_type === "باص" ? "bus" : "sedan",
            model: row.vehicle_model,
            seats: row.total_seats || 4,
          },
          gender: "mixed",
          shift: row.morning_shift && row.evening_shift ? "full" : row.evening_shift ? "evening" : "morning",
          hasAc: row.air_conditioned ?? true,
          isPunctual: (row.punctuality || 95) > 90,
          isVip: row.is_vip || false,
          vipRequested: row.is_vip || false,
          vipFeePaid: row.is_vip || false,
          status: (row.status === "approved" ? "active" : row.status || "active") as any,
          startPoint: { lat: 30.5085, lng: 47.7804 },
          createdAt: row.created_at,
          rating: 4.9,
          ratingCount: 12,
        }));
        setLines(formatted);
      }
    });
  }, []);

  const signIn = useCallback((code: string) => {
    const valid = code.trim() === ADMIN_CODE;
    if (valid) setIsAdmin(true);
    return valid;
  }, []);

  const signOut = useCallback(() => {
    setIsAdmin(false);
  }, []);

  const submitLine = useCallback((data: NewLineSubmission) => {
    const newLine: TransportLine = {
      ...data,
      id: `ln-${Date.now().toString(36)}`,
      rating: 0,
      ratingCount: 0,
      status: "pending",
      isVip: false,
      vipFeePaid: data.vipRequested,
      createdAt: new Date().toISOString(),
    };
    setLines((prev) => [newLine, ...prev]);
    return newLine;
  }, []);

  const approveLine = useCallback((id: string, asVip: boolean) => {
    setLines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "active", isVip: asVip, vipFeePaid: asVip } : item
      )
    );
  }, []);

  const rejectLine = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "rejected", isVip: false } : item
      )
    );
  }, []);

  const toggleVip = useCallback((id: string) => {
    setLines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, isVip: !item.isVip } : item))
    );
  }, []);

  const removeLine = useCallback((id: string) => {
    setLines((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const submitCoverageRequest = useCallback(
    (data: Omit<CoverageRequest, "id" | "createdAt">) => {
      const newRequest: CoverageRequest = {
        ...data,
        id: `rq-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      setCoverageRequests((prev) => [newRequest, ...prev]);
      return newRequest;
    },
    []
  );

  const resetDemoData = useCallback(() => {
    setLines(INITIAL_LINES);
    setCoverageRequests([]);
  }, []);

  const activeLines = useMemo(() => lines.filter((line) => line.status === "active"), [lines]);
  const vipLines = useMemo(() => activeLines.filter((line) => line.isVip), [activeLines]);
  const pendingLines = useMemo(() => lines.filter((line) => line.status === "pending"), [lines]);

  const value = useMemo(
    () => ({
      lines,
      activeLines,
      vipLines,
      pendingLines,
      coverageRequests,
      isAdmin,
      signIn,
      signOut,
      submitLine,
      approveLine,
      rejectLine,
      toggleVip,
      removeLine,
      submitCoverageRequest,
      resetDemoData,
    }),
    [
      lines,
      activeLines,
      vipLines,
      pendingLines,
      coverageRequests,
      isAdmin,
      signIn,
      signOut,
      submitLine,
      approveLine,
      rejectLine,
      toggleVip,
      removeLine,
      submitCoverageRequest,
      resetDemoData,
    ]
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

export function usePlatform() {
  const context = useContext(PlatformContext);
  if (!context) {
    throw new Error("usePlatform must be used inside PlatformProvider");
  }
  return context;
}
