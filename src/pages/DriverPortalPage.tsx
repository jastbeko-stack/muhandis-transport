import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Bus,
  Crown,
  Phone,
  Clock,
  MapPin,
  CheckCircle2,
  Users,
  PlusCircle,
  MessageSquare,
  Sparkles,
  LogOut,
  GraduationCap,
  Star,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES, VIP_FEE } from "../data/initialData";
import { formatPrice } from "../utils/formatters";
import { DriverAvatar } from "../components/common/DriverAvatar";
import { AddLineModal } from "../components/modals/AddLineModal";
import { toast } from "sonner";

export const DriverPortalPage: React.FC = () => {
  const { user, logout, switchRole } = useAuth();
  const { lines, studentRequests, approveLine, updateLineSeats } = usePlatform();
  const [addLineOpen, setAddLineOpen] = useState(false);

  // Find driver's line matching current user's phone or name
  const driverLine = lines.find((l) => (user?.phone && l.driverPhone === user?.phone) || (user?.name && l.driverName === user?.name));

  const [availableSeats, setAvailableSeats] = useState(
    driverLine ? driverLine.seatsAvailable : (user?.totalSeats || 4)
  );

  const totalSeats = driverLine ? driverLine.vehicle.seats : (user?.totalSeats || 4);
  const occupiedSeats = Math.max(0, totalSeats - availableSeats);
  const monthlyPrice = driverLine ? driverLine.monthlyPrice : 35000;
  const estimatedIncome = occupiedSeats * monthlyPrice;
  const university = UNIVERSITIES.find((u) => u.id === driverLine?.universityId);

  const handleUpdateSeats = (newCount: number) => {
    if (newCount < 0 || newCount > totalSeats) return;
    setAvailableSeats(newCount);
    if (driverLine) {
      updateLineSeats(driverLine.id, newCount);
    }
    toast.success(`تم تحديث المقاعد المتاحة إلى: ${newCount}`);
  };

  const handleRequestVip = () => {
    if (driverLine) {
      approveLine(driverLine.id, true);
      toast.success("تم تفعيل طلب الترقية إلى VIP بإطار ذهبي!");
    }
  };

  return (
    <div className="flex-1 bg-background py-6 sm:py-10">
      <div className="container max-w-4xl space-y-6">
        {/* Driver Profile Header Card */}
        <div className="card-surface relative overflow-hidden p-6 sm:p-8 bg-gradient-to-b from-navy/5 via-card to-card border-border shadow-lg">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-start">
            <DriverAvatar
              name={user?.name || "كابتن الخط"}
              size="lg"
              ring={driverLine?.isVip ? "gold" : "muted"}
              className="h-16 w-16 text-xl shadow-md"
            />
            <div className="flex-1 space-y-1.5">
              <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                <h1 className="font-display text-2xl font-black text-foreground">
                  {user?.name || "كابتن الخط"}
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-gold/15 px-3 py-0.5 text-xs font-black text-navy-deep dark:text-gold ring-1 ring-gold/30">
                  <Bus className="h-3 w-3" />
                  كابتن معتمد
                </span>
                {driverLine?.isVip && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-amber-500/15 px-3 py-0.5 text-xs font-black text-amber-500 ring-1 ring-amber-500/30">
                    <Crown className="h-3 w-3 fill-amber-500" />
                    خط مميز VIP
                  </span>
                )}
              </div>

              <p className="flex items-center justify-center sm:justify-start gap-2 text-xs text-muted-foreground font-mono" dir="ltr">
                <span>{user?.phone || "07701234567"}</span>
                <Phone className="h-3.5 w-3.5 text-primary" />
              </p>

              <p className="text-xs text-muted-foreground">
                المركبة: <span className="font-bold text-foreground">{driverLine?.vehicle.model || "صالون كيا سيراتو"}</span> • السعة: {totalSeats} مقاعد
              </p>
            </div>

            {/* Switch to Student or Logout */}
            <div className="flex flex-wrap items-center justify-center gap-2">
              <button
                type="button"
                onClick={() => switchRole("student")}
                className="flex items-center gap-1.5 rounded-xl border border-border bg-card px-3 py-2 text-xs font-bold text-foreground hover:bg-muted active:scale-95"
              >
                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                وضع الطالب
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

        {/* Realtime Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 sm:gap-4">
          {/* Card 1: Seats Available */}
          <div className="card-surface p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">المقاعد المتاحة</span>
            <div className="my-2 flex items-baseline gap-2">
              <span className="font-display text-3xl font-black text-primary dark:text-gold">
                {availableSeats}
              </span>
              <span className="text-xs text-muted-foreground">من {totalSeats}</span>
            </div>
            {/* Quick seat adjustment buttons */}
            <div className="flex gap-1.5 pt-1">
              <button
                type="button"
                onClick={() => handleUpdateSeats(availableSeats + 1)}
                disabled={availableSeats >= totalSeats}
                className="flex-1 rounded-lg bg-muted py-1 text-xs font-extrabold hover:bg-muted/80 disabled:opacity-40"
              >
                + مقعد
              </button>
              <button
                type="button"
                onClick={() => handleUpdateSeats(availableSeats - 1)}
                disabled={availableSeats <= 0}
                className="flex-1 rounded-lg bg-muted py-1 text-xs font-extrabold hover:bg-muted/80 disabled:opacity-40"
              >
                - مقعد
              </button>
            </div>
          </div>

          {/* Card 2: Occupied Passengers */}
          <div className="card-surface p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">الركاب المشتركين</span>
            <div className="my-2">
              <span className="font-display text-3xl font-black text-emerald-500">
                {occupiedSeats}
              </span>
              <span className="text-xs text-muted-foreground mr-1">طالب</span>
            </div>
            <span className="text-[11px] font-bold text-success flex items-center gap-1">
              <CheckCircle2 className="h-3.5 w-3.5" />
              مؤكدين
            </span>
          </div>

          {/* Card 3: Estimated Monthly Income */}
          <div className="card-surface p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">الدخل التقديري</span>
            <div className="my-2">
              <span className="font-display text-2xl sm:text-3xl font-black text-gold">
                {formatPrice(estimatedIncome)}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">شهرياً من الخط</span>
          </div>

          {/* Card 4: Line Rating */}
          <div className="card-surface p-4 sm:p-5 flex flex-col justify-between">
            <span className="text-[11px] sm:text-xs font-bold text-muted-foreground">تقييم الطلاب</span>
            <div className="my-2 flex items-center gap-1.5">
              <Star className="h-6 w-6 text-amber-500 fill-amber-500" />
              <span className="font-display text-3xl font-black text-foreground">
                {driverLine?.rating ? driverLine.rating.toFixed(1) : "5.0"}
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground">
              {driverLine?.ratingCount || 12} تقييماً معتمداً
            </span>
          </div>
        </div>

        {/* Active Line Details & Quick Controls */}
        <div className="card-surface p-6 sm:p-7 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-border pb-4">
            <div className="flex items-center gap-2">
              <Bus className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-black text-foreground">
                خطك المنشور حالياً
              </h2>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setAddLineOpen(true)}
                className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-bold text-primary-foreground shadow-sm hover:bg-primary/90"
              >
                <PlusCircle className="h-4 w-4" />
                إضافة خط إضافي
              </button>
            </div>
          </div>

          {driverLine ? (
            <div className="grid gap-4 sm:grid-cols-2">
              {/* Route Info */}
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">المسار والجامعة</p>
                <div className="flex items-center gap-2 font-display text-lg font-extrabold text-foreground">
                  <span>{driverLine.fromArea}</span>
                  <span className="text-muted-foreground">←</span>
                  <span className="text-primary dark:text-gold">{driverLine.toArea}</span>
                </div>
                <p className="flex items-center gap-1 text-xs text-muted-foreground">
                  <MapPin className="h-3.5 w-3.5 text-primary" />
                  {university?.name || driverLine.toArea}
                </p>
              </div>

              {/* Timings & Price */}
              <div className="rounded-2xl border border-border bg-muted/20 p-4 space-y-2">
                <p className="text-xs font-bold text-muted-foreground">المواعيد والتسعيرة</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-bold text-foreground">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span>الذهاب {driverLine.departTime} — العودة {driverLine.returnTime}</span>
                  </div>
                </div>
                <p className="font-display text-base font-black text-primary dark:text-gold">
                  {formatPrice(driverLine.monthlyPrice)} <span className="text-xs text-muted-foreground font-normal">/ شهرياً لكل طالب</span>
                </p>
              </div>
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border p-6 text-center space-y-2">
              <Bus className="h-8 w-8 text-muted-foreground mx-auto opacity-50" />
              <p className="text-xs font-bold text-foreground">لم تقم بإضافة خط حتى الآن</p>
              <p className="text-[11px] text-muted-foreground">
                أضف خطك الآن ليظهر لجميع طلاب كليات وجامعات البصرة.
              </p>
            </div>
          )}

          {/* VIP Upgrade Callout for Driver */}
          {driverLine && !driverLine?.isVip && (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/10 via-card to-card p-4">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold text-navy-deep shadow-md">
                  <Crown className="h-6 w-6 fill-navy-deep" />
                </span>
                <div>
                  <h4 className="font-display text-sm font-black text-foreground">
                    هل ترغب بظهور خطك في أعلى الصفحة الرئيسية؟
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    الترقية إلى خط مميز VIP تمنحك إطاراً ذهبياً وأولوية ظهور أمام أكثر من 5,000 طالب وطالبة.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={handleRequestVip}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 rounded-xl bg-gold px-5 py-2.5 text-xs font-black text-navy-deep shadow-md hover:bg-gold/90 active:scale-95"
              >
                <Sparkles className="h-4 w-4" />
                ترقية خطي VIP الآن ({formatPrice(VIP_FEE)})
              </button>
            </div>
          )}
        </div>

        {/* Incoming Student Booking Requests */}
        <div className="card-surface p-6 sm:p-7 space-y-4">
          <div className="flex items-center justify-between border-b border-border pb-3">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              <h2 className="font-display text-lg font-black text-foreground">
                طلبات حجز الطلبة الأخيرة
              </h2>
            </div>
            <span className="rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-bold text-primary dark:text-gold">
              {studentRequests.length} طلبات
            </span>
          </div>

          {studentRequests.length === 0 ? (
            <div className="py-8 text-center space-y-2">
              <Users className="h-10 w-10 text-muted-foreground mx-auto opacity-40" />
              <p className="text-xs font-bold text-foreground">لا توجد طلبات حجز حالياً</p>
              <p className="text-[11px] text-muted-foreground">
                ستظهر هنا طلبات الطلاب المفتوحة الباحثين عن خطوط تناسب مناطقهم.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-border">
              {studentRequests.slice(0, 5).map((req) => (
                <div
                  key={req.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 py-3.5"
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-display text-sm font-extrabold text-foreground">
                        {req.studentName}
                      </span>
                      <span className="text-[10px] text-muted-foreground">{req.createdAt}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {req.college || req.universityName} • <span className="text-foreground">{req.area}</span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to="/messages"
                      className="flex items-center gap-1.5 rounded-xl bg-[#286058] hover:bg-[#204e47] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all active:scale-95"
                    >
                      <MessageSquare className="h-4 w-4" />
                      مراسلة داخل البرنامج
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <AddLineModal open={addLineOpen} onOpenChange={setAddLineOpen} />
    </div>
  );
};
