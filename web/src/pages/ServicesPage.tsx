import React, { useState, useMemo, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import {
  Search,
  SlidersHorizontal,
  X,
  ListFilter,
  MapPinned,
  RotateCcw,
} from "lucide-react";
import { usePlatform } from "../context/PlatformContext";
import type { FilterState, TransportLine } from "../types";
import { UNIVERSITIES, AREAS, INITIAL_FILTERS } from "../data/initialData";
import { FilterSidebar } from "../components/lines/FilterSidebar";
import { LineCard } from "../components/lines/LineCard";
import { BookingModal } from "../components/modals/BookingModal";
import { RequestCoverageModal } from "../components/modals/RequestCoverageModal";
import { cn } from "../utils/formatters";

const SORT_LABELS: Record<FilterState["sort"], string> = {
  rating: "الأعلى تقييماً",
  priceAsc: "الأقل سعراً",
  priceDesc: "الأعلى سعراً",
  seats: "الأكثر مقاعد متاحة",
};

export const ServicesPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { activeLines } = usePlatform();

  // Initialize filters from URL parameters if available
  const [filters, setFilters] = useState<FilterState>(() => {
    const uniParam = searchParams.get("university");
    const areaParam = searchParams.get("area");
    const shiftParam = searchParams.get("shift");
    const genderParam = searchParams.get("gender");

    return {
      ...INITIAL_FILTERS,
      universityId: uniParam || "all",
      areas: areaParam && areaParam !== "all" ? [areaParam] : [],
      shift: (shiftParam as FilterState["shift"]) || "all",
      gender: (genderParam as FilterState["gender"]) || "all",
    };
  });

  // Sync when searchParams change
  useEffect(() => {
    const uniParam = searchParams.get("university");
    const areaParam = searchParams.get("area");
    const shiftParam = searchParams.get("shift");
    const genderParam = searchParams.get("gender");

    if (uniParam || areaParam || shiftParam || genderParam) {
      setFilters((prev) => ({
        ...prev,
        universityId: uniParam || prev.universityId,
        areas: areaParam && areaParam !== "all" ? [areaParam] : prev.areas,
        shift: (shiftParam as FilterState["shift"]) || prev.shift,
        gender: (genderParam as FilterState["gender"]) || prev.gender,
      }));
    }
  }, [searchParams]);

  const [bookingLine, setBookingLine] = useState<TransportLine | null>(null);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Filter & Sort Logic
  const filteredLines = useMemo(() => {
    const res = activeLines.filter((line) => {
      // University filter
      if (filters.universityId !== "all" && line.universityId !== filters.universityId) {
        return false;
      }
      // Area filter
      if (filters.areas.length > 0 && !filters.areas.includes(line.fromArea)) {
        return false;
      }
      // Gender filter
      if (filters.gender !== "all" && line.gender !== filters.gender) {
        return false;
      }
      // Shift filter
      if (
        filters.shift !== "all" &&
        line.shift !== filters.shift &&
        line.shift !== "full"
      ) {
        return false;
      }
      // Max price
      if (line.monthlyPrice > filters.maxPrice) {
        return false;
      }
      // Text query
      if (filters.query.trim()) {
        const q = filters.query.trim().toLowerCase();
        const searchCorpus = `${line.driverName} ${line.fromArea} ${line.toArea} ${line.vehicle.model}`.toLowerCase();
        if (!searchCorpus.includes(q)) return false;
      }
      return true;
    });

    // Sorting
    res.sort((a, b) => {
      // Always prioritize VIP
      if (a.isVip && !b.isVip) return -1;
      if (!a.isVip && b.isVip) return 1;

      if (filters.sort === "rating") {
        return b.rating - a.rating;
      }
      if (filters.sort === "priceAsc") {
        return a.monthlyPrice - b.monthlyPrice;
      }
      if (filters.sort === "priceDesc") {
        return b.monthlyPrice - a.monthlyPrice;
      }
      if (filters.sort === "seats") {
        return b.seatsAvailable - a.seatsAvailable;
      }
      return 0;
    });

    return res;
  }, [activeLines, filters]);

  // Active filters count for mobile trigger button
  const activeFiltersCount =
    (filters.universityId !== "all" ? 1 : 0) +
    filters.areas.length +
    (filters.gender !== "all" ? 1 : 0) +
    (filters.shift !== "all" ? 1 : 0) +
    (filters.maxPrice < 50000 ? 1 : 0) +
    (filters.query.trim() !== "" ? 1 : 0);

  const selectedUniObj = UNIVERSITIES.find((u) => u.id === filters.universityId);

  return (
    <div className="flex-1">
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 pt-3 sm:pt-6 pb-[calc(6.5rem+env(safe-area-inset-bottom,0px))] space-y-4 sm:space-y-6">
        {/* Header Title */}
        <div className="space-y-1">
          <h1 className="font-display text-xl sm:text-3xl font-black text-foreground">
            الخطوط المعتمدة
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            تصفح جميع خطوط النقل الجامعي المنشورة في البصرة وفلترها حسب جامعتك ومنطقتك وميزانيتك.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          {/* Desktop Sidebar */}
          <aside className="hidden lg:block">
            <div className="sticky top-24 card-surface max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
          </aside>

          {/* Results Area */}
          <div className="space-y-4 sm:space-y-5">
            {/* Top Toolbar: Search, Sort, Mobile filter button */}
            <div className="card-surface p-3 sm:p-4 space-y-2.5 sm:space-y-0 sm:flex sm:items-center sm:justify-between sm:gap-3">
              {/* Search query input */}
              <div className="relative w-full sm:max-w-xs">
                <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="text"
                  value={filters.query}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, query: e.target.value }))
                  }
                  placeholder="ابحث باسم السائق أو المنطقة أو الجامعة..."
                  className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background pe-9 ps-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary shadow-xs"
                />
              </div>

              {/* Controls: Count, Sort selector, Mobile filter trigger */}
              <div className="flex items-center justify-between sm:justify-end gap-2">
                <div className="flex items-center gap-1.5 font-display text-xs sm:text-sm font-extrabold text-foreground shrink-0">
                  <ListFilter className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
                  <span>{filteredLines.length} خطاً</span>
                </div>

                <div className="flex items-center gap-2">
                  {/* Sort selector */}
                  <div className="relative">
                    <select
                      value={filters.sort}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          sort: e.target.value as FilterState["sort"],
                        }))
                      }
                      className="h-9 sm:h-11 rounded-xl border border-input bg-background px-2.5 sm:px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      {Object.entries(SORT_LABELS).map(([val, label]) => (
                        <option key={val} value={val}>
                          {label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Mobile Filters Trigger */}
                  <button
                    type="button"
                    onClick={() => setMobileFiltersOpen(true)}
                    className="flex h-9 sm:h-11 items-center gap-1.5 rounded-xl border border-border bg-card px-3 sm:px-4 text-xs font-bold text-foreground hover:bg-muted lg:hidden shadow-xs active:scale-95"
                  >
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    <span>الفلاتر</span>
                    {activeFiltersCount > 0 && (
                      <span className="grid h-4.5 min-w-[18px] place-items-center rounded-full bg-primary px-1 text-[10px] font-black text-primary-foreground">
                        {activeFiltersCount}
                      </span>
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Mobile Quick University & Gender Filter Scrollbar */}
            <div className="space-y-2 lg:hidden">
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setFilters((prev) => ({ ...prev, universityId: "all" }))}
                  className={cn(
                    "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95",
                    filters.universityId === "all"
                      ? "bg-primary text-primary-foreground shadow-sm"
                      : "border border-border bg-card text-muted-foreground"
                  )}
                >
                  كل الجامعات
                </button>
                {UNIVERSITIES.map((u) => (
                  <button
                    key={u.id}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, universityId: u.id }))}
                    className={cn(
                      "shrink-0 rounded-full px-3.5 py-1.5 text-xs font-bold transition-all active:scale-95",
                      filters.universityId === u.id
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "border border-border bg-card text-muted-foreground"
                    )}
                  >
                    {u.short}
                  </button>
                ))}
              </div>

              {/* Quick Gender Chips */}
              <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {[
                  { id: "all", label: "الكل" },
                  { id: "youth", label: "شباب 👨‍🎓" },
                  { id: "girls", label: "بنات فقط 🌸" },
                  { id: "mixed", label: "مختلط 👥" },
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setFilters((prev) => ({ ...prev, gender: item.id as FilterState["gender"] }))}
                    className={cn(
                      "shrink-0 rounded-full px-3 py-1 text-[11px] font-bold transition-all active:scale-95",
                      filters.gender === item.id
                        ? "bg-gold text-navy-deep font-black shadow-sm"
                        : "border border-border bg-muted/40 text-muted-foreground"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Active Filter Chips */}
            {activeFiltersCount > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-muted-foreground">الفلاتر المطبقة:</span>

                {filters.universityId !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-bold text-foreground">
                    الجامعة: {selectedUniObj?.short || filters.universityId}
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, universityId: "all" }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}

                {filters.gender !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-bold text-foreground">
                    {filters.gender === "girls" ? "بنات فقط" : filters.gender === "youth" ? "شباب" : "مختلط"}
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, gender: "all" }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}

                {filters.shift !== "all" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-bold text-foreground">
                    الدوام: {filters.shift === "morning" ? "صباحي" : filters.shift === "evening" ? "مسائي" : "صباحي ومسائي"}
                    <button
                      type="button"
                      onClick={() => setFilters((prev) => ({ ...prev, shift: "all" }))}
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                )}

                {filters.areas.map((area) => (
                  <span
                    key={area}
                    className="inline-flex items-center gap-1.5 rounded-full border border-border bg-muted/60 px-3 py-1 text-xs font-bold text-foreground"
                  >
                    منطقة: {area}
                    <button
                      type="button"
                      onClick={() =>
                        setFilters((prev) => ({
                          ...prev,
                          areas: prev.areas.filter((a) => a !== area),
                        }))
                      }
                      className="text-muted-foreground hover:text-foreground"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </span>
                ))}

                <button
                  type="button"
                  onClick={() => setFilters(INITIAL_FILTERS)}
                  className="text-xs font-bold text-destructive hover:underline"
                >
                  مسح الكل
                </button>
              </div>
            )}

            {/* Results Grid */}
            {filteredLines.length > 0 ? (
              <div className="grid gap-3.5 sm:gap-5 grid-cols-1 md:grid-cols-2 2xl:grid-cols-3">
                {filteredLines.map((line) => (
                  <LineCard
                    key={line.id}
                    line={line}
                    variant={line.isVip ? "vip" : "standard"}
                    onBook={(l) => setBookingLine(l)}
                  />
                ))}
              </div>
            ) : (
              <div className="card-surface flex flex-col items-center gap-3 p-12 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-8 w-8" />
                </span>
                <h3 className="font-display text-xl font-bold text-foreground">
                  لا توجد خطوط مطابقة لبحثك
                </h3>
                <p className="max-w-md text-sm text-muted-foreground leading-relaxed">
                  جرّب توسيع نطاق الفلاتر أو أرسل طلباً لتغطية منطقتك وسنقوم بالبحث والتواصل مع السائقين لتوفير خط مناسب لك.
                </p>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setFilters(INITIAL_FILTERS)}
                    className="flex items-center gap-1.5 rounded-xl border border-border px-5 py-2.5 text-xs font-bold text-foreground hover:bg-muted"
                  >
                    <RotateCcw className="h-3.5 w-3.5" />
                    إعادة ضبط الفلاتر
                  </button>
                  <button
                    type="button"
                    onClick={() => setCoverageModalOpen(true)}
                    className="flex items-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-xs font-black text-navy-deep shadow-md hover:bg-gold/90"
                  >
                    <MapPinned className="h-3.5 w-3.5" />
                    طلب خط لمنطقتك
                  </button>
                </div>
              </div>
            )}

            {/* Coverage Banner CTA */}
            <div className="flex flex-col items-center gap-3.5 sm:gap-5 rounded-2xl sm:rounded-3xl border border-dashed border-border bg-muted/40 p-4 sm:p-6 text-center sm:flex-row sm:text-start">
              <span className="relative grid h-12 w-12 sm:h-14 sm:w-14 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/30" />
                <MapPinned className="relative h-6 w-6 sm:h-7 sm:w-7" />
              </span>
              <div className="flex-1">
                <h3 className="font-display text-base sm:text-lg font-extrabold text-foreground">
                  لم تجد خطاً يغطي منطقتك حتى الآن؟
                </h3>
                <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                  حدد موقعك على الخريطة وأرسل طلبك وسنقوم بتوفير سائق لك في أقرب وقت.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setCoverageModalOpen(true)}
                className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
              >
                <MapPinned className="h-4 w-4" />
                حدد موقعك واطلب خطاً
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile Filters Drawer / Bottom Sheet */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex items-end justify-center p-0">
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="relative z-10 flex max-h-[85vh] w-full flex-col overflow-hidden rounded-t-[2rem] bg-card p-5 shadow-2xl animate-fade-up">
            {/* Drag Handle */}
            <div className="mx-auto mb-2 h-1.5 w-12 rounded-full bg-muted-foreground/30" />

            <div className="mb-3 flex items-center justify-between border-b border-border pb-3">
              <h3 className="font-display text-lg font-bold text-foreground">تصفية الخطوط</h3>
              <button
                type="button"
                onClick={() => setMobileFiltersOpen(false)}
                className="rounded-lg p-1 text-muted-foreground hover:bg-muted"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto">
              <FilterSidebar filters={filters} onChange={setFilters} />
            </div>
            <button
              type="button"
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-black text-primary-foreground shadow-md active:scale-95"
            >
              عرض النتائج ({filteredLines.length})
            </button>
          </div>
        </div>
      )}

      {/* Booking and Request Coverage Modals */}
      <BookingModal
        line={bookingLine}
        open={bookingLine !== null}
        onOpenChange={(open) => !open && setBookingLine(null)}
      />

      <RequestCoverageModal
        open={coverageModalOpen}
        onOpenChange={setCoverageModalOpen}
        defaultArea={filters.areas[0] || AREAS[0]}
        defaultUniversityId={filters.universityId !== "all" ? filters.universityId : UNIVERSITIES[0].id}
      />
    </div>
  );
};
