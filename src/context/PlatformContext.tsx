import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from "react";
import type { TransportLine, CoverageRequest, NewLineSubmission, StudentLineRequest, DriverRecord } from "../types";
import { INITIAL_LINES, INITIAL_STUDENT_REQUESTS, INITIAL_REGISTERED_DRIVERS, ADMIN_CODE } from "../data/initialData";
import { supabaseService, isSupabaseConfigured } from "../lib/supabase";

interface PlatformContextType {
  lines: TransportLine[];
  activeLines: TransportLine[];
  vipLines: TransportLine[];
  pendingLines: TransportLine[];
  coverageRequests: CoverageRequest[];
  studentRequests: StudentLineRequest[];
  registeredDrivers: DriverRecord[];
  isAdmin: boolean;
  signIn: (code: string) => boolean;
  signOut: () => void;
  submitLine: (data: NewLineSubmission) => TransportLine;
  approveLine: (id: string, asVip: boolean) => void;
  rejectLine: (id: string) => void;
  toggleVip: (id: string) => void;
  removeLine: (id: string) => void;
  updateLineSeats: (id: string, seats: number) => void;
  submitCoverageRequest: (data: Omit<CoverageRequest, "id" | "createdAt">) => CoverageRequest;
  submitStudentRequest: (data: Omit<StudentLineRequest, "id" | "createdAt" | "status">) => StudentLineRequest;
  updateStudentRequestStatus: (id: string, status: "open" | "contacted" | "accepted") => void;
  addDriverRecord: (driver: Omit<DriverRecord, "id" | "registeredAt">) => DriverRecord;
  updateDriverStatus: (id: string, status: "verified" | "pending" | "rejected") => void;
  removeDriverRecord: (id: string) => void;
  resetDemoData: () => void;
}

const LINES_KEY = "khutoot.lines.v1";
const REQUESTS_KEY = "khutoot.requests.v1";
const STUDENT_REQUESTS_KEY = "khutoot.student_requests.v1";
const DRIVERS_KEY = "khutoot.drivers.v1";
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
  const [studentRequests, setStudentRequests] = useState<StudentLineRequest[]>(() =>
    loadStorage(STUDENT_REQUESTS_KEY, INITIAL_STUDENT_REQUESTS)
  );
  const [registeredDrivers, setRegisteredDrivers] = useState<DriverRecord[]>(() =>
    loadStorage(DRIVERS_KEY, INITIAL_REGISTERED_DRIVERS)
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => loadStorage(ADMIN_KEY, false));

  useEffect(() => {
    saveStorage(LINES_KEY, lines);
  }, [lines]);

  useEffect(() => {
    saveStorage(REQUESTS_KEY, coverageRequests);
  }, [coverageRequests]);

  useEffect(() => {
    saveStorage(STUDENT_REQUESTS_KEY, studentRequests);
  }, [studentRequests]);

  useEffect(() => {
    saveStorage(DRIVERS_KEY, registeredDrivers);
  }, [registeredDrivers]);

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
      rating: 5.0,
      ratingCount: 1,
      status: "active",
      isVip: Boolean(data.vipRequested),
      vipFeePaid: Boolean(data.vipRequested),
      createdAt: new Date().toISOString(),
    };
    setLines((prev) => [newLine, ...prev]);

    if (isSupabaseConfigured) {
      supabaseService.createLine({
        id: newLine.id,
        driver_name: newLine.driverName,
        driver_phone: newLine.driverPhone,
        university_id: newLine.universityId,
        from_area: newLine.fromArea,
        to_area: newLine.toArea,
        morning_shift: newLine.shift === "morning" || newLine.shift === "full",
        evening_shift: newLine.shift === "evening" || newLine.shift === "full",
        seats_available: newLine.seatsAvailable,
        total_seats: newLine.vehicle.seats,
        monthly_price: newLine.monthlyPrice,
        depart_time: newLine.departTime,
        return_time: newLine.returnTime,
        vehicle_type: newLine.vehicle.kind === "van" ? "فان" : newLine.vehicle.kind === "bus" ? "باص" : "صالون",
        vehicle_model: newLine.vehicle.model,
        air_conditioned: newLine.hasAc,
        punctuality: 98,
        is_vip: newLine.isVip,
        status: "approved",
      }).catch((err) => console.warn("Supabase createLine failed:", err));
    }

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

  const updateLineSeats = useCallback((id: string, seats: number) => {
    setLines((prev) =>
      prev.map((item) => (item.id === id ? { ...item, seatsAvailable: seats } : item))
    );
    if (isSupabaseConfigured) {
      supabaseService.updateLineSeats(id, seats).catch((err) =>
        console.warn("Supabase updateLineSeats failed:", err)
      );
    }
  }, []);

  const submitCoverageRequest = useCallback(
    (data: Omit<CoverageRequest, "id" | "createdAt">) => {
      const newRequest: CoverageRequest = {
        ...data,
        id: `rq-${Date.now().toString(36)}`,
        createdAt: new Date().toISOString(),
      };
      setCoverageRequests((prev) => [newRequest, ...prev]);

      if (isSupabaseConfigured) {
        supabaseService.submitCoverageRequest({
          id: newRequest.id,
          student_name: newRequest.studentName,
          phone: newRequest.phone,
          university_id: newRequest.universityId,
          area: newRequest.area,
          lat: newRequest.location?.lat,
          lng: newRequest.location?.lng,
          status: "pending",
        }).catch((err) => console.warn("Supabase submitCoverageRequest failed:", err));
      }

      return newRequest;
    },
    []
  );

  const submitStudentRequest = useCallback(
    (data: Omit<StudentLineRequest, "id" | "createdAt" | "status">): StudentLineRequest => {
      const newReq: StudentLineRequest = {
        ...data,
        id: `req-stu-${Date.now()}`,
        status: "open",
        createdAt: "الآن",
      };
      setStudentRequests((prev) => [newReq, ...prev]);
      return newReq;
    },
    []
  );

  const updateStudentRequestStatus = useCallback(
    (id: string, status: "open" | "contacted" | "accepted") => {
      setStudentRequests((prev) =>
        prev.map((r) => (r.id === id ? { ...r, status } : r))
      );
    },
    []
  );

  const addDriverRecord = useCallback(
    (driver: Omit<DriverRecord, "id" | "registeredAt">): DriverRecord => {
      const newRecord: DriverRecord = {
        ...driver,
        id: `drv-${Date.now()}`,
        registeredAt: new Date().toISOString(),
      };
      setRegisteredDrivers((prev) => [newRecord, ...prev]);
      return newRecord;
    },
    []
  );

  const updateDriverStatus = useCallback(
    (id: string, status: "verified" | "pending" | "rejected") => {
      setRegisteredDrivers((prev) =>
        prev.map((d) => (d.id === id ? { ...d, status } : d))
      );
    },
    []
  );

  const removeDriverRecord = useCallback((id: string) => {
    setRegisteredDrivers((prev) => prev.filter((d) => d.id !== id));
  }, []);

  const resetDemoData = useCallback(() => {
    setLines(INITIAL_LINES);
    setCoverageRequests([]);
    setStudentRequests(INITIAL_STUDENT_REQUESTS);
    setRegisteredDrivers(INITIAL_REGISTERED_DRIVERS);
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
      studentRequests,
      registeredDrivers,
      isAdmin,
      signIn,
      signOut,
      submitLine,
      approveLine,
      rejectLine,
      toggleVip,
      removeLine,
      updateLineSeats,
      submitCoverageRequest,
      submitStudentRequest,
      updateStudentRequestStatus,
      addDriverRecord,
      updateDriverStatus,
      removeDriverRecord,
      resetDemoData,
    }),
    [
      lines,
      activeLines,
      vipLines,
      pendingLines,
      coverageRequests,
      studentRequests,
      registeredDrivers,
      isAdmin,
      signIn,
      signOut,
      submitLine,
      approveLine,
      rejectLine,
      toggleVip,
      removeLine,
      updateLineSeats,
      submitCoverageRequest,
      submitStudentRequest,
      updateStudentRequestStatus,
      addDriverRecord,
      updateDriverStatus,
      removeDriverRecord,
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
