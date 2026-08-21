import { Clock3, PersonStanding, Snowflake, Users } from "lucide-react";

import { genderLabel, seatsLabel } from "@/lib/format";
import type { Line } from "@/lib/types";
import { cn } from "@/lib/utils";

interface LineTagsProps {
  line: Line;
  showSeats?: boolean;
  className?: string;
}

const chip = "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold";

export function LineTags({ line, showSeats = true, className }: LineTagsProps) {
  return (
    <div className={cn("flex flex-wrap items-center gap-1.5", className)}>
      {showSeats ? (
        <span
          className={cn(
            chip,
            line.seatsAvailable > 0
              ? "bg-success/12 text-success ring-1 ring-success/25"
              : "bg-destructive/10 text-destructive ring-1 ring-destructive/25",
          )}
        >
          {seatsLabel(line.seatsAvailable)}
        </span>
      ) : null}

      <span
        className={cn(
          chip,
          line.gender === "girls"
            ? "bg-girls/10 text-girls ring-1 ring-girls/25"
            : "bg-mixed/10 text-mixed ring-1 ring-mixed/25",
        )}
      >
        {line.gender === "girls" ? (
          <PersonStanding className="h-3.5 w-3.5" aria-hidden="true" />
        ) : (
          <Users className="h-3.5 w-3.5" aria-hidden="true" />
        )}
        {genderLabel(line.gender)}
      </span>

      {line.hasAc ? (
        <span className={cn(chip, "bg-sky-500/10 text-sky-600 ring-1 ring-sky-500/25 dark:text-sky-400")}>
          <Snowflake className="h-3.5 w-3.5" aria-hidden="true" />
          مكيفة
        </span>
      ) : null}

      {line.isPunctual ? (
        <span className={cn(chip, "bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/25 dark:text-emerald-400")}>
          <Clock3 className="h-3.5 w-3.5" aria-hidden="true" />
          التزام بالوقت
        </span>
      ) : null}
    </div>
  );
}
