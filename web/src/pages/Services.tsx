import { useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ListFilter, MapPinned, Search, SlidersHorizontal, X } from "lucide-react";

import { BookLineDialog } from "@/components/dialogs/BookLineDialog";
import { CoverageRequestDialog } from "@/components/dialogs/CoverageRequestDialog";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LineCard } from "@/components/lines/LineCard";
import { LineFiltersPanel } from "@/components/lines/LineFiltersPanel";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { UNIVERSITIES } from "@/data/seed";
import { DEFAULT_FILTERS, SORT_LABELS, countActiveFilters, filterLines } from "@/lib/filtering";
import { genderLabel, shiftLabel } from "@/lib/format";
import type { Line, LineFilters, LineGender, Shift, SortKey } from "@/lib/types";
import { usePlatform } from "@/store/PlatformStore";

function filtersFromParams(params: URLSearchParams): LineFilters {
  const university = params.get("university");
  const area = params.get("area");
  const shift = params.get("shift");
  const gender = params.get("gender");

  return {
    ...DEFAULT_FILTERS,
    universityId: university && UNIVERSITIES.some((u) => u.id === university) ? university : "all",
    areas: area ? [area] : [],
    shift: shift === "morning" || shift === "evening" ? (shift as Shift) : "all",
    gender: gender === "girls" || gender === "mixed" ? (gender as LineGender) : "all",
  };
}

function ActiveChip({ label, onClear, tone }: { label: string; onClear: () => void; tone: "girls" | "mixed" | "neutral" }) {
  const toneClass =
    tone === "girls"
      ? "bg-girls/10 text-girls ring-girls/25"
      : tone === "mixed"
        ? "bg-mixed/10 text-mixed ring-mixed/25"
        : "bg-secondary text-secondary-foreground ring-border";

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold ring-1 ${toneClass}`}>
      {label}
      <button type="button" onClick={onClear} aria-label={`إزالة الفلتر ${label}`} className="transition-opacity hover:opacity-70">
        <X className="h-3.5 w-3.5" aria-hidden="true" />
      </button>
    </span>
  );
}

export default function Services() {
  const [params] = useSearchParams();
  const { activeLines } = usePlatform();
  const [filters, setFilters] = useState<LineFilters>(() => filtersFromParams(params));
  const [bookingLine, setBookingLine] = useState<Line | null>(null);
  const [coverageOpen, setCoverageOpen] = useState<boolean>(false);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  useEffect(() => {
    setFilters(filtersFromParams(params));
  }, [params]);

  const results = useMemo(() => filterLines(activeLines, filters), [activeLines, filters]);
  const activeCount = useMemo(() => countActiveFilters(filters), [filters]);
  const handleBook = useCallback((line: Line): void => setBookingLine(line), []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="container flex-1 py-8">
        <div className="mb-6">
          <h1 className="font-display text-3xl font-black text-foreground">الخطوط المعتمدة</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            تصفح جميع خطوط النقل الجامعي المنشورة في البصرة وفلترها حسب جامعتك ومنطقتك وميزانيتك.
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="hidden lg:block">
            <div className="sticky top-24 card-surface max-h-[calc(100vh-8rem)] overflow-y-auto p-5">
              <LineFiltersPanel filters={filters} onChange={setFilters} />
            </div>
          </aside>

          <div className="space-y-5">
            <div className="card-surface flex flex-wrap items-center gap-3 p-4">
              <span className="flex items-center gap-2 font-display text-sm font-extrabold text-foreground">
                <ListFilter className="h-4 w-4 text-primary" aria-hidden="true" />
                {results.length} خطاً مطابقاً
              </span>

              <div className="flex flex-wrap items-center gap-2">
                {filters.gender !== "all" ? (
                  <ActiveChip
                    label={genderLabel(filters.gender)}
                    tone={filters.gender === "girls" ? "girls" : "mixed"}
                    onClear={() => setFilters((prev) => ({ ...prev, gender: "all" }))}
                  />
                ) : null}
                {filters.shift !== "all" ? (
                  <ActiveChip
                    label={shiftLabel(filters.shift)}
                    tone="neutral"
                    onClear={() => setFilters((prev) => ({ ...prev, shift: "all" }))}
                  />
                ) : null}
                {filters.areas.map((area) => (
                  <ActiveChip
                    key={area}
                    label={area}
                    tone="neutral"
                    onClear={() => setFilters((prev) => ({ ...prev, areas: prev.areas.filter((a) => a !== area) }))}
                  />
                ))}
              </div>

              <div className="ms-auto flex items-center gap-2">
                <div className="relative hidden sm:block">
                  <Search className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                  <Input
                    value={filters.query}
                    onChange={(e) => setFilters((prev) => ({ ...prev, query: e.target.value }))}
                    placeholder="ابحث باسم السائق أو المنطقة"
                    aria-label="بحث في الخطوط"
                    className="h-11 w-56 rounded-xl pe-9"
                  />
                </div>

                <Select value={filters.sort} onValueChange={(v) => setFilters((prev) => ({ ...prev, sort: v as SortKey }))}>
                  <SelectTrigger className="h-11 w-48 rounded-xl" aria-label="ترتيب النتائج">
                    <SelectValue>الترتيب: {SORT_LABELS[filters.sort]}</SelectValue>
                  </SelectTrigger>
                  <SelectContent>
                    {(Object.keys(SORT_LABELS) as SortKey[]).map((key) => (
                      <SelectItem key={key} value={key}>
                        {SORT_LABELS[key]}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Sheet open={mobileFiltersOpen} onOpenChange={setMobileFiltersOpen}>
                  <SheetTrigger asChild>
                    <Button variant="outline" className="h-11 gap-2 rounded-xl font-bold lg:hidden">
                      <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                      الفلاتر
                      {activeCount > 0 ? (
                        <span className="grid h-5 min-w-5 place-items-center rounded-full bg-primary px-1.5 text-[11px] text-primary-foreground">
                          {activeCount}
                        </span>
                      ) : null}
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[320px] overflow-y-auto">
                    <SheetTitle className="mb-5 font-display text-lg">تصفية الخطوط</SheetTitle>
                    <LineFiltersPanel filters={filters} onChange={setFilters} />
                  </SheetContent>
                </Sheet>
              </div>
            </div>

            {results.length > 0 ? (
              <div className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3">
                {results.map((line) => (
                  <LineCard
                    key={line.id}
                    line={line}
                    variant={line.isVip ? "vip" : "standard"}
                    onBook={handleBook}
                    className="animate-fade-up"
                  />
                ))}
              </div>
            ) : (
              <div className="card-surface flex flex-col items-center gap-3 p-12 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-full bg-muted text-muted-foreground">
                  <Search className="h-7 w-7" aria-hidden="true" />
                </span>
                <h2 className="font-display text-xl font-bold text-foreground">لا توجد خطوط مطابقة لبحثك</h2>
                <p className="max-w-sm text-sm text-muted-foreground">
                  جرّب توسيع نطاق الفلاتر أو أرسل طلباً لتغطية منطقتك وسنبحث لك عن سائق.
                </p>
                <Button variant="outline" className="mt-2 rounded-xl font-bold" onClick={() => setFilters({ ...DEFAULT_FILTERS })}>
                  إعادة ضبط الفلاتر
                </Button>
              </div>
            )}

            <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-border bg-muted/40 p-6 text-center sm:flex-row sm:text-start">
              <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
                <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/30" aria-hidden="true" />
                <MapPinned className="relative h-7 w-7" aria-hidden="true" />
              </span>
              <div className="flex-1">
                <h2 className="font-display text-lg font-extrabold text-foreground">لم تجد خطاً يغطي منطقتك حتى الآن؟</h2>
                <p className="mt-1 text-sm text-muted-foreground">
                  حدد موقعك على الخريطة وأرسل طلبك وسنقوم بتوفير سائق لك في أقرب وقت.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => setCoverageOpen(true)}
                className="h-12 gap-2 rounded-xl px-6 font-bold active:scale-[0.98]"
              >
                <MapPinned className="h-5 w-5" aria-hidden="true" />
                حدد موقعك وطلب خط
              </Button>
            </div>
          </div>
        </div>
      </main>

      <SiteFooter />

      <BookLineDialog line={bookingLine} open={bookingLine !== null} onOpenChange={(o) => !o && setBookingLine(null)} />
      <CoverageRequestDialog open={coverageOpen} onOpenChange={setCoverageOpen} />
    </div>
  );
}
