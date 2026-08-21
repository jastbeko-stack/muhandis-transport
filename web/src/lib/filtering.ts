import type { Line, LineFilters, SortKey } from "@/lib/types";

export const DEFAULT_FILTERS: LineFilters = {
  universityId: "all",
  areas: [],
  gender: "all",
  shift: "all",
  maxPrice: 50000,
  query: "",
  sort: "rating",
};

export const SORT_LABELS: Record<SortKey, string> = {
  rating: "الأعلى تقييماً",
  priceAsc: "الأقل سعراً",
  priceDesc: "الأعلى سعراً",
  seats: "الأكثر مقاعد متاحة",
};

function matchesQuery(line: Line, query: string): boolean {
  const q = query.trim();
  if (!q) return true;
  const haystack = `${line.driverName} ${line.fromArea} ${line.toArea} ${line.vehicle.model}`;
  return haystack.includes(q);
}

/** Applies the shared filter model to a list of published lines. */
export function filterLines(lines: Line[], filters: LineFilters): Line[] {
  const result = lines.filter((line) => {
    if (filters.universityId !== "all" && line.universityId !== filters.universityId) return false;
    if (filters.areas.length > 0 && !filters.areas.includes(line.fromArea)) return false;
    if (filters.gender !== "all" && line.gender !== filters.gender) return false;
    if (filters.shift !== "all" && line.shift !== filters.shift && line.shift !== "full") return false;
    if (line.monthlyPrice > filters.maxPrice) return false;
    return matchesQuery(line, filters.query);
  });

  const sorted = [...result].sort((a, b) => {
    if (filters.sort === "priceAsc") return a.monthlyPrice - b.monthlyPrice;
    if (filters.sort === "priceDesc") return b.monthlyPrice - a.monthlyPrice;
    if (filters.sort === "seats") return b.seatsAvailable - a.seatsAvailable;
    return b.rating - a.rating || b.ratingCount - a.ratingCount;
  });

  return sorted.sort((a, b) => Number(b.isVip) - Number(a.isVip));
}

export function countActiveFilters(filters: LineFilters): number {
  let count = 0;
  if (filters.universityId !== "all") count += 1;
  count += filters.areas.length;
  if (filters.gender !== "all") count += 1;
  if (filters.shift !== "all") count += 1;
  if (filters.maxPrice < DEFAULT_FILTERS.maxPrice) count += 1;
  if (filters.query.trim()) count += 1;
  return count;
}
