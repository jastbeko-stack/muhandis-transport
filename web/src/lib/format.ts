import type { LineGender, Shift, VehicleKind } from "@/lib/types";

/** Formats an Iraqi dinar amount with Arabic-friendly grouping. */
export function formatIqd(amount: number): string {
  return `${amount.toLocaleString("en-US")} د.ع`;
}

export function genderLabel(gender: LineGender): string {
  return gender === "girls" ? "بنات فقط" : "مختلط";
}

export function shiftLabel(shift: Shift): string {
  if (shift === "morning") return "صباحي";
  if (shift === "evening") return "مسائي";
  return "صباحي ومسائي";
}

export function vehicleLabel(kind: VehicleKind): string {
  if (kind === "van") return "فان";
  if (kind === "bus") return "باص";
  return "صالون";
}

export function seatsLabel(seats: number): string {
  if (seats <= 0) return "مكتمل العدد";
  if (seats === 1) return "مقعد واحد متاح";
  if (seats === 2) return "مقعدان متاحان";
  if (seats <= 10) return `${seats} مقاعد متاحة`;
  return `${seats} مقعداً متاحاً`;
}

/** Normalises an Iraqi local number (07xx...) into international WhatsApp form. */
export function toWhatsAppNumber(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  if (digits.startsWith("964")) return digits;
  if (digits.startsWith("0")) return `964${digits.slice(1)}`;
  return `964${digits}`;
}

export function googleMapsLink(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat.toFixed(4)},${lng.toFixed(4)}`;
}

export function relativeArabicDate(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const days = Math.floor(diff / 86_400_000);
  if (days <= 0) return "اليوم";
  if (days === 1) return "أمس";
  if (days < 30) return `قبل ${days} يوماً`;
  const months = Math.floor(days / 30);
  return months === 1 ? "قبل شهر" : `قبل ${months} أشهر`;
}
