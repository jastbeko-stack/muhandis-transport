import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  Lock,
  UserCog,
  RotateCcw,
  LogOut,
  CheckCircle,
  Crown,
  XCircle,
  Trash2,
  ExternalLink,
  MessageSquare,
  MapPin,
} from "lucide-react";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES, ADMIN_CODE } from "../data/initialData";
import { formatPrice, formatSeats, formatRelativeDate, createGoogleMapsUrl, cn } from "../utils/formatters";
import { DriverAvatar } from "../components/common/DriverAvatar";
import { toast } from "sonner";

export const DashboardPage: React.FC = () => {
  const {
    isAdmin,
    signIn,
    signOut,
    activeLines,
    pendingLines,
    vipLines,
    coverageRequests,
    approveLine,
    rejectLine,
    toggleVip,
    removeLine,
    resetDemoData,
  } = usePlatform();

  const [passcode, setPasscode] = useState("");
  const [activeTab, setActiveTab] = useState<"pending" | "active" | "requests">("pending");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = signIn(passcode);
    if (success) {
      toast.success("تم تسجيل الدخول بنجاح");
      setPasscode("");
    } else {
      toast.error("رمز المشرف غير صحيح");
    }
  };

  const handleResetData = () => {
    resetDemoData();
    toast.success("تمت إعادة البيانات التجريبية بنجاح");
  };

  if (!isAdmin) {
    return (
      <div className="flex flex-1 items-center justify-center p-6">
        <div className="card-surface w-full max-w-md p-8 text-center animate-fade-up">
          <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-primary/10 text-primary">
            <Lock className="h-7 w-7" />
          </div>
          <h2 className="font-display text-2xl font-black text-foreground">
            تسجيل الدخول للمشرف
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            أدخل الرمز السري للوصول إلى لوحة التحكم الإدارية
          </p>

          <form onSubmit={handleLogin} className="mt-6 space-y-4">
            <div>
              <input
                type="password"
                placeholder="أدخل رمز الدخول..."
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="h-12 w-full rounded-xl border border-input bg-background px-4 text-center font-mono text-base font-bold tracking-widest text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              type="submit"
              className="flex h-12 w-full items-center justify-center rounded-xl bg-primary font-display text-sm font-black text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
            >
              دخول المشرف
            </button>
          </form>

          <div className="mt-6 rounded-xl bg-muted/50 p-3 text-xs text-muted-foreground">
            رمز الدخول التجريبي: <span className="font-mono font-bold text-foreground">ht8k</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-panel flex-1 py-10 text-white">
      <div className="container space-y-8">
        {/* Top Header */}
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-black text-white">
              لوحة تحكم خطوط المهندس
            </h1>
            <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-xs text-white/70 ring-1 ring-white/10">
              <UserCog className="h-4 w-4 text-gold" aria-hidden="true" />
              المشرف: <span className="font-mono font-bold text-white">{ADMIN_CODE}</span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={handleResetData}
              className="flex h-10 items-center gap-2 rounded-xl bg-white/5 px-4 text-xs font-bold text-white/80 ring-1 ring-white/15 hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              إعادة البيانات
            </button>
            <button
              type="button"
              onClick={signOut}
              className="flex h-10 items-center gap-2 rounded-xl bg-destructive/15 px-4 text-xs font-bold text-red-300 ring-1 ring-destructive/40 hover:bg-destructive/25"
            >
              <LogOut className="h-4 w-4" />
              تسجيل الخروج
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="admin-card p-5">
            <p className="text-xs font-bold text-white/60">طلبات تنتظر الموافقة</p>
            <p className="mt-2 font-display text-3xl font-black text-amber-400">
              {pendingLines.length}
            </p>
          </div>

          <div className="admin-card p-5">
            <p className="text-xs font-bold text-white/60">الخطوط النشطة</p>
            <p className="mt-2 font-display text-3xl font-black text-emerald-400">
              {activeLines.length}
            </p>
          </div>

          <div className="admin-card p-5">
            <p className="text-xs font-bold text-white/60">الخطوط المميزة VIP</p>
            <p className="mt-2 font-display text-3xl font-black text-gold">
              {vipLines.length}
            </p>
          </div>

          <div className="admin-card p-5">
            <p className="text-xs font-bold text-white/60">طلبات التغطية</p>
            <p className="mt-2 font-display text-3xl font-black text-sky-400">
              {coverageRequests.length}
            </p>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="flex border-b border-white/10">
          <button
            type="button"
            onClick={() => setActiveTab("pending")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-all",
              activeTab === "pending"
                ? "border-gold text-gold"
                : "border-transparent text-white/60 hover:text-white"
            )}
          >
            <span>طلبات تنتظر الموافقة</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {pendingLines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("active")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-all",
              activeTab === "active"
                ? "border-gold text-gold"
                : "border-transparent text-white/60 hover:text-white"
            )}
          >
            <span>الخطوط النشطة</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {activeLines.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab("requests")}
            className={cn(
              "flex items-center gap-2 border-b-2 px-5 py-3 text-sm font-bold transition-all",
              activeTab === "requests"
                ? "border-gold text-gold"
                : "border-transparent text-white/60 hover:text-white"
            )}
          >
            <span>طلبات تغطية جديدة</span>
            <span className="rounded-full bg-white/10 px-2 py-0.5 text-xs">
              {coverageRequests.length}
            </span>
          </button>
        </div>

        {/* Tab 1: Pending Lines */}
        {activeTab === "pending" && (
          <div className="space-y-4">
            {pendingLines.length > 0 ? (
              pendingLines.map((line) => {
                const uni = UNIVERSITIES.find((u) => u.id === line.universityId);
                return (
                  <div
                    key={line.id}
                    className="admin-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <DriverAvatar name={line.driverName} size="sm" />
                        <h4 className="font-display text-base font-black text-white">
                          {line.driverName}
                        </h4>
                        <span className="font-mono text-xs text-white/60" dir="ltr">
                          {line.driverPhone}
                        </span>
                        {line.vipRequested && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-bold text-gold">
                            <Crown className="h-3 w-3 fill-gold" />
                            طلب ترقية VIP
                          </span>
                        )}
                      </div>

                      <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                        <span className="font-bold text-white">
                          {line.fromArea} ← {line.toArea} ({uni?.short})
                        </span>
                        <span>•</span>
                        <span>{line.vehicle.model}</span>
                        <span>•</span>
                        <span>{formatSeats(line.seatsAvailable)}</span>
                        <span>•</span>
                        <span className="font-bold text-gold">
                          {formatPrice(line.monthlyPrice)}
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          approveLine(line.id, false);
                          toast.success(`تمت الموافقة على خط ${line.driverName}`);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-emerald-500/20 px-3.5 py-2 text-xs font-bold text-emerald-300 ring-1 ring-emerald-500/40 hover:bg-emerald-500/30"
                      >
                        <CheckCircle className="h-3.5 w-3.5" />
                        موافقة عادي
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          approveLine(line.id, true);
                          toast.success(`تمت الموافقة على خط ${line.driverName} كـ VIP مميز`);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-gold/20 px-3.5 py-2 text-xs font-black text-gold ring-1 ring-gold/40 hover:bg-gold/30"
                      >
                        <Crown className="h-3.5 w-3.5 fill-gold" />
                        موافقة كـ VIP
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          rejectLine(line.id);
                          toast.error(`تم رفض خط ${line.driverName}`);
                        }}
                        className="flex items-center gap-1.5 rounded-xl bg-destructive/20 px-3.5 py-2 text-xs font-bold text-red-300 ring-1 ring-destructive/40 hover:bg-destructive/30"
                      >
                        <XCircle className="h-3.5 w-3.5" />
                        رفض
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="admin-card p-12 text-center text-white/60">
                لا توجد طلبات قيد المراجعة حالياً.
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Active Lines */}
        {activeTab === "active" && (
          <div className="space-y-4">
            {activeLines.map((line) => {
              const uni = UNIVERSITIES.find((u) => u.id === line.universityId);
              return (
                <div
                  key={line.id}
                  className="admin-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                >
                  <div className="space-y-2">
                    <div className="flex flex-wrap items-center gap-2">
                      <DriverAvatar name={line.driverName} size="sm" ring={line.isVip ? "gold" : "muted"} />
                      <h4 className="font-display text-base font-black text-white">
                        {line.driverName}
                      </h4>
                      <span className="font-mono text-xs text-white/60" dir="ltr">
                        {line.driverPhone}
                      </span>
                      {line.isVip && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gold/20 px-2.5 py-0.5 text-[11px] font-bold text-gold ring-1 ring-gold/40">
                          <Crown className="h-3 w-3 fill-gold" />
                          VIP
                        </span>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs text-white/70">
                      <span className="font-bold text-white">
                        {line.fromArea} ← {line.toArea} ({uni?.short})
                      </span>
                      <span>•</span>
                      <span>{line.vehicle.model}</span>
                      <span>•</span>
                      <span className="font-bold text-gold">
                        {formatPrice(line.monthlyPrice)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        toggleVip(line.id);
                        toast.success(line.isVip ? "تم إلغاء ترقية VIP" : "تمت ترقية الخط إلى VIP");
                      }}
                      className={cn(
                        "flex items-center gap-1.5 rounded-xl px-3.5 py-2 text-xs font-bold transition-all",
                        line.isVip
                          ? "bg-white/10 text-white/80 hover:bg-white/15"
                          : "bg-gold/20 text-gold ring-1 ring-gold/40 hover:bg-gold/30"
                      )}
                    >
                      <Crown className="h-3.5 w-3.5" />
                      {line.isVip ? "إلغاء VIP" : "ترقية VIP"}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        removeLine(line.id);
                        toast.error(`تم حذف خط ${line.driverName} من المنصة`);
                      }}
                      className="grid h-9 w-9 place-items-center rounded-xl bg-destructive/20 text-red-300 ring-1 ring-destructive/40 hover:bg-destructive/30"
                      title="حذف الخط"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Coverage Requests */}
        {activeTab === "requests" && (
          <div className="space-y-4">
            {coverageRequests.length > 0 ? (
              coverageRequests.map((req) => {
                const uni = UNIVERSITIES.find((u) => u.id === req.universityId);
                const mapLink = createGoogleMapsUrl(req.location.lat, req.location.lng);
                return (
                  <div
                    key={req.id}
                    className="admin-card flex flex-col justify-between gap-4 p-5 sm:flex-row sm:items-center"
                  >
                    <div className="space-y-1.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <h4 className="font-display text-base font-black text-white">
                          {req.studentName}
                        </h4>
                        <span className="font-mono text-xs text-white/60" dir="ltr">
                          {req.phone}
                        </span>
                        <span className="text-[10px] text-white/40">
                          {formatRelativeDate(req.createdAt)}
                        </span>
                      </div>
                      <p className="text-xs text-white/70">
                        المنطقة: <span className="font-bold text-white">{req.area}</span> • الجامعة:{" "}
                        <span className="font-bold text-white">{uni?.name || req.universityId}</span>
                      </p>
                    </div>

                    <div className="flex items-center gap-2">
                      <a
                        href={mapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 rounded-xl bg-white/10 px-3.5 py-2 text-xs font-bold text-white hover:bg-white/20"
                      >
                        <MapPin className="h-3.5 w-3.5 text-gold" />
                        عرض الموقع
                        <ExternalLink className="h-3 w-3" />
                      </a>

                      <Link
                        to="/messages"
                        className="flex items-center gap-1.5 rounded-xl bg-[#286058] hover:bg-[#204e47] px-3.5 py-2 text-xs font-bold text-white transition-all active:scale-95"
                      >
                        <MessageSquare className="h-3.5 w-3.5" />
                        مراسلة داخل البرنامج
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="admin-card p-12 text-center text-white/60">
                لم تصل طلبات تغطية بعد. تصل هنا طلبات الطلبة الذين لا تغطيهم الخطوط الحالية.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
