import React from "react";
import {
  Crown,
  Car,
  Bus,
  Clock3,
  Snowflake,
  Star,
  MapPin,
  CheckCircle2,
  BadgeCheck,
  CalendarDays,
} from "lucide-react";
import type { TransportLine } from "../../types";
import { UNIVERSITIES } from "../../data/initialData";
import { DriverAvatar } from "../common/DriverAvatar";
import { formatPrice, formatSeats, formatRelativeDate, cn } from "../../utils/formatters";

interface LineCardProps {
  line: TransportLine;
  variant?: "standard" | "vip";
  onBook: (line: TransportLine) => void;
  className?: string;
}

export const LineCard: React.FC<LineCardProps> = ({
  line,
  variant = line.isVip ? "vip" : "standard",
  onBook,
  className,
}) => {
  const university = UNIVERSITIES.find((u) => u.id === line.universityId);
  const isVip = variant === "vip" || line.isVip;

  const shiftLabel = {
    morning: "صباحي",
    evening: "مسائي",
    full: "صباحي ومسائي",
  }[line.shift];

  const vehicleIcon = line.vehicle.kind === "bus" || line.vehicle.kind === "van" ? Bus : Car;
  const VehicleIcon = vehicleIcon;

  return (
    <div
      className={cn(
        "group relative flex flex-col justify-between overflow-hidden rounded-2xl border transition-all duration-300 hover:shadow-xl",
        isVip
          ? "border-gold/50 bg-gradient-to-b from-gold/5 via-card to-card ring-1 ring-gold/30 shadow-md"
          : "border-border bg-card shadow-sm hover:border-primary/40",
        className
      )}
    >
      {/* Top Banner & Badges */}
      <div className="p-3.5 sm:p-5 pb-3">
        <div className="flex flex-wrap items-center justify-between gap-1.5 sm:gap-2">
          {/* VIP Badge or Category */}
          <div className="flex flex-wrap items-center gap-1.5">
            {isVip && (
              <span className="inline-flex items-center gap-1 rounded-full border border-gold/50 bg-gold/15 px-2.5 py-0.5 text-[11px] sm:text-xs font-black text-gold shadow-sm">
                <Crown className="h-3 w-3 fill-gold" aria-hidden="true" />
                خط مميز / VIP
              </span>
            )}

            {/* Gender Badge */}
            <span
              className={cn(
                "inline-flex items-center rounded-full border px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-bold",
                line.gender === "girls"
                  ? "border-pink-300/40 bg-pink-500/10 text-pink-600 dark:text-pink-400"
                  : line.gender === "youth"
                  ? "border-emerald-300/40 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400"
                  : "border-blue-300/40 bg-blue-500/10 text-blue-600 dark:text-blue-400"
              )}
            >
              {line.gender === "girls" ? "بنات فقط" : line.gender === "youth" ? "شباب" : "مختلط"}
            </span>

            {/* Shift Badge */}
            <span className="inline-flex items-center rounded-full border border-border bg-muted/60 px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-semibold text-muted-foreground">
              {shiftLabel}
            </span>
          </div>

          {/* Available Seats Pill */}
          <span
            className={cn(
              "inline-flex items-center gap-1 rounded-full px-2 sm:px-2.5 py-0.5 text-[11px] sm:text-xs font-extrabold",
              line.seatsAvailable > 0
                ? "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
                : "bg-red-500/15 text-red-600 dark:text-red-400"
            )}
          >
            <span
              className={cn(
                "h-1.5 w-1.5 rounded-full",
                line.seatsAvailable > 0 ? "bg-emerald-500 animate-pulse" : "bg-red-500"
              )}
            />
            {formatSeats(line.seatsAvailable)}
          </span>
        </div>

        {/* Route Info */}
        <div className="mt-3 sm:mt-4 flex items-start sm:items-center justify-between gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <span className="font-display text-base sm:text-lg font-black text-foreground truncate">
                {line.fromArea}
              </span>
              <span className="text-muted-foreground text-xs sm:text-sm">←</span>
              <span className="font-display text-base sm:text-lg font-black text-primary dark:text-gold truncate">
                {line.toArea}
              </span>
            </div>
            <p className="mt-0.5 flex items-center gap-1 text-[11px] sm:text-xs font-semibold text-muted-foreground truncate">
              <MapPin className="h-3 w-3 text-primary shrink-0" aria-hidden="true" />
              <span className="truncate">{university?.name || line.toArea}</span>
            </p>
          </div>

          {/* Monthly Price Highlight */}
          <div className="text-end shrink-0">
            <span className="font-display text-base sm:text-xl font-black text-primary dark:text-gold whitespace-nowrap">
              {formatPrice(line.monthlyPrice)}
            </span>
            <span className="block text-[10px] sm:text-[11px] font-bold text-muted-foreground">شهرياً</span>
          </div>
        </div>

        {/* Timing Details */}
        <div className="mt-2.5 sm:mt-3 flex items-center justify-between rounded-xl bg-muted/40 px-2.5 sm:px-3 py-1.5 sm:py-2 text-[11px] sm:text-xs font-medium text-foreground">
          <div className="flex items-center gap-1 sm:gap-1.5">
            <Clock3 className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground shrink-0" aria-hidden="true" />
            <span>الذهاب: </span>
            <span className="font-bold">{line.departTime}</span>
          </div>
          <span className="text-muted-foreground text-[10px]">•</span>
          <div className="flex items-center gap-1 sm:gap-1.5">
            <span>العودة: </span>
            <span className="font-bold">{line.returnTime}</span>
          </div>
        </div>

        {/* Driver Details & Vehicle */}
        <div className="mt-3 sm:mt-4 flex items-center justify-between border-t border-border/60 pt-2.5 sm:pt-3">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <DriverAvatar name={line.driverName} size="md" ring={isVip ? "gold" : "muted"} />
            <div>
              <h4 className="font-display text-xs sm:text-sm font-black text-foreground">
                {line.driverName}
              </h4>
              <p className="flex items-center gap-1 text-[11px] sm:text-xs text-muted-foreground">
                <VehicleIcon className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-muted-foreground" aria-hidden="true" />
                <span>{line.vehicle.model}</span>
                <span>•</span>
                <span>{line.vehicle.seats} راكب</span>
              </p>
            </div>
          </div>

          {/* Rating */}
          <div className="text-end shrink-0">
            {line.ratingCount > 0 ? (
              <div className="flex items-center gap-1 text-xs font-bold text-amber-500">
                <Star className="h-3.5 w-3.5 fill-amber-500 text-amber-500" aria-hidden="true" />
                <span>{line.rating.toFixed(1)}</span>
                <span className="text-[10px] text-muted-foreground">({line.ratingCount})</span>
              </div>
            ) : (
              <span className="rounded bg-muted px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-muted-foreground">
                جديد
              </span>
            )}
          </div>
        </div>

        {/* Note if available */}
        {line.note && (
          <p className="mt-2.5 rounded-lg bg-muted/30 px-2.5 py-1.5 text-xs text-muted-foreground">
            {line.note}
          </p>
        )}

        {/* Feature Badges */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-[11px] font-semibold text-muted-foreground">
          {line.hasAc && (
            <span className="inline-flex items-center gap-1 rounded bg-sky-500/10 px-2 py-0.5 text-sky-700 dark:text-sky-300">
              <Snowflake className="h-3 w-3" />
              مكيفة
            </span>
          )}
          {line.isPunctual && (
            <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-2 py-0.5 text-emerald-700 dark:text-emerald-300">
              <BadgeCheck className="h-3 w-3" />
              التزام بالوقت
            </span>
          )}
          <span className="inline-flex items-center gap-1 ms-auto text-[10px] text-muted-foreground">
            <CalendarDays className="h-3 w-3" />
            {formatRelativeDate(line.createdAt)}
          </span>
        </div>
      </div>

      {/* Card Action Button */}
      <div className="border-t border-border/80 bg-muted/20 p-3 sm:p-4">
        <button
          type="button"
          onClick={() => onBook(line)}
          className={cn(
            "flex w-full items-center justify-center gap-2 rounded-xl py-2.5 sm:py-3 text-xs sm:text-sm font-black transition-all active:scale-[0.98] shadow-xs",
            isVip
              ? "bg-gold text-navy-deep shadow-md hover:bg-gold/90"
              : "bg-[#286058] hover:bg-[#204e47] text-white"
          )}
        >
          <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
          تحديد الموقع وحجز الخط
        </button>
      </div>
    </div>
  );
};
