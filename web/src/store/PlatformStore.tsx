import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { ADMIN_PASSCODE, SEED_LINES } from "@/data/seed";
import type { CoverageRequest, Line } from "@/lib/types";

const LINES_KEY = "khutoot.lines.v1";
const REQUESTS_KEY = "khutoot.requests.v1";
const ADMIN_KEY = "khutoot.admin.v1";

type NewLineInput = Omit<
  Line,
  "id" | "rating" | "ratingCount" | "status" | "isVip" | "vipFeePaid" | "createdAt" | "toArea"
> & { toArea: string };

interface PlatformValue {
  lines: Line[];
  activeLines: Line[];
  vipLines: Line[];
  pendingLines: Line[];
  coverageRequests: CoverageRequest[];
  isAdmin: boolean;
  signIn: (passcode: string) => boolean;
  signOut: () => void;
  submitLine: (input: NewLineInput) => Line;
  approveLine: (id: string, asVip: boolean) => void;
  rejectLine: (id: string) => void;
  toggleVip: (id: string) => void;
  removeLine: (id: string) => void;
  submitCoverageRequest: (input: Omit<CoverageRequest, "id" | "createdAt">) => CoverageRequest;
  resetDemoData: () => void;
}

const PlatformContext = createContext<PlatformValue | null>(null);

function readStored<T>(key: string, fallback: T): T {
  if (typeof window === "undefined") return fallback;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch (error) {
    console.warn(`تعذر قراءة البيانات المحلية (${key})`, error);
    return fallback;
  }
}

function writeStored<T>(key: string, value: T): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`تعذر حفظ البيانات المحلية (${key})`, error);
  }
}

export function PlatformProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<Line[]>(() => readStored<Line[]>(LINES_KEY, SEED_LINES));
  const [coverageRequests, setCoverageRequests] = useState<CoverageRequest[]>(() =>
    readStored<CoverageRequest[]>(REQUESTS_KEY, []),
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(() => readStored<boolean>(ADMIN_KEY, false));

  useEffect(() => {
    writeStored(LINES_KEY, lines);
  }, [lines]);

  useEffect(() => {
    writeStored(REQUESTS_KEY, coverageRequests);
  }, [coverageRequests]);

  useEffect(() => {
    writeStored(ADMIN_KEY, isAdmin);
  }, [isAdmin]);

  const signIn = useCallback((passcode: string): boolean => {
    const ok = passcode.trim() === ADMIN_PASSCODE;
    if (ok) setIsAdmin(true);
    return ok;
  }, []);

  const signOut = useCallback((): void => setIsAdmin(false), []);

  const submitLine = useCallback((input: NewLineInput): Line => {
    const line: Line = {
      ...input,
      id: `ln-${Date.now().toString(36)}`,
      rating: 0,
      ratingCount: 0,
      status: "pending",
      isVip: false,
      vipFeePaid: input.vipRequested,
      createdAt: new Date().toISOString(),
    };
    setLines((prev) => [line, ...prev]);
    return line;
  }, []);

  const approveLine = useCallback((id: string, asVip: boolean): void => {
    setLines((prev) =>
      prev.map((line) => (line.id === id ? { ...line, status: "active", isVip: asVip, vipFeePaid: asVip } : line)),
    );
  }, []);

  const rejectLine = useCallback((id: string): void => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, status: "rejected", isVip: false } : line)));
  }, []);

  const toggleVip = useCallback((id: string): void => {
    setLines((prev) => prev.map((line) => (line.id === id ? { ...line, isVip: !line.isVip } : line)));
  }, []);

  const removeLine = useCallback((id: string): void => {
    setLines((prev) => prev.filter((line) => line.id !== id));
  }, []);

  const submitCoverageRequest = useCallback((input: Omit<CoverageRequest, "id" | "createdAt">): CoverageRequest => {
    const request: CoverageRequest = {
      ...input,
      id: `rq-${Date.now().toString(36)}`,
      createdAt: new Date().toISOString(),
    };
    setCoverageRequests((prev) => [request, ...prev]);
    return request;
  }, []);

  const resetDemoData = useCallback((): void => {
    setLines(SEED_LINES);
    setCoverageRequests([]);
  }, []);

  const activeLines = useMemo(() => lines.filter((line) => line.status === "active"), [lines]);
  const vipLines = useMemo(() => activeLines.filter((line) => line.isVip), [activeLines]);
  const pendingLines = useMemo(() => lines.filter((line) => line.status === "pending"), [lines]);

  const value = useMemo<PlatformValue>(
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
    ],
  );

  return <PlatformContext.Provider value={value}>{children}</PlatformContext.Provider>;
}

/** Access the shared platform state (lines, requests, admin session). */
export function usePlatform(): PlatformValue {
  const ctx = useContext(PlatformContext);
  if (!ctx) throw new Error("usePlatform must be used inside PlatformProvider");
  return ctx;
}
