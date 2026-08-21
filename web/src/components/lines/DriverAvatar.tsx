import { useMemo } from "react";

import { cn } from "@/lib/utils";

interface DriverAvatarProps {
  name: string;
  size?: "sm" | "md" | "lg";
  ring?: "gold" | "muted";
  className?: string;
}

const SIZES: Record<NonNullable<DriverAvatarProps["size"]>, string> = {
  sm: "h-10 w-10 text-sm",
  md: "h-12 w-12 text-base",
  lg: "h-14 w-14 text-lg",
};

function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "؟";
  if (parts.length === 1) return parts[0].slice(0, 2);
  return `${parts[0][0]}${parts[1][0]}`;
}

function hueOf(name: string): number {
  let hash = 0;
  for (let i = 0; i < name.length; i += 1) hash = (hash * 31 + name.charCodeAt(i)) % 360;
  return hash;
}

/** Deterministic initials avatar — keeps driver identity consistent without external photos. */
export function DriverAvatar({ name, size = "md", ring = "muted", className }: DriverAvatarProps) {
  const hue = useMemo(() => hueOf(name), [name]);

  return (
    <span
      aria-hidden="true"
      className={cn(
        "grid shrink-0 place-items-center rounded-full font-display font-bold text-white ring-2",
        SIZES[size],
        ring === "gold" ? "ring-gold/70" : "ring-border",
        className,
      )}
      style={{
        background: `linear-gradient(145deg, hsl(${hue} 55% 42%), hsl(${(hue + 38) % 360} 60% 28%))`,
      }}
    >
      {initialsOf(name)}
    </span>
  );
}
