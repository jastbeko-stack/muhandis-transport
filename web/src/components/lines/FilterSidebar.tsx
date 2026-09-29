import React from "react";
import type { FilterState } from "../../types";
import { UNIVERSITIES, AREAS, INITIAL_FILTERS } from "../../data/initialData";
import { formatPrice, cn } from "../../utils/formatters";
import { RotateCcw, SlidersHorizontal, Check } from "lucide-react";

interface FilterSidebarProps {
  filters: FilterState;
  onChange: (filters: FilterState | ((prev: FilterState) => FilterState)) => void;
  className?: string;
}

export const FilterSidebar: React.FC<FilterSidebarProps> = ({
  filters,
  onChange,
  className,
}) => {
  const handleUniversityChange = (id: string) => {
    onChange((prev) => ({ ...prev, universityId: id }));
  };

  const handleAreaToggle = (area: string) => {
    onChange((prev) => {
      const exists = prev.areas.includes(area);
      const newAreas = exists
        ? prev.areas.filter((a) => a !== area)
        : [...prev.areas, area];
      return { ...prev, areas: newAreas };
    });
  };

  const handleGenderChange = (gender: FilterState["gender"]) => {
    onChange((prev) => ({ ...prev, gender }));
  };

  const handleShiftChange = (shift: FilterState["shift"]) => {
    onChange((prev) => ({ ...prev, shift }));
  };

  const handleReset = () => {
    onChange(INITIAL_FILTERS);
  };

  const activeFiltersCount =
    (filters.universityId !== "all" ? 1 : 0) +
    filters.areas.length +
    (filters.gender !== "all" ? 1 : 0) +
    (filters.shift !== "all" ? 1 : 0) +
    (filters.maxPrice < 50000 ? 1 : 0) +
    (filters.query.trim() !== "" ? 1 : 0);

  return (
    <div className={cn("space-y-6 text-foreground", className)}>
      {/* Header & Reset */}
      <div className="flex items-center justify-between border-b border-border pb-4">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-primary" aria-hidden="true" />
          <h3 className="font-display text-base font-extrabold">تصفية الخطوط</h3>
          {activeFiltersCount > 0 && (
            <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
              {activeFiltersCount}
            </span>
          )}
        </div>
        {activeFiltersCount > 0 && (
          <button
            type="button"
            onClick={handleReset}
            className="flex items-center gap-1 text-xs font-bold text-muted-foreground transition-colors hover:text-destructive"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            إعادة ضبط
          </button>
        )}
      </div>

      {/* University Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-muted-foreground">الجامعة</label>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          <button
            type="button"
            onClick={() => handleUniversityChange("all")}
            className={cn(
              "flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-bold transition-all",
              filters.universityId === "all"
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/40 text-foreground hover:bg-muted"
            )}
          >
            <span>كل الجامعات</span>
            {filters.universityId === "all" && <Check className="h-3.5 w-3.5" />}
          </button>

          {UNIVERSITIES.map((uni) => (
            <button
              key={uni.id}
              type="button"
              onClick={() => handleUniversityChange(uni.id)}
              className={cn(
                "flex w-full items-center justify-between rounded-xl px-3 py-2 text-start text-xs font-bold transition-all",
                filters.universityId === uni.id
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-muted/40 text-foreground hover:bg-muted"
              )}
            >
              <span>{uni.name}</span>
              {filters.universityId === uni.id && <Check className="h-3.5 w-3.5" />}
            </button>
          ))}
        </div>
      </div>

      {/* Gender Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-muted-foreground">نوع الخط (الركاب)</label>
        <div className="grid grid-cols-4 gap-1 rounded-xl bg-muted/50 p-1">
          {[
            { id: "all", label: "الكل" },
            { id: "youth", label: "شباب" },
            { id: "girls", label: "بنات" },
            { id: "mixed", label: "مختلط" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleGenderChange(item.id as FilterState["gender"])}
              className={cn(
                "rounded-lg py-1.5 text-center text-xs font-extrabold transition-all",
                filters.gender === item.id
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Shift Filter */}
      <div className="space-y-2.5">
        <label className="block text-xs font-bold text-muted-foreground">فترة الدوام</label>
        <div className="grid grid-cols-2 gap-1.5">
          {[
            { id: "all", label: "كل الأوقات" },
            { id: "morning", label: "صباحي فقط" },
            { id: "evening", label: "مسائي فقط" },
            { id: "full", label: "صباحي ومسائي" },
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => handleShiftChange(item.id as FilterState["shift"])}
              className={cn(
                "rounded-xl border px-3 py-2 text-center text-xs font-bold transition-all",
                filters.shift === item.id
                  ? "border-primary bg-primary/10 text-primary dark:text-gold"
                  : "border-border bg-card text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range Slider */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="text-muted-foreground">الحد الأقصى للسعر</span>
          <span className="font-mono text-primary dark:text-gold">{formatPrice(filters.maxPrice)}</span>
        </div>
        <input
          type="range"
          min="20000"
          max="60000"
          step="2500"
          value={filters.maxPrice}
          onChange={(e) =>
            onChange((prev) => ({ ...prev, maxPrice: Number(e.target.value) }))
          }
          className="h-2 w-full cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>20,000 د.ع</span>
          <span>60,000 د.ع</span>
        </div>
      </div>

      {/* Areas Multi-select Chips */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-muted-foreground">مناطق الانطلاق</label>
          {filters.areas.length > 0 && (
            <button
              type="button"
              onClick={() => onChange((prev) => ({ ...prev, areas: [] }))}
              className="text-[11px] font-bold text-primary hover:underline"
            >
              مسح المناطق
            </button>
          )}
        </div>
        <div className="flex flex-wrap gap-1.5 max-h-48 overflow-y-auto pr-1">
          {AREAS.map((area) => {
            const selected = filters.areas.includes(area);
            return (
              <button
                key={area}
                type="button"
                onClick={() => handleAreaToggle(area)}
                className={cn(
                  "rounded-lg px-2.5 py-1 text-xs font-bold transition-all",
                  selected
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "border border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {area}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
