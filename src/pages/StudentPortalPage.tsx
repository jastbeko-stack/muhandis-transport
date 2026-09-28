import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  GraduationCap,
  Bus,
  MapPin,
  Clock,
  MapPinned,
  Search,
  LogOut,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES } from "../data/initialData";
import { formatPrice } from "../utils/formatters";
import { DriverAvatar } from "../components/common/DriverAvatar";
import { RequestCoverageModal } from "../components/modals/RequestCoverageModal";

export const StudentPortalPage: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { activeLines } = usePlatform();
  const [coverageOpen, setCoverageOpen] = useState(false);

  const university = UNIVERSITIES.find((u) => u.id === user?.universityId) || UNIVERSITIES[0];

  // Mock student's active transport booking
  const myBookedLine = activeLines.find((l) => l.id === "ln-001") || activeLines[0];

  return (
    <div className="flex-1 bg-background py-6 sm:py-10">
      <div className="container max-w-4xl space-y-6">
        {/* Student Profile Card */}
        <div className="card-surface p-6 sm:p-8 bg-gradient-to-b from-primary/5 via-card to-card border-border shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
            <div className="grid h-16 w-16 place-items-center rounded-2xl bg-primary text-primary-foreground shadow-md text-2xl font-black">
              <GraduationCap className="h-9 w-9" />
            </div>

            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl font-black text-foreground">
                  {user?.name || "طالب جامعي"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-3 py-0.5 text-xs font-bold text-primary dark:text-gold">
                  طالب معتمد 🎓
                </span>
              </div>

              <p className="flex items-center justify-center sm:justify-start gap-1 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 text-primary" />
                <span>{university.name}</span>
                <span>•</span>
                <span>منطقة السكن: {user?.area || "الزبير"}</span>
              </p>
            </div>

            {/* Switch Role or Logout */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => switchRole("driver")}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted active:scale-95"
              >
                <Bus className="h-3.5 w-3.5 text-gold" />
                وضع السائق
              </button>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-1.5 rounded-xl bg-destructive/10 px-3 py-2 text-xs font-bold text-destructive hover:bg-destructive/20 active:scale-95"
              >
                <LogOut className="h-3.5 w-3.5" />
                خروج
              </button>
            </div>
          </div>
        </div>

        {/* Quick Student Actions Bar */}
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <Link
            to="/services"
            className="card-surface p-4 sm:p-5 flex items-center gap-3.5 transition-all hover:border-primary/40 group active:scale-98"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary group-hover:scale-105 transition-transform">
              <Search className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-sm font-black text-foreground">
                تصفح كل الخطوط
              </h3>
              <p className="text-[11px] text-muted-foreground">
                البحث عن خط لجامعتك
              </p>
            </div>
          </Link>

          <button
            type="button"
            onClick={() => setCoverageOpen(true)}
            className="card-surface p-4 sm:p-5 flex items-center gap-3.5 text-start transition-all hover:border-gold/50 group active:scale-98"
          >
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold/15 text-gold group-hover:scale-105 transition-transform">
              <MapPinned className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-sm font-black text-foreground">
                طلب خط جديد
              </h3>
              <p className="text-[11px] text-muted-foreground">
                إذا لم تجد خطاً لمنطقتك
              </p>
            </div>
          </button>
        </div>

        {/* My Current Transport Line */}
        <div className="card-surface p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-black text-foreground">
                خطي اليومي النشط
              </h2>
            </div>
            <span className="rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-bold text-emerald-600 dark:text-emerald-400">
              مشترك حالياً
            </span>
          </div>

          {myBookedLine ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-border bg-muted/20 p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <DriverAvatar name={myBookedLine.driverName} size="md" ring="gold" />
                    <div>
                      <h4 className="font-display text-base font-black text-foreground">
                        {myBookedLine.driverName}
                      </h4>
                      <p className="text-xs text-muted-foreground">
                        {myBookedLine.vehicle.model} • {myBookedLine.vehicle.seats} راكب
                      </p>
                    </div>
                  </div>

                  <div className="text-end">
                    <span className="font-display text-lg font-black text-primary dark:text-gold">
                      {formatPrice(myBookedLine.monthlyPrice)}
                    </span>
                    <span className="block text-[10px] text-muted-foreground">اشتراك شهري</span>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-foreground pt-1">
                  <span className="flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 text-primary" />
                    المسار: {myBookedLine.fromArea} ← {myBookedLine.toArea}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    الذهاب {myBookedLine.departTime} — العودة {myBookedLine.returnTime}
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-muted-foreground text-sm">
              لم تشترك في خط نقل بعد. تصفح الخطوط المتاحة واحجز مقعدك الآن.
            </div>
          )}
        </div>
      </div>

      <RequestCoverageModal open={coverageOpen} onOpenChange={setCoverageOpen} />
    </div>
  );
};
