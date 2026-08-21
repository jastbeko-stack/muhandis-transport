import { useCallback, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { BusFront, Gauge, Home, Info, LayoutList, Menu, Moon, Sun } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useTheme } from "@/store/ThemeProvider";

interface NavItem {
  to: string;
  label: string;
  icon: typeof Home;
}

const NAV_ITEMS: NavItem[] = [
  { to: "/", label: "الرئيسية", icon: Home },
  { to: "/services", label: "الخدمات", icon: LayoutList },
  { to: "/about", label: "عن المنصة", icon: Info },
  { to: "/dashboard", label: "لوحة التحكم", icon: Gauge },
];

function BrandMark() {
  return (
    <Link to="/" className="group flex items-center gap-3 rounded-xl px-1 py-1" aria-label="خطوط المهندس — الصفحة الرئيسية">
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/40 transition-transform group-hover:-rotate-6">
        <BusFront className="h-6 w-6" aria-hidden="true" />
      </span>
      <span className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl">خطوط المهندس</span>
    </Link>
  );
}

export function SiteHeader() {
  const location = useLocation();
  const { theme, toggleTheme } = useTheme();
  const [open, setOpen] = useState<boolean>(false);

  const isActive = useCallback(
    (to: string): boolean => (to === "/" ? location.pathname === "/" : location.pathname.startsWith(to)),
    [location.pathname],
  );

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 brand-surface">
      <div className="container flex h-16 items-center justify-between gap-4">
        <BrandMark />

        <nav className="hidden items-center gap-1 lg:flex" aria-label="التنقل الرئيسي">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.to);
            return (
              <Link
                key={item.to}
                to={item.to}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "relative flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold text-white/70 transition-colors hover:bg-white/10 hover:text-white",
                  active && "text-white",
                )}
              >
                <item.icon className="h-4 w-4" aria-hidden="true" />
                {item.label}
                <span
                  className={cn(
                    "absolute inset-x-3 -bottom-[13px] h-[3px] rounded-full bg-gold transition-opacity",
                    active ? "opacity-100" : "opacity-0",
                  )}
                  aria-hidden="true"
                />
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={toggleTheme}
            aria-label={theme === "dark" ? "تفعيل الوضع النهاري" : "تفعيل الوضع الليلي"}
            className="grid h-10 w-10 place-items-center rounded-full border border-white/15 bg-white/10 text-gold transition-colors hover:bg-white/20"
          >
            {theme === "dark" ? <Moon className="h-5 w-5" aria-hidden="true" /> : <Sun className="h-5 w-5" aria-hidden="true" />}
          </button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-white hover:bg-white/15 hover:text-white lg:hidden"
                aria-label="فتح القائمة"
              >
                <Menu className="h-5 w-5" aria-hidden="true" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72 border-white/10 brand-surface text-white">
              <SheetTitle className="mb-6 font-display text-lg text-white">القائمة</SheetTitle>
              <nav className="flex flex-col gap-1" aria-label="التنقل للجوال">
                {NAV_ITEMS.map((item) => (
                  <Link
                    key={item.to}
                    to={item.to}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-4 py-3 text-base font-semibold text-white/75 transition-colors hover:bg-white/10 hover:text-white",
                      isActive(item.to) && "bg-white/10 text-white ring-1 ring-gold/40",
                    )}
                  >
                    <item.icon className="h-5 w-5" aria-hidden="true" />
                    {item.label}
                  </Link>
                ))}
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
