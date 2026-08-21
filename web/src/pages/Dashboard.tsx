import { useCallback, useMemo, useState } from "react";
import {
  BusFront,
  CheckCircle2,
  ClipboardList,
  Crown,
  Lock,
  LogOut,
  MapPinned,
  RotateCcw,
  Star,
  Trash2,
  UserCog,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";

import { DriverAvatar } from "@/components/lines/DriverAvatar";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ADMIN_PASSCODE, UNIVERSITIES, VIP_FEE } from "@/data/seed";
import { formatIqd, genderLabel, relativeArabicDate, shiftLabel } from "@/lib/format";
import type { Line } from "@/lib/types";
import { usePlatform } from "@/store/PlatformStore";

function universityName(id: string): string {
  return UNIVERSITIES.find((u) => u.id === id)?.name ?? "—";
}

function StatCard({
  icon: Icon,
  label,
  value,
  tone,
}: {
  icon: typeof BusFront;
  label: string;
  value: number;
  tone: "gold" | "blue" | "orange";
}) {
  const ring =
    tone === "gold"
      ? "text-gold ring-gold/45 bg-gold/10"
      : tone === "blue"
        ? "text-sky-400 ring-sky-400/45 bg-sky-400/10"
        : "text-orange-400 ring-orange-400/45 bg-orange-400/10";

  return (
    <article className="admin-card flex items-center justify-between gap-4 p-5">
      <div className="text-end">
        <p className="text-sm font-semibold text-white/65">{label}</p>
        <p className="font-display text-4xl font-black text-white">{value}</p>
      </div>
      <span className={`grid h-16 w-16 place-items-center rounded-full ring-2 ${ring}`}>
        <Icon className="h-8 w-8" aria-hidden="true" />
      </span>
    </article>
  );
}

function LoginGate() {
  const { signIn } = usePlatform();
  const [passcode, setPasscode] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (signIn(passcode)) {
        setError("");
        toast.success("مرحباً بك في لوحة التحكم");
        return;
      }
      setError("رمز الدخول غير صحيح، حاول مجدداً.");
    },
    [passcode, signIn],
  );

  return (
    <div className="admin-panel flex min-h-[70vh] items-center justify-center px-5 py-16">
      <form onSubmit={handleSubmit} className="admin-card w-full max-w-md space-y-5 p-8">
        <span className="grid h-14 w-14 place-items-center rounded-2xl bg-gold/15 text-gold ring-1 ring-gold/40">
          <Lock className="h-7 w-7" aria-hidden="true" />
        </span>
        <div>
          <h1 className="font-display text-2xl font-extrabold text-white">لوحة تحكم خطوط المهندس</h1>
          <p className="mt-1 text-sm text-white/65">هذه المنطقة مخصصة للمشرف. أدخل رمز الدخول للمتابعة.</p>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="passcode" className="text-white/80">
            رمز الدخول
          </Label>
          <Input
            id="passcode"
            type="password"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            placeholder="••••"
            className="h-12 rounded-xl border-white/15 bg-white/5 text-white placeholder:text-white/35"
            autoComplete="current-password"
          />
          {error ? <p className="text-sm font-semibold text-destructive">{error}</p> : null}
          <p className="text-xs text-white/45">رمز العرض التجريبي: {ADMIN_PASSCODE}</p>
        </div>

        <Button type="submit" className="h-12 w-full rounded-xl text-base font-bold active:scale-[0.99]">
          دخول
        </Button>
      </form>
    </div>
  );
}

function PendingRow({ line }: { line: Line }) {
  const { approveLine, rejectLine } = usePlatform();

  const handleApprove = useCallback(
    (asVip: boolean): void => {
      approveLine(line.id, asVip);
      toast.success(asVip ? "تم نشر الخط كخط مميز VIP" : "تم نشر الخط كخط عادي");
    },
    [approveLine, line.id],
  );

  const handleReject = useCallback((): void => {
    rejectLine(line.id);
    toast("تم رفض الطلب", { description: `${line.driverName} — ${line.fromArea} ← ${line.toArea}` });
  }, [line.driverName, line.fromArea, line.toArea, rejectLine]);

  return (
    <tr className="border-b border-white/10 align-top last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <DriverAvatar name={line.driverName} ring="gold" />
          <div>
            <p className="font-bold text-white">{line.driverName}</p>
            <p dir="ltr" className="text-start text-sm text-sky-300">
              {line.driverPhone}
            </p>
            <p className="mt-1 text-xs text-white/45">{relativeArabicDate(line.createdAt)}</p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-white/80">{universityName(line.universityId)}</td>
      <td className="p-4 text-sm font-semibold text-white">
        {line.fromArea} ← {line.toArea}
        <p className="mt-1 text-xs font-normal text-white/50">
          {shiftLabel(line.shift)} · {line.vehicle.model}
        </p>
      </td>
      <td className="p-4">
        <span
          className={`inline-flex rounded-full px-3 py-1 text-xs font-bold ring-1 ${
            line.gender === "girls" ? "bg-girls/10 text-girls ring-girls/30" : "bg-mixed/10 text-mixed ring-mixed/30"
          }`}
        >
          {genderLabel(line.gender)}
        </span>
      </td>
      <td className="p-4 text-sm font-bold text-white">{formatIqd(line.monthlyPrice)}</td>
      <td className="p-4">
        {line.vipRequested ? (
          <span className="inline-flex items-center gap-1 rounded-lg bg-gold/10 px-3 py-1 text-xs font-bold text-gold ring-1 ring-gold/40">
            <Star className="h-3.5 w-3.5" aria-hidden="true" />
            طلب VIP
          </span>
        ) : (
          <span className="text-xs text-white/40">—</span>
        )}
      </td>
      <td className="p-4">
        <div className="flex min-w-52 flex-col gap-2">
          <Button
            type="button"
            onClick={() => handleApprove(false)}
            className="h-10 justify-start gap-2 rounded-lg bg-emerald-500/15 text-sm font-bold text-emerald-300 ring-1 ring-emerald-400/40 hover:bg-emerald-500/25"
          >
            <CheckCircle2 className="h-4 w-4" aria-hidden="true" />
            موافقة ونشر كـ خط عادي
          </Button>
          <Button
            type="button"
            onClick={() => handleApprove(true)}
            className="h-auto flex-col items-start gap-0.5 rounded-lg bg-gold/12 py-2 text-sm font-bold text-gold ring-1 ring-gold/45 hover:bg-gold/20"
          >
            <span className="flex items-center gap-2">
              <Crown className="h-4 w-4" aria-hidden="true" />
              موافقة ونشر كـ VIP
            </span>
            <span className="text-[11px] font-normal text-gold/70">
              {line.vipFeePaid ? `تم استلام ${formatIqd(VIP_FEE)}` : `بانتظار رسم ${formatIqd(VIP_FEE)}`}
            </span>
          </Button>
          <Button
            type="button"
            onClick={handleReject}
            className="h-10 justify-start gap-2 rounded-lg bg-destructive/15 text-sm font-bold text-red-300 ring-1 ring-destructive/40 hover:bg-destructive/25"
          >
            <XCircle className="h-4 w-4" aria-hidden="true" />
            رفض
          </Button>
        </div>
      </td>
    </tr>
  );
}

function ActiveRow({ line }: { line: Line }) {
  const { toggleVip, removeLine } = usePlatform();

  return (
    <tr className="border-b border-white/10 last:border-0">
      <td className="p-4">
        <div className="flex items-center gap-3">
          <DriverAvatar name={line.driverName} size="sm" ring={line.isVip ? "gold" : "muted"} />
          <div>
            <p className="font-bold text-white">{line.driverName}</p>
            <p dir="ltr" className="text-start text-sm text-sky-300">
              {line.driverPhone}
            </p>
          </div>
        </div>
      </td>
      <td className="p-4 text-sm text-white/80">{universityName(line.universityId)}</td>
      <td className="p-4 text-sm font-semibold text-white">
        {line.fromArea} ← {line.toArea}
      </td>
      <td className="p-4 text-sm text-white/80">{line.seatsAvailable} مقعد</td>
      <td className="p-4 text-sm font-bold text-white">{formatIqd(line.monthlyPrice)}</td>
      <td className="p-4">
        <div className="flex flex-wrap gap-2">
          <Button
            type="button"
            onClick={() => toggleVip(line.id)}
            className={`h-10 gap-2 rounded-lg text-sm font-bold ring-1 ${
              line.isVip
                ? "bg-gold/20 text-gold ring-gold/50 hover:bg-gold/30"
                : "bg-white/5 text-white/75 ring-white/15 hover:bg-white/10"
            }`}
          >
            <Crown className="h-4 w-4" aria-hidden="true" />
            {line.isVip ? "إلغاء VIP" : "ترقية VIP"}
          </Button>
          <Button
            type="button"
            onClick={() => {
              removeLine(line.id);
              toast("تم حذف الخط من المنصة");
            }}
            aria-label={`حذف خط ${line.driverName}`}
            className="h-10 w-10 rounded-lg bg-destructive/15 p-0 text-red-300 ring-1 ring-destructive/40 hover:bg-destructive/25"
          >
            <Trash2 className="h-4 w-4" aria-hidden="true" />
          </Button>
        </div>
      </td>
    </tr>
  );
}

export default function Dashboard() {
  const { isAdmin, signOut, activeLines, pendingLines, vipLines, coverageRequests, resetDemoData } = usePlatform();

  const tableHeadClass = "p-4 text-sm font-bold text-white/60";
  const stats = useMemo(
    () => ({ pending: pendingLines.length, active: activeLines.length, vip: vipLines.length }),
    [activeLines.length, pendingLines.length, vipLines.length],
  );

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen flex-col">
        <SiteHeader />
        <main className="flex-1">
          <LoginGate />
        </main>
        <SiteFooter />
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="admin-panel flex-1 py-10 text-white">
        <div className="container space-y-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl font-black text-white">لوحة تحكم خطوط المهندس</h1>
              <p className="mt-2 inline-flex items-center gap-2 rounded-lg bg-white/5 px-3 py-1.5 text-sm text-white/70 ring-1 ring-white/10">
                <UserCog className="h-4 w-4 text-gold" aria-hidden="true" />
                المشرف: {ADMIN_PASSCODE}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                onClick={() => {
                  resetDemoData();
                  toast("تمت إعادة البيانات التجريبية");
                }}
                className="h-11 gap-2 rounded-xl bg-white/5 text-sm font-bold text-white/80 ring-1 ring-white/15 hover:bg-white/10"
              >
                <RotateCcw className="h-4 w-4" aria-hidden="true" />
                إعادة البيانات
              </Button>
              <Button
                type="button"
                onClick={signOut}
                className="h-11 gap-2 rounded-xl bg-destructive/15 text-sm font-bold text-red-300 ring-1 ring-destructive/45 hover:bg-destructive/25"
              >
                <LogOut className="h-4 w-4" aria-hidden="true" />
                تسجيل الخروج
              </Button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            <StatCard icon={ClipboardList} label="طلبات قيد المراجعة" value={stats.pending} tone="orange" />
            <StatCard icon={BusFront} label="الخطوط النشطة" value={stats.active} tone="blue" />
            <StatCard icon={Star} label="الخطوط المميزة VIP" value={stats.vip} tone="gold" />
          </div>

          <Tabs defaultValue="pending" className="admin-card p-4 sm:p-5">
            <TabsList className="grid w-full grid-cols-1 gap-2 bg-transparent p-0 sm:grid-cols-3">
              <TabsTrigger
                value="pending"
                className="h-12 gap-2 rounded-xl bg-white/5 text-sm font-bold text-white/65 ring-1 ring-white/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ClipboardList className="h-4 w-4" aria-hidden="true" />
                طلبات تنتظر الموافقة ({stats.pending})
              </TabsTrigger>
              <TabsTrigger
                value="active"
                className="h-12 gap-2 rounded-xl bg-white/5 text-sm font-bold text-white/65 ring-1 ring-white/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BusFront className="h-4 w-4" aria-hidden="true" />
                الخطوط النشطة ({stats.active})
              </TabsTrigger>
              <TabsTrigger
                value="coverage"
                className="h-12 gap-2 rounded-xl bg-white/5 text-sm font-bold text-white/65 ring-1 ring-white/10 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MapPinned className="h-4 w-4" aria-hidden="true" />
                طلبات تغطية ({coverageRequests.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pending" className="mt-5">
              {pendingLines.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/55">لا توجد طلبات قيد المراجعة حالياً.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
                  <table className="w-full min-w-[900px] text-start">
                    <thead className="bg-white/5">
                      <tr>
                        <th className={tableHeadClass}>السائق</th>
                        <th className={tableHeadClass}>الجامعة</th>
                        <th className={tableHeadClass}>خط المسار</th>
                        <th className={tableHeadClass}>نوع المواصلات</th>
                        <th className={tableHeadClass}>السعر الشهري</th>
                        <th className={tableHeadClass}>طلب VIP</th>
                        <th className={tableHeadClass}>الإجراءات</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pendingLines.map((line) => (
                        <PendingRow key={line.id} line={line} />
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </TabsContent>

            <TabsContent value="active" className="mt-5">
              <div className="overflow-x-auto rounded-xl ring-1 ring-white/10">
                <table className="w-full min-w-[880px] text-start">
                  <thead className="bg-white/5">
                    <tr>
                      <th className={tableHeadClass}>السائق</th>
                      <th className={tableHeadClass}>الجامعة</th>
                      <th className={tableHeadClass}>خط المسار</th>
                      <th className={tableHeadClass}>المقاعد</th>
                      <th className={tableHeadClass}>السعر الشهري</th>
                      <th className={tableHeadClass}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {activeLines.map((line) => (
                      <ActiveRow key={line.id} line={line} />
                    ))}
                  </tbody>
                </table>
              </div>
            </TabsContent>

            <TabsContent value="coverage" className="mt-5">
              {coverageRequests.length === 0 ? (
                <p className="py-12 text-center text-sm text-white/55">
                  لم تصل طلبات تغطية بعد. تصل هنا طلبات الطلبة الذين لا تغطيهم الخطوط الحالية.
                </p>
              ) : (
                <ul className="space-y-3">
                  {coverageRequests.map((request) => (
                    <li key={request.id} className="flex flex-wrap items-center gap-4 rounded-xl bg-white/5 p-4 ring-1 ring-white/10">
                      <DriverAvatar name={request.studentName} size="sm" />
                      <div className="min-w-40">
                        <p className="font-bold text-white">{request.studentName}</p>
                        <p dir="ltr" className="text-start text-sm text-sky-300">
                          {request.phone}
                        </p>
                      </div>
                      <p className="text-sm text-white/75">{universityName(request.universityId)}</p>
                      <p className="text-sm text-white/75">المنطقة: {request.area}</p>
                      <a
                        href={`https://maps.google.com/?q=${request.point.lat.toFixed(4)},${request.point.lng.toFixed(4)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="ms-auto inline-flex items-center gap-1.5 rounded-lg bg-primary/20 px-3 py-2 text-sm font-bold text-sky-200 ring-1 ring-primary/40 transition-colors hover:bg-primary/30"
                      >
                        <MapPinned className="h-4 w-4" aria-hidden="true" />
                        عرض الموقع
                      </a>
                    </li>
                  ))}
                </ul>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <SiteFooter />
    </div>
  );
}
