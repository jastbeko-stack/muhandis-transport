import { useCallback } from "react";
import { Bus, Coins, Landmark, MapPin, RotateCcw } from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { AREAS, UNIVERSITIES } from "@/data/seed";
import { DEFAULT_FILTERS } from "@/lib/filtering";
import { formatIqd } from "@/lib/format";
import type { LineFilters, LineGender, Shift } from "@/lib/types";

interface LineFiltersPanelProps {
  filters: LineFilters;
  onChange: (next: LineFilters) => void;
}

function SectionTitle({ icon: Icon, children }: { icon: typeof Bus; children: string }) {
  return (
    <h3 className="mb-3 flex items-center gap-2 font-display text-sm font-extrabold text-foreground">
      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
      {children}
    </h3>
  );
}

export function LineFiltersPanel({ filters, onChange }: LineFiltersPanelProps) {
  const toggleUniversity = useCallback(
    (id: string, checked: boolean): void => {
      onChange({ ...filters, universityId: checked ? id : "all" });
    },
    [filters, onChange],
  );

  const toggleArea = useCallback(
    (area: string, checked: boolean): void => {
      const areas = checked ? [...filters.areas, area] : filters.areas.filter((a) => a !== area);
      onChange({ ...filters, areas });
    },
    [filters, onChange],
  );

  return (
    <div className="space-y-6">
      <section>
        <SectionTitle icon={Landmark}>الجامعة</SectionTitle>
        <ul className="space-y-2.5">
          {UNIVERSITIES.map((u) => (
            <li key={u.id}>
              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/85 transition-colors hover:text-foreground">
                <span>{u.name}</span>
                <Checkbox
                  checked={filters.universityId === u.id}
                  onCheckedChange={(v) => toggleUniversity(u.id, v === true)}
                  aria-label={u.name}
                />
              </label>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-border" />

      <section>
        <SectionTitle icon={MapPin}>المنطقة / الحي</SectionTitle>
        <ul className="grid grid-cols-2 gap-2.5 sm:grid-cols-1">
          {AREAS.map((area) => (
            <li key={area}>
              <label className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/85 transition-colors hover:text-foreground">
                <span>{area}</span>
                <Checkbox
                  checked={filters.areas.includes(area)}
                  onCheckedChange={(v) => toggleArea(area, v === true)}
                  aria-label={area}
                />
              </label>
            </li>
          ))}
        </ul>
      </section>

      <div className="h-px bg-border" />

      <section>
        <SectionTitle icon={Bus}>نوع الخط</SectionTitle>
        <RadioGroup
          value={filters.gender}
          onValueChange={(v) => onChange({ ...filters, gender: v as LineGender | "all" })}
          className="space-y-2.5"
        >
          {(
            [
              { value: "all", label: "الكل" },
              { value: "girls", label: "بنات فقط" },
              { value: "mixed", label: "مختلط" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/85 transition-colors hover:text-foreground"
            >
              <span>{option.label}</span>
              <RadioGroupItem value={option.value} id={`gender-${option.value}`} />
            </label>
          ))}
        </RadioGroup>
      </section>

      <div className="h-px bg-border" />

      <section>
        <SectionTitle icon={Bus}>الدوام</SectionTitle>
        <RadioGroup
          value={filters.shift}
          onValueChange={(v) => onChange({ ...filters, shift: v as Shift | "all" })}
          className="space-y-2.5"
        >
          {(
            [
              { value: "all", label: "الكل" },
              { value: "morning", label: "صباحي" },
              { value: "evening", label: "مسائي" },
            ] as const
          ).map((option) => (
            <label
              key={option.value}
              className="flex cursor-pointer items-center justify-between gap-3 text-sm text-foreground/85 transition-colors hover:text-foreground"
            >
              <span>{option.label}</span>
              <RadioGroupItem value={option.value} id={`shift-${option.value}`} />
            </label>
          ))}
        </RadioGroup>
      </section>

      <div className="h-px bg-border" />

      <section>
        <SectionTitle icon={Coins}>السعر الشهري</SectionTitle>
        <Label className="mb-3 block text-sm font-semibold text-muted-foreground">
          حتى {formatIqd(filters.maxPrice)}
        </Label>
        <Slider
          value={[filters.maxPrice]}
          min={20000}
          max={60000}
          step={1000}
          onValueChange={(v) => onChange({ ...filters, maxPrice: v[0] })}
          aria-label="الحد الأعلى للسعر الشهري"
        />
      </section>

      <Button
        type="button"
        variant="outline"
        className="h-11 w-full gap-2 rounded-xl font-bold"
        onClick={() => onChange({ ...DEFAULT_FILTERS })}
      >
        <RotateCcw className="h-4 w-4" aria-hidden="true" />
        إعادة ضبط الفلاتر
      </Button>
    </div>
  );
}
