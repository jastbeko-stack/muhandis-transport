import React from "react";
import { Link } from "react-router-dom";
import {
  BusFront,
  Clock,
  Phone,
  MessageSquare,
  ChevronLeft,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { usePlatform } from "../context/PlatformContext";
import { formatPrice } from "../utils/formatters";

export const TripsPage: React.FC = () => {
  const { lines } = usePlatform();

  // Demo active trip based on user or first line
  const activeTrip = lines[0];

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f4f7f6] to-background py-6 px-4 pb-24">
      <div className="container max-w-xl mx-auto space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-black text-foreground font-display">رحلاتي</h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              متابعة اشتراكاتك والرحلات الجامعية اليومية في البصرة
            </p>
          </div>
          <span className="inline-flex items-center gap-1 text-[11px] font-bold bg-[#eaf4f2] text-[#246158] px-3 py-1 rounded-full border border-[#246158]/20">
            <span className="h-2 w-2 rounded-full bg-[#246158] animate-pulse" />
            خط نشط
          </span>
        </div>

        {/* Current Active Trip Card */}
        {activeTrip ? (
          <div className="bg-card border border-border/80 rounded-3xl p-5 shadow-lg space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-2xl bg-[#eaf4f2] dark:bg-[#246158]/20 flex items-center justify-center text-[#246158]">
                  <BusFront className="h-6 w-6 stroke-[2.2]" />
                </div>
                <div>
                  <h2 className="font-bold text-base text-foreground">
                    خط {activeTrip.fromArea} ⟵ {activeTrip.toArea}
                  </h2>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    كابتن: {activeTrip.driverName}
                  </p>
                </div>
              </div>
              <span className="text-xs font-black text-[#246158] bg-[#eaf4f2] dark:bg-[#246158]/20 px-2.5 py-1 rounded-xl">
                {activeTrip.monthlyPrice ? formatPrice(activeTrip.monthlyPrice) : "35,000 د.ع"}/شهر
              </span>
            </div>

            {/* Timeline Route */}
            <div className="space-y-3 py-1">
              <div className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <span className="h-3 w-3 rounded-full border-2 border-[#246158] bg-white dark:bg-card" />
                  <span className="w-0.5 h-7 bg-border" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">نقطة الانطلاق (صباحاً)</p>
                  <p className="text-sm font-bold text-foreground">
                    {activeTrip.fromArea} • {activeTrip.departTime || "07:30 ص"}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <span className="h-3 w-3 rounded-[3px] bg-[#9e4a2e] mt-1 shrink-0" />
                <div>
                  <p className="text-xs text-muted-foreground">الوجهة والعودة</p>
                  <p className="text-sm font-bold text-foreground">
                    {activeTrip.toArea} • العودة {activeTrip.returnTime || "02:00 م"}
                  </p>
                </div>
              </div>
            </div>

            {/* Vehicle & Status info */}
            <div className="grid grid-cols-2 gap-2 text-xs bg-muted/40 p-3 rounded-2xl">
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-4 w-4 text-[#246158]" />
                <span>مركبة: {activeTrip.vehicle?.model || "صالون كيا"}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-[#246158]" />
                <span>الالتزام: 98% دقة المواعيد</span>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2 pt-1">
              <Link
                to="/messages"
                className="flex-1 py-2.5 rounded-xl bg-[#286058] hover:bg-[#204e47] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
              >
                <MessageSquare className="h-4 w-4" />
                مراسلة الكابتن
              </Link>
              <a
                href={`tel:${activeTrip.driverPhone}`}
                className="flex-1 py-2.5 rounded-xl border border-border bg-card hover:bg-muted font-bold text-xs flex items-center justify-center gap-1.5 transition-all active:scale-95 text-foreground"
              >
                <Phone className="h-4 w-4 text-[#246158]" />
                اتصال هاتفي
              </a>
            </div>
          </div>
        ) : (
          <div className="bg-card border border-border rounded-3xl p-8 text-center space-y-3">
            <BusFront className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="font-bold text-base">لا توجد رحلات نشطة حالياً</h3>
            <p className="text-xs text-muted-foreground">
              يمكنك استعراض الخطوط المتوفرة لمنطقتك والاشتراك مباشرة
            </p>
            <Link
              to="/services"
              className="inline-flex items-center gap-2 bg-[#286058] text-white font-bold text-xs px-5 py-2.5 rounded-xl mt-2"
            >
              استعراض الخطوط
              <ChevronLeft className="h-4 w-4" />
            </Link>
          </div>
        )}

        {/* Other Options */}
        <div className="bg-card border border-border rounded-3xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-foreground">هل تبحث عن خط مخصص أو إضافي؟</h4>
              <p className="text-[11px] text-muted-foreground">
                اطلب تغطية لمنطقتك أو أضف خطك كـ كابتن
              </p>
            </div>
          </div>
          <Link
            to="/services"
            className="text-xs font-black text-[#246158] bg-[#eaf4f2] px-3 py-1.5 rounded-xl hover:bg-[#246158] hover:text-white transition-all shrink-0"
          >
            تصفح الخطوط
          </Link>
        </div>
      </div>
    </div>
  );
};
