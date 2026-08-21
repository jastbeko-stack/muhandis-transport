import { memo } from "react";
import { ArrowLeft, Bus, Car, Crown, MapPin, MoveLeft, MoveRight, Phone, Star } from "lucide-react";

import { DriverAvatar } from "@/components/lines/DriverAvatar";
import { LineTags } from "@/components/lines/LineTags";
import { Button } from "@/components/ui/button";
import { UNIVERSITIES } from "@/data/seed";
import { formatIqd, toWhatsAppNumber, vehicleLabel } from "@/lib/format";
import type { Line } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LineCardProps {
  line: Line;
  variant?: "vip" | "standard";
  onBook: (line: Line) => void;
  className?: string;
}

function universityName(id: string): string {
  return UNIVERSITIES.find((u) => u.id === id)?.name ?? "جامعة البصرة";
}

function LineCardBase({ line, variant = "standard", onBook, className }: LineCardProps) {
  const VehicleIcon = line.vehicle.kind === "sedan" ? Car : Bus;
  const isVip = variant === "vip";

  return (
    <article
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-2xl border bg-card transition-all duration-300",
        isVip
          ? "border-gold/60 shadow-[0_18px_40px_-24px_hsl(41_92%_40%/0.7)] hover:-translate-y-1"
          : "border-border shadow-[0_1px_2px_hsl(222_45%_14%/0.05),0_14px_30px_-24px_hsl(222_45%_14%/0.6)] hover:-translate-y-1 hover:border-primary/30",
        className,
      )}
    >
      {isVip ? (
        <div className="flex items-center justify-between bg-gradient-to-l from-gold/90 to-gold px-4 py-2 text-[13px] font-bold text-navy-deep">
          <span className="flex items-center gap-1.5">
            <Crown className="h-4 w-4" aria-hidden="true" />
            خط مميز / VIP
          </span>
          <Star className="h-4 w-4 fill-navy-deep/20" aria-hidden="true" />
        </div>
      ) : null}

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="flex flex-wrap items-center gap-2 font-display text-lg font-extrabold text-foreground">
              <span className="truncate">{line.fromArea}</span>
              <ArrowLeft className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
              <span className="truncate">{line.toArea}</span>
            </h3>
            <p className="mt-0.5 truncate text-xs text-muted-foreground">{universityName(line.universityId)}</p>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            <div className="text-end">
              <p className="max-w-[8.5rem] truncate text-sm font-bold text-foreground">{line.driverName}</p>
              <p className="flex items-center justify-end gap-1 text-xs font-semibold text-muted-foreground">
                <Star className="h-3.5 w-3.5 fill-gold text-gold" aria-hidden="true" />
                {line.rating > 0 ? line.rating.toFixed(1) : "جديد"}
                {line.ratingCount > 0 ? <span className="text-[11px] font-normal">({line.ratingCount})</span> : null}
              </p>
            </div>
            <DriverAvatar name={line.driverName} ring={isVip ? "gold" : "muted"} />
          </div>
        </div>

        <LineTags line={line} />

        <div className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs text-muted-foreground">
          <VehicleIcon className="h-4 w-4 shrink-0 text-foreground/70" aria-hidden="true" />
          <span className="truncate">
            {line.vehicle.model} · {vehicleLabel(line.vehicle.kind)} · {line.vehicle.seats} راكب
          </span>
        </div>

        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-dashed border-border pt-3">
          <p className="font-display text-lg font-extrabold text-primary">
            {formatIqd(line.monthlyPrice)}
            <span className="text-xs font-semibold text-muted-foreground"> / شهرياً</span>
          </p>
          <div className="flex items-center gap-3 text-xs font-semibold text-muted-foreground">
            <span className="flex items-center gap-1">
              <MoveLeft className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              الذهاب {line.departTime}
            </span>
            <span className="flex items-center gap-1">
              <MoveRight className="h-3.5 w-3.5 text-gold" aria-hidden="true" />
              العودة {line.returnTime}
            </span>
          </div>
        </div>

        <div className="mt-auto flex flex-col gap-2 pt-1 sm:flex-row">
          <Button
            type="button"
            onClick={() => onBook(line)}
            className="h-11 flex-1 gap-2 rounded-xl bg-primary text-sm font-bold text-primary-foreground hover:bg-primary/90 active:scale-[0.98]"
          >
            <MapPin className="h-4 w-4" aria-hidden="true" />
            تحديد الموقع وحجز الخط
          </Button>
          <Button
            asChild
            variant="outline"
            className="h-11 gap-2 rounded-xl border-whatsapp/40 text-sm font-bold text-whatsapp hover:bg-whatsapp/10 hover:text-whatsapp sm:flex-1"
          >
            <a
              href={`https://wa.me/${toWhatsAppNumber(line.driverPhone)}`}
              target="_blank"
              rel="noreferrer"
              aria-label={`اتصل بالسائق ${line.driverName} عبر واتساب`}
            >
              <Phone className="h-4 w-4" aria-hidden="true" />
              اتصل بالسائق
            </a>
          </Button>
        </div>
      </div>
    </article>
  );
}

export const LineCard = memo(LineCardBase);
