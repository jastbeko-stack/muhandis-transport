import { useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { BusFront, Home } from "lucide-react";

import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404: مسار غير موجود:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="hero-grid relative flex min-h-screen items-center justify-center overflow-hidden brand-surface px-5 text-white">
      <div className="relative animate-fade-up text-center">
        <span className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/40">
          <BusFront className="h-9 w-9" aria-hidden="true" />
        </span>
        <h1 className="font-display text-6xl font-black">404</h1>
        <p className="mt-3 text-lg text-white/80">هذا الخط غير موجود على المنصة</p>
        <Button asChild className="mt-6 h-12 gap-2 rounded-xl bg-gold px-6 text-base font-bold text-navy-deep hover:bg-gold/90">
          <Link to="/">
            <Home className="h-5 w-5" aria-hidden="true" />
            العودة للرئيسية
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
