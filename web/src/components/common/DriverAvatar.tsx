import React, { useMemo } from "react";
import { cn, getDriverInitials, getDriverHue } from "../../utils/formatters";

interface DriverAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  ring?: "muted" | "gold";
  className?: string;
}

const sizeClasses = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-14 w-14 text-lg",
};

export const DriverAvatar: React.FC<DriverAvatarProps> = ({
  name,
  size = "md",
  ring = "muted",
  className,
}) => {
  const hue = useMemo(() => getDriverHue(name), [name]);
  const initials = useMemo(() => getDriverInitials(name), [name]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-bold text-white ring-2 select-none",
        sizeClasses[size],
        ring === "gold" ? "ring-gold/70" : "ring-border",
        className
      )}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 38) % 360} 60% 28%))`,
      }}
    >
      {initials}
    </span>
  );
};
