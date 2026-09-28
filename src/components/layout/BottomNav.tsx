import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  House,
  LayoutList,
  PlusCircle,
  Bus,
  MapPinned,
  Users,
  MessageSquare,
  CircleUser,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/formatters";

interface BottomNavProps {
  onOpenAddLine?: () => void;
  onOpenCoverage?: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  onOpenAddLine,
  onOpenCoverage,
}) => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => {
    return path === "/" ? location.pathname === "/" : location.pathname.startsWith(path);
  };

  const isDriver = user?.role === "driver";

  return (
    <nav
      className="fixed inset-x-0 bottom-0 z-40 border-t border-border/80 bg-card/95 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1.5 shadow-[0_-4px_25px_rgba(0,0,0,0.08)] backdrop-blur-xl lg:hidden"
      aria-label="شريط التنقل السفلي"
    >
      <div className="container flex items-center justify-around px-1">
        {/* Tab 1: Home or Driver Portal */}
        <Link
          to={isDriver ? "/driver" : "/"}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold transition-all active:scale-90",
            isActive(isDriver ? "/driver" : "/")
              ? "text-primary dark:text-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            {isDriver ? <Bus className="h-5 w-5" /> : <House className="h-5 w-5" />}
            {isActive(isDriver ? "/driver" : "/") && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary dark:bg-gold" />
            )}
          </div>
          <span>{isDriver ? "لوحتي" : "الرئيسية"}</span>
        </Link>

        {/* Tab 2: Lines Directory */}
        <Link
          to="/services"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold transition-all active:scale-90",
            isActive("/services")
              ? "text-primary dark:text-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <LayoutList className="h-5 w-5" />
            {isActive("/services") && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary dark:bg-gold" />
            )}
          </div>
          <span>الخطوط</span>
        </Link>

        {/* Tab 3: Center Action (Add Line for driver, or Request Coverage for student) */}
        {isDriver ? (
          <button
            type="button"
            onClick={onOpenAddLine}
            className="group -mt-5 flex flex-col items-center gap-0.5 active:scale-95"
            aria-label="أضف خطك كـ سائق"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-gold text-navy-deep shadow-lg ring-4 ring-background transition-transform group-hover:scale-105">
              <PlusCircle className="h-6 w-6 stroke-[2.5]" />
            </span>
            <span className="text-[10px] font-black text-foreground">أضف خطك</span>
          </button>
        ) : (
          <button
            type="button"
            onClick={onOpenCoverage}
            className="group -mt-5 flex flex-col items-center gap-0.5 active:scale-95"
            aria-label="طلب خط لمنطقتك"
          >
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-lg ring-4 ring-background transition-transform group-hover:scale-105">
              <MapPinned className="h-6 w-6" />
            </span>
            <span className="text-[10px] font-black text-foreground">طلب خط</span>
          </button>
        )}

        {/* Tab 4: In-App Messages for Student & Driver */}
        <Link
          to="/messages"
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold transition-all active:scale-90",
            isActive("/messages")
              ? "text-primary dark:text-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute -top-1 -end-1 flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-gold" />
            </span>
            {isActive("/messages") && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary dark:bg-gold" />
            )}
          </div>
          <span>الرسائل</span>
        </Link>

        {/* Tab 5: Account (حسابي) / Driver Passengers */}
        <Link
          to={isDriver ? "/driver" : "/student"}
          className={cn(
            "flex flex-col items-center gap-1 py-1 px-2 text-[11px] font-bold transition-all active:scale-90",
            isActive(isDriver ? "/driver" : "/student")
              ? "text-primary dark:text-gold"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <div className="relative">
            {isDriver ? (
              <Users className="h-5 w-5" />
            ) : (
              <CircleUser className="h-5 w-5" />
            )}
            {isActive(isDriver ? "/driver" : "/student") && (
              <span className="absolute -bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary dark:bg-gold" />
            )}
          </div>
          <span>{isDriver ? "الركاب" : "حسابي"}</span>
        </Link>
      </div>
    </nav>
  );
};
