import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, BadgeCheck, Crown, ListChecks, MapPinned, Search, ShieldCheck, Sparkles, UserPlus } from "lucide-react";

import { BookLineDialog } from "@/components/dialogs/BookLineDialog";
import { CoverageRequestDialog } from "@/components/dialogs/CoverageRequestDialog";
import { DriverApplyDialog } from "@/components/dialogs/DriverApplyDialog";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { LineCard } from "@/components/lines/LineCard";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AREAS, UNIVERSITIES } from "@/data/seed";
import type { Line } from "@/lib/types";
import { usePlatform } from "@/store/PlatformStore";

interface QuickSearch {
  universityId: string;
  area: string;
  shift: string;
  gender: string;
}

const INITIAL_SEARCH: QuickSearch = {
  universityId: UNIVERSITIES[0].id,
  area: "all",
  shift: "all",
  gender: "all",
};

function SectionHeading({
  icon: Icon,
  title,
  subtitle,
  action,
}: {
  icon: typeof Crown;
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h2 className="flex items-center gap-2 font-display text-2xl font-extrabold text-foreground">
          <Icon className="h-6 w-6 text-gold" aria-hidden="true" />
          {title}
        </h2>
        {subtitle ? <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p> : null}
      </div>
      {action}
    </div>
  );
}

export default function Index() {
  const navigate = useNavigate();
  const { activeLines, vipLines } = usePlatform();
  const [search, setSearch] = useState<QuickSearch>(INITIAL_SEARCH);
  const [bookingLine, setBookingLine] = useState<Line | null>(null);
  const [driverOpen, setDriverOpen] = useState<boolean>(false);
  const [coverageOpen, setCoverageOpen] = useState<boolean>(false);

  const standardLines = useMemo(() => activeLines.filter((line) => !line.isVip).slice(0, 6), [activeLines]);

  const handleSearch = useCallback((): void => {
    const params = new URLSearchParams();
    params.set("university", search.universityId);
    if (search.area !== "all") params.set("area", search.area);
    if (search.shift !== "all") params.set("shift", search.shift);
    if (search.gender !== "all") params.set("gender", search.gender);
    navigate(`/services?${params.toString()}`);
  }, [navigate, search]);

  const handleBook = useCallback((line: Line): void => setBookingLine(line), []);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-grid relative overflow-hidden brand-surface pb-28 pt-14 text-white sm:pt-20">
          <div className="container relative">
            <div className="max-w-2xl animate-fade-up space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold">
                <Sparkles className="h-4 w-4" aria-hidden="true" />
                منصة النقل الجامعي الأولى في البصرة
              </span>
              <h1 className="font-display text-4xl font-black leading-tight sm:text-6xl">خطوط المهندس</h1>
              <p className="text-lg text-white/85 sm:text-xl">اعثر على خط النقل المثالي لجامعتك في البصرة</p>
              <p className="text-base font-bold text-gold">
                أكثر من {activeLines.length * 3} خطاً معتمداً يغطي أحياء البصرة
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button
                  type="button"
                  onClick={() => setDriverOpen(true)}
                  variant="outline"
                  className="h-12 gap-2 rounded-xl border-white/40 bg-white/5 text-base font-bold text-white hover:bg-white/15 hover:text-white active:scale-[0.98]"
                >
                  <UserPlus className="h-5 w-5" aria-hidden="true" />
                  أضف خطك كـ سائق
                </Button>
                <Button
                  type="button"
                  onClick={() => setCoverageOpen(true)}
                  className="h-12 gap-2 rounded-xl bg-gold text-base font-bold text-navy-deep hover:bg-gold/90 active:scale-[0.98]"
                >
                  <MapPinned className="h-5 w-5" aria-hidden="true" />
                  اطلب خطاً لمنطقتك
                </Button>
              </div>
            </div>
          </div>
        </section>

        <section className="container -mt-20 relative z-10">
          <div className="animate-fade-up rounded-2xl border border-border bg-card p-4 shadow-[0_24px_60px_-30px_hsl(222_45%_14%/0.6)] sm:p-5">
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-5">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground" htmlFor="q-university">
                  الجامعة:
                </label>
                <Select
                  value={search.universityId}
                  onValueChange={(v) => setSearch((prev) => ({ ...prev, universityId: v }))}
                >
                  <SelectTrigger id="q-university" className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNIVERSITIES.map((u) => (
                      <SelectItem key={u.id} value={u.id}>
                        {u.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground" htmlFor="q-area">
                  المنطقة:
                </label>
                <Select value={search.area} onValueChange={(v) => setSearch((prev) => ({ ...prev, area: v }))}>
                  <SelectTrigger id="q-area" className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل المناطق</SelectItem>
                    {AREAS.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground" htmlFor="q-shift">
                  الدوام:
                </label>
                <Select value={search.shift} onValueChange={(v) => setSearch((prev) => ({ ...prev, shift: v }))}>
                  <SelectTrigger id="q-shift" className="h-12 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">كل الأوقات</SelectItem>
                    <SelectItem value="morning">صباحي</SelectItem>
                    <SelectItem value="evening">مسائي</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-muted-foreground" htmlFor="q-gender">
                  النوع:
                </label>
                <Select value={search.gender} onValueChange={(v) => setSearch((prev) => ({ ...prev, gender: v }))}>
                  <SelectTrigger
                    id="q-gender"
                    className={
                      search.gender === "girls" ? "h-12 rounded-xl border-girls/50 text-girls" : "h-12 rounded-xl"
                    }
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">الكل</SelectItem>
                    <SelectItem value="girls">بنات فقط</SelectItem>
                    <SelectItem value="mixed">مختلط</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button
                  type="button"
                  onClick={handleSearch}
                  className="h-12 w-full gap-2 rounded-xl text-base font-bold active:scale-[0.98]"
                >
                  <Search className="h-5 w-5" aria-hidden="true" />
                  ابحث عن خط
                </Button>
              </div>
            </div>
          </div>
        </section>

        {vipLines.length > 0 ? (
          <section className="container mt-14">
            <SectionHeading
              icon={Crown}
              title="الخطوط المميزة - VIP"
              subtitle="خطوط مدفوعة تظهر في الأعلى بعد اعتماد الإدارة"
            />
            <div className="grid gap-5 lg:grid-cols-2">
              {vipLines.map((line) => (
                <LineCard key={line.id} line={line} variant="vip" onBook={handleBook} />
              ))}
            </div>
          </section>
        ) : null}

        <section className="container mt-14">
          <SectionHeading
            icon={ListChecks}
            title="كافة الخطوط المعتمدة"
            subtitle={`${activeLines.length} خطاً منشوراً بعد مراجعة الإدارة`}
            action={
              <Button
                type="button"
                variant="ghost"
                className="gap-1 font-bold text-primary hover:bg-primary/10"
                onClick={() => navigate("/services")}
              >
                عرض كل الخطوط
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
            }
          />
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {standardLines.map((line) => (
              <LineCard key={line.id} line={line} onBook={handleBook} />
            ))}
          </div>
        </section>

        <section className="container mt-16">
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                icon: ShieldCheck,
                title: "خطوط موثوقة",
                body: "كل خط يمر بمراجعة المشرف قبل النشر، مع بيانات واضحة عن السائق والمركبة.",
              },
              {
                icon: BadgeCheck,
                title: "أسعار معلنة",
                body: "السعر الشهري ومواعيد الذهاب والعودة ظاهرة قبل التواصل، بلا مفاوضات مرهقة.",
              },
              {
                icon: MapPinned,
                title: "حجز بموقعك",
                body: "حدد نقطة انطلاقك على الخريطة وأرسلها للسائق عبر واتساب بضغطة واحدة.",
              },
            ].map((item) => (
              <article key={item.title} className="card-surface p-5">
                <span className="mb-3 grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">{item.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container mt-16">
          <div className="flex flex-col items-center gap-5 rounded-3xl border border-dashed border-gold/50 bg-gold/[0.07] p-7 text-center sm:flex-row sm:text-start">
            <span className="relative grid h-16 w-16 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
              <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/30" aria-hidden="true" />
              <MapPinned className="relative h-8 w-8" aria-hidden="true" />
            </span>
            <div className="flex-1">
              <h2 className="font-display text-xl font-extrabold text-foreground">لم تجد خطاً يغطي منطقتك حتى الآن؟</h2>
              <p className="mt-1 text-sm text-muted-foreground">
                حدد موقعك على الخريطة وأرسل طلبك وسنقوم بتوفير سائق لك في أقرب وقت.
              </p>
            </div>
            <Button
              type="button"
              onClick={() => setCoverageOpen(true)}
              className="h-12 gap-2 rounded-xl px-6 text-base font-bold active:scale-[0.98]"
            >
              <MapPinned className="h-5 w-5" aria-hidden="true" />
              حدد موقعك وطلب خط
            </Button>
          </div>
        </section>
      </main>

      <SiteFooter />

      <BookLineDialog line={bookingLine} open={bookingLine !== null} onOpenChange={(o) => !o && setBookingLine(null)} />
      <DriverApplyDialog open={driverOpen} onOpenChange={setDriverOpen} />
      <CoverageRequestDialog open={coverageOpen} onOpenChange={setCoverageOpen} />
    </div>
  );
}
