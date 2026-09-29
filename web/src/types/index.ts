export interface Coordinates {
  lat: number;
  lng: number;
}

export interface University {
  id: string;
  name: string;
  short: string;
  location: Coordinates;
  type?: "government" | "private";
}

export interface VehicleInfo {
  kind: "sedan" | "van" | "bus";
  model: string;
  seats: number;
}

export type GenderType = "girls" | "youth" | "mixed";
export type ShiftType = "morning" | "evening" | "full";
export type LineStatus = "active" | "pending" | "rejected";
export type UserRole = "student" | "driver";

export interface AuthUser {
  id: string;
  name: string;
  phone: string;
  email?: string;
  role: UserRole;
  universityId?: string; // For students
  area?: string; // For students & drivers
  vehicleModel?: string; // For drivers
  vehicleKind?: "sedan" | "van" | "bus"; // For drivers
  totalSeats?: number; // For drivers
  driverLineId?: string; // Linked line if driver
  avatarHue?: number;
}

export interface TransportLine {
  id: string;
  driverName: string;
  driverPhone: string;
  rating: number;
  ratingCount: number;
  universityId: string;
  fromArea: string;
  toArea: string;
  vehicle: VehicleInfo;
  seatsAvailable: number;
  gender: GenderType;
  shift: ShiftType;
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
  location: Coordinates;
  createdAt: string;
}

export interface StudentLineRequest {
  id: string;
  studentName: string;
  phone: string;
  universityName: string;
  college?: string;
  area: string;
  destinationArea?: string;
  passengersCount: number; // كم شخص
  preferredPrice: number; // السعر المناسب للطالب شهرياً
  gender: GenderType; // شباب / بنات / مختلط
  shift: ShiftType; // صباحي / مسائي
  departureTime?: string;
  returnTime?: string;
  status: "open" | "contacted" | "accepted";
  notes?: string;
  createdAt: string;
}

export interface FilterState {
  universityId: string;
  areas: string[];
  gender: "all" | GenderType;
  shift: "all" | ShiftType;
  maxPrice: number;
  query: string;
  sort: "rating" | "priceAsc" | "priceDesc" | "seats";
}

export interface NewLineSubmission {
  driverName: string;
  driverPhone: string;
  universityId: string;
  fromArea: string;
  toArea: string;
  vehicle: VehicleInfo;
  seatsAvailable: number;
  gender: GenderType;
  shift: ShiftType;
  monthlyPrice: number;
  hasAc: boolean;
  isPunctual: boolean;
  vipRequested: boolean;
  departTime: string;
  returnTime: string;
  startPoint: Coordinates;
  note?: string;
}
