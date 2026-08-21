/** Domain types for the university transport-line marketplace. */

export type LineGender = "girls" | "mixed";

export type Shift = "morning" | "evening" | "full";

export type VehicleKind = "sedan" | "van" | "bus";

export type LineStatus = "pending" | "active" | "rejected";

export interface Coordinates {
  lat: number;
  lng: number;
}

export interface University {
  id: string;
  name: string;
  short: string;
  location: Coordinates;
}

export interface Vehicle {
  kind: VehicleKind;
  model: string;
  seats: number;
}

export interface Line {
  id: string;
  driverName: string;
  driverPhone: string;
  rating: number;
  ratingCount: number;
  universityId: string;
  fromArea: string;
  toArea: string;
  vehicle: Vehicle;
  seatsAvailable: number;
  gender: LineGender;
  shift: Shift;
  monthlyPrice: number;
  hasAc: boolean;
  isPunctual: boolean;
  isVip: boolean;
  vipRequested: boolean;
  vipFeePaid: boolean;
  departTime: string;
  returnTime: string;
  status: LineStatus;
  startPoint: Coordinates;
  note?: string;
  createdAt: string;
}

export interface CoverageRequest {
  id: string;
  studentName: string;
  phone: string;
  universityId: string;
  area: string;
  point: Coordinates;
  createdAt: string;
}

export interface LineFilters {
  universityId: string | "all";
  areas: string[];
  gender: LineGender | "all";
  shift: Shift | "all";
  maxPrice: number;
  query: string;
  sort: SortKey;
}

export type SortKey = "rating" | "priceAsc" | "priceDesc" | "seats";
