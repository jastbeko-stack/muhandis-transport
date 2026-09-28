import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return `${price.toLocaleString("ar-IQ")} د.ع`;
}

export function formatSeats(count: number): string {
  if (count <= 0) return "مكتمل العدد";
  if (count === 1) return "مقعد واحد متاح";
  if (count === 2) return "مقعدان متاحان";
  if (count >= 3 && count <= 10) return `${count} مقاعد متاحة`;
  return `${count} مقعداً متاحاً`;
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  const now = new Date();
  const diffDays = Math.max(0, Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24)));

  if (diffDays === 0) return "اليوم";
  if (diffDays === 1) return "أمس";
  if (diffDays < 30) return `قبل ${diffDays} يوماً`;
  const months = Math.floor(diffDays / 30);
  if (months === 1) return "قبل شهر";
  if (months === 2) return "قبل شهرين";
  if (months <= 10) return `قبل ${months} أشهر`;
  return `قبل ${months} شهراً`;
}

export function getDriverInitials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

export function getDriverHue(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 360;
  }
  return hash;
}

export function createGoogleMapsUrl(lat: number, lng: number): string {
  return `https://maps.google.com/?q=${lat},${lng}`;
}
