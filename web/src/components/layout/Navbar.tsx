import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  BusFront,
  House,
  LayoutList,
  Gauge,
  Sun,
  Moon,
  UserPlus,
  GraduationCap,
  Bus,
  LogOut,
  MessageSquare,
  ClipboardList,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { cn } from "../../utils/formatters";

interface NavbarProps {
  onOpenAddLine?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenAddLine }) => {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, logout, switchRole } = useAuth();

  const isActive = (path: string) => {
    if (path === "/") {
      return location.pathname === "/";
    }
    if (path === "/requests") {
      return location.pathname.startsWith("/requests") || (user?.role === "driver" && location.pathname.startsWith("/services"));
    }
    return location.pathname.startsWith(path);
  };

  const navItems =
    user?.role === "driver"
      ? [
          { to: "/driver", label: "لوحة السائق", icon: Gauge },
          { to: "/", label: "الخريطة المباشرة", icon: House },
          { to: "/requests", label: "طلبات الخطوط", icon: ClipboardList },
          { to: "/trips", label: "ركاب خطي", icon: BusFront },
          { to: "/messages", label: "الرسائل", icon: MessageSquare },
        ]
      : [
          { to: "/", label: "الرئيسية", icon: House },
          { to: "/services", label: "الخطوط المعتمدة", icon: LayoutList },
          { to: "/trips", label: "رحلاتي", icon: BusFront },
          { to: "/messages", label: "الرسائل", icon: MessageSquare },
          { to: "/student", label: "ملفي الجامعي", icon: GraduationCap },
        ];

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 brand-surface backdrop-blur-md">
      <div className="container flex h-16 items-center justify-between gap-4">
        {/* Logo */}
        <Link
          to="/"
          className="group flex items-center gap-2.5 rounded-xl px-1 py-1"
          aria-label="خطوط المهندس — الصفحة الرئيسية"
        >
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/40 transition-transform group-hover:-rotate-6">
            <BusFront className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">
            خطوط المهندس
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-2 rounded-xl px-3.5 py-2 text-sm font-bold transition-all",
                  active
                    ? "bg-white/15 text-gold shadow-sm ring-1 ring-white/20"
                    : "text-white/80 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden items-center gap-3 lg:flex">
          {/* User Role & Name Badge */}
          {user && (
            <div className="flex items-center gap-2 rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-xs text-white">
              {user.role === "student" ? (
                <GraduationCap className="h-4 w-4 text-gold" />
              ) : (
                <Bus className="h-4 w-4 text-gold" />
              )}
              <span className="font-bold">{user.name}</span>
              <span className="text-[10px] rounded-full bg-white/10 px-2 py-0.5 text-white/70">
                {user.role === "student" ? "طالب" : "سائق"}
              </span>

              <button
                type="button"
                onClick={() => switchRole(user.role === "student" ? "driver" : "student")}
                className="ms-1 text-[10px] font-bold text-gold hover:underline"
                title="التبديل بين وضع الطالب والسائق"
              >
                (تبديل)
              </button>

              <button
                type="button"
                onClick={logout}
                className="ms-1 text-white/50 hover:text-destructive"
                title="تسجيل الخروج"
              >
                <LogOut className="h-3.5 w-3.5" />
              </button>
            </div>
          )}

          {/* Theme Toggle */}
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            className="grid h-10 w-10 place-items-center rounded-xl border border-white/15 bg-white/5 text-white/80 transition-colors hover:bg-white/15 hover:text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-gold" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-white" aria-hidden="true" />
            )}
          </button>

          {/* Add Line Driver Button */}
          {onOpenAddLine && (
            <button
              type="button"
              onClick={onOpenAddLine}
              className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2 text-sm font-black text-navy-deep shadow-md transition-all hover:bg-gold/90 active:scale-95"
            >
              <UserPlus className="h-4 w-4" aria-hidden="true" />
              أضف خطك كـ سائق
            </button>
          )}
        </div>

        {/* Mobile Header Right */}
        <div className="flex items-center gap-2 lg:hidden">
          {/* User mini badge */}
          {user && (
            <Link
              to={user.role === "driver" ? "/driver" : "/student"}
              className="flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-2.5 py-1 text-[11px] font-bold text-white"
            >
              {user.role === "student" ? (
                <GraduationCap className="h-3.5 w-3.5 text-gold" />
              ) : (
                <Bus className="h-3.5 w-3.5 text-gold" />
              )}
              <span className="max-w-[70px] truncate">{user.name}</span>
            </Link>
          )}

          <button
            type="button"
            onClick={toggleTheme}
            aria-label="تغيير المظهر"
            className="grid h-9 w-9 place-items-center rounded-xl border border-white/15 bg-white/5 text-white"
          >
            {theme === "dark" ? (
              <Sun className="h-4 w-4 text-gold" />
            ) : (
              <Moon className="h-4 w-4 text-white" />
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
