import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  Map,
  BusFront,
  MessageSquare,
  Gauge,
  Users,
  LayoutList,
  GraduationCap,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/formatters";

export const BottomNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/" || location.pathname === "/home";
    }
    return location.pathname.startsWith(path);
  };

  const navItems =
    user?.role === "driver"
      ? [
          {
            to: "/driver",
            label: "لوحة السائق",
            icon: Gauge,
            active: isActive("/driver"),
          },
          {
            to: "/",
            label: "الخريطة",
            icon: Map,
            active: isActive("/"),
          },
          {
            to: "/trips",
            label: "طلبات الركاب",
            icon: Users,
            active: isActive("/trips"),
          },
          {
            to: "/messages",
            label: "الرسائل",
            icon: MessageSquare,
            active: isActive("/messages"),
          },
          {
            to: "/services",
            label: "الخطوط",
            icon: LayoutList,
            active: isActive("/services"),
          },
        ]
      : [
          {
            to: "/",
            label: "الرئيسية",
            icon: House,
            active: isActive("/"),
          },
          {
            to: "/services",
            label: "الخطوط",
            icon: Map,
            active: isActive("/services"),
          },
          {
            to: "/trips",
            label: "رحلاتي",
            icon: BusFront,
            active: isActive("/trips"),
          },
          {
            to: "/messages",
            label: "الرسائل",
            icon: MessageSquare,
            active: isActive("/messages"),
          },
          {
            to: "/student",
            label: "ملفي الجامعي",
            icon: GraduationCap,
            active: isActive("/student") || isActive("/profile"),
          },
        ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-gray-200/80 dark:border-border pb-[max(0.35rem,env(safe-area-inset-bottom,0px))] pt-1 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
      aria-label="شريط التنقل السفلي"
    >
      <div className="w-full max-w-md mx-auto flex items-center justify-between px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.active;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex-1 min-w-0 flex flex-col items-center justify-center py-1 transition-all select-none active:scale-95 text-center",
                active
                  ? "text-[#246158] dark:text-[#52b7a9]"
                  : "text-gray-400 hover:text-gray-700 dark:text-muted-foreground"
              )}
            >
              <div
                className={cn(
                  "flex flex-col items-center justify-center px-2 py-0.5 rounded-2xl transition-all",
                  active && "bg-[#eaf4f2] dark:bg-[#246158]/25"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-0.5", active ? "stroke-[2.2]" : "stroke-[1.8]")} />
                <span
                  className={cn(
                    "text-[10px] sm:text-[11px] leading-tight truncate",
                    active ? "font-black" : "font-bold"
                  )}
                >
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
