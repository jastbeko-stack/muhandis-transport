import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  Map,
  BusFront,
  MessageSquare,
  User,
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

  const navItems = [
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
      to: user?.role === "driver" ? "/driver" : "/student",
      label: "حسابي",
      icon: User,
      active: isActive("/student") || isActive("/driver") || isActive("/profile"),
    },
  ];

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-50 bg-white/95 dark:bg-card/95 backdrop-blur-md border-t border-gray-200/80 dark:border-border pb-[max(0.4rem,env(safe-area-inset-bottom))] pt-1 shadow-[0_-4px_25px_rgba(0,0,0,0.06)]"
      aria-label="شريط التنقل السفلي"
    >
      <div className="container max-w-lg mx-auto flex items-center justify-around px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = item.active;

          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex flex-col items-center justify-center transition-all select-none active:scale-95 py-1 px-3",
                active
                  ? "bg-[#eaf4f2] text-[#246158] dark:bg-[#246158]/25 dark:text-[#52b7a9] rounded-2xl font-black shadow-sm"
                  : "text-gray-500 hover:text-gray-800 dark:text-muted-foreground dark:hover:text-foreground font-bold"
              )}
            >
              <Icon className={cn("h-5 w-5 mb-0.5", active ? "stroke-[2.2]" : "stroke-[1.75]")} />
              <span className="text-[11px] leading-tight">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};
