import React, { useState, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Sparkles,
  Search,
  Crown,
  MapPinned,
  ShieldCheck,
  Coins,
  Send,
  ArrowLeft,
  UserPlus,
  LayoutList,
  GraduationCap,
} from "lucide-react";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES, AREAS } from "../data/initialData";
import type { TransportLine } from "../types";
import { LineCard } from "../components/lines/LineCard";
import { BookingModal } from "../components/modals/BookingModal";
import { RequestCoverageModal } from "../components/modals/RequestCoverageModal";
import { AddLineModal } from "../components/modals/AddLineModal";

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { activeLines, vipLines } = usePlatform();

  // Search Box Filters
  const [selectedUni, setSelectedUni] = useState(UNIVERSITIES[0].id);
  const [selectedArea, setSelectedArea] = useState("all");
  const [selectedShift, setSelectedShift] = useState("all");
  const [selectedGender, setSelectedGender] = useState("all");

  // Modals
  const [bookingLine, setBookingLine] = useState<TransportLine | null>(null);
  const [coverageModalOpen, setCoverageModalOpen] = useState(false);
  const [addLineModalOpen, setAddLineModalOpen] = useState(false);

  // Standard non-vip lines preview
  const regularLinesPreview = useMemo(() => {
    return activeLines.filter((l) => !l.isVip).slice(0, 6);
  }, [activeLines]);

  const handleHeroSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (selectedUni !== "all") params.set("university", selectedUni);
    if (selectedArea !== "all") params.set("area", selectedArea);
    if (selectedShift !== "all") params.set("shift", selectedShift);
    if (selectedGender !== "all") params.set("gender", selectedGender);
    navigate(`/services?${params.toString()}`);
  };

  const handleQuickUniSelect = (uniId: string) => {
    navigate(`/services?university=${uniId}`);
  };

  return (
    <div className="flex-1 pb-8">
      {/* Hero Section */}
      <section className="hero-grid relative overflow-hidden brand-surface pb-16 pt-8 text-white sm:pb-28 sm:pt-20">
        <div className="container relative">
          <div className="max-w-3xl space-y-4 animate-fade-up sm:space-y-5">
            {/* Top Badge */}
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold/40 bg-gold/10 px-3.5 py-1 text-[11px] font-bold text-gold sm:text-xs">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              منصة النقل الجامعي الأولى في البصرة
            </span>

            {/* Main Title & Subtitle */}
            <h1 className="font-display text-3xl font-black leading-tight sm:text-6xl">
              خطوط المهندس
            </h1>
            <p className="text-base text-white/90 sm:text-2xl font-medium">
              اعثر على خط النقل المثالي لجامعتك في البصرة
            </p>
            <p className="text-xs sm:text-base font-extrabold text-gold">
              أكثر من {activeLines.length * 3} خطاً معتمداً يغطي أحياء ومناطق البصرة
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1 sm:pt-2">
              <button
                type="button"
                onClick={() => setCoverageModalOpen(true)}
                className="flex items-center gap-2 rounded-xl bg-gold px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-black text-navy-deep shadow-lg transition-all hover:bg-gold/90 active:scale-95"
              >
                <MapPinned className="h-4 w-4" />
                اطلب خطاً لمنطقتك
              </button>
              <button
                type="button"
                onClick={() => setAddLineModalOpen(true)}
                className="flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-4 py-2.5 sm:px-6 sm:py-3 text-xs sm:text-sm font-bold text-white shadow-sm backdrop-blur-sm transition-all hover:bg-white/20 active:scale-95"
              >
                <UserPlus className="h-4 w-4" />
                أضف خطك كـ سائق
              </button>
            </div>
          </div>

          {/* Mobile-first Horizontal Universities Quick Swipe */}
          <div className="mt-8">
            <p className="mb-2 text-xs font-bold text-white/70 flex items-center gap-1.5">
              <GraduationCap className="h-4 w-4 text-gold" />
              تصفح سريع حسب جامعتك:
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {UNIVERSITIES.map((u) => (
                <button
                  key={u.id}
                  type="button"
                  onClick={() => handleQuickUniSelect(u.id)}
                  className="shrink-0 flex items-center gap-1.5 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-bold text-white backdrop-blur-md transition-all hover:bg-gold hover:text-navy-deep active:scale-95"
                >
                  <span>{u.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search Card */}
          <div className="mt-6 sm:mt-10 rounded-2xl sm:rounded-3xl border border-white/15 bg-card/95 p-4 sm:p-6 text-foreground shadow-2xl backdrop-blur-xl">
            <h3 className="mb-3 font-display text-base sm:text-lg font-extrabold text-foreground">
              ابحث عن خطك الجامعي
            </h3>
            <form onSubmit={handleHeroSearch} className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {/* University */}
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">الجامعة</label>
                <select
                  value={selectedUni}
                  onChange={(e) => setSelectedUni(e.target.value)}
                  className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                >
                  {UNIVERSITIES.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Area */}
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">منطقتك</label>
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                >
                  <option value="all">كل المناطق</option>
                  {AREAS.map((a) => (
                    <option key={a} value={a}>
                      {a}
                    </option>
                  ))}
                </select>
              </div>

              {/* Shift */}
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">الدوام</label>
                <select
                  value={selectedShift}
                  onChange={(e) => setSelectedShift(e.target.value)}
                  className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                >
                  <option value="all">كل الأوقات</option>
                  <option value="morning">صباحي</option>
                  <option value="evening">مسائي</option>
                  <option value="full">صباحي ومسائي</option>
                </select>
              </div>

              {/* Gender */}
              <div>
                <label className="mb-1 block text-xs font-bold text-muted-foreground">نوع الخط</label>
                <select
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                  className="h-10 sm:h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                >
                  <option value="all">الكل</option>
                  <option value="girls">بنات فقط</option>
                  <option value="mixed">مختلط</option>
                </select>
              </div>

              {/* Submit Button */}
              <div className="flex items-end">
                <button
                  type="submit"
                  className="flex h-10 sm:h-11 w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 text-xs sm:text-sm font-extrabold text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
                >
                  <Search className="h-4 w-4" />
                  ابحث عن خط
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Featured VIP Lines Section (Swipeable on Mobile) */}
      {vipLines.length > 0 && (
        <section className="container mt-10 sm:mt-16 space-y-4 sm:space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <Crown className="h-5 w-5 sm:h-6 sm:w-6 text-gold fill-gold" />
                <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
                  الخطوط المميزة - VIP
                </h2>
              </div>
              <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
                خطوط معتمدة تظهر في الأعلى بعد مراجعة الإدارة
              </p>
            </div>
            <Link
              to="/services"
              className="flex items-center gap-1 text-xs sm:text-sm font-bold text-primary hover:underline"
            >
              عرض الكل
              <ArrowLeft className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Swipeable on Mobile, Grid on Tablet/Desktop */}
          <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-3 sm:overflow-visible sm:pb-0">
            {vipLines.map((line) => (
              <div
                key={line.id}
                className="w-[84vw] max-w-sm shrink-0 snap-center sm:w-auto sm:max-w-none sm:shrink"
              >
                <LineCard
                  line={line}
                  variant="vip"
                  onBook={(l) => setBookingLine(l)}
                  className="h-full"
                />
              </div>
            ))}
          </div>
        </section>
      )}

      {/* All Approved Lines Section */}
      <section className="container mt-10 sm:mt-16 space-y-4 sm:space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <LayoutList className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              <h2 className="font-display text-xl sm:text-2xl font-black text-foreground">
                كافة الخطوط المعتمدة
              </h2>
            </div>
            <p className="mt-0.5 text-xs sm:text-sm text-muted-foreground">
              {activeLines.length} خطاً منشوراً ومتاحاً للحجز المباشر
            </p>
          </div>
          <Link
            to="/services"
            className="flex items-center gap-1 rounded-xl border border-border px-3 py-1.5 text-xs font-bold text-foreground transition-colors hover:bg-muted"
          >
            عرض الكل ({activeLines.length})
            <ArrowLeft className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid gap-4 sm:gap-5 md:grid-cols-2 lg:grid-cols-3">
          {regularLinesPreview.map((line) => (
            <LineCard
              key={line.id}
              line={line}
              variant={line.isVip ? "vip" : "standard"}
              onBook={(l) => setBookingLine(l)}
            />
          ))}
        </div>
      </section>

      {/* Value Propositions / Why Muhandis Transport */}
      <section className="container mt-12 sm:mt-20">
        <div className="rounded-2xl sm:rounded-3xl border border-border bg-card p-5 sm:p-8 shadow-sm">
          <h2 className="text-center font-display text-xl sm:text-3xl font-black text-foreground">
            لماذا يختار طلبة البصرة منصة «خطوط المهندس»؟
          </h2>
          <div className="mt-6 sm:mt-10 grid gap-4 sm:gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {/* Feature 1 */}
            <div className="flex items-start sm:flex-col sm:items-center gap-3 sm:text-center p-3 rounded-xl bg-muted/20 sm:bg-transparent">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-foreground">خطوط موثوقة</h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  كل خط يمر بمراجعة المشرف قبل النشر، مع بيانات واضحة ومعلنة عن السائق والمركبة.
                </p>
              </div>
            </div>

            {/* Feature 2 */}
            <div className="flex items-start sm:flex-col sm:items-center gap-3 sm:text-center p-3 rounded-xl bg-muted/20 sm:bg-transparent">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gold/15 text-gold">
                <Coins className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-foreground">أسعار معلنة</h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  السعر الشهري ومواعيد الذهاب والعودة ظاهرة قبل التواصل، بلا مفاوضات أو تكاليف خفية.
                </p>
              </div>
            </div>

            {/* Feature 3 */}
            <div className="flex items-start sm:flex-col sm:items-center gap-3 sm:text-center p-3 rounded-xl bg-muted/20 sm:bg-transparent">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                <Send className="h-6 w-6" />
              </span>
              <div>
                <h3 className="font-display text-base sm:text-lg font-black text-foreground">حجز بموقعك</h3>
                <p className="mt-1 text-xs sm:text-sm leading-relaxed text-muted-foreground">
                  حدد نقطة انطلاقك على الخريطة وأرسلها للسائق عبر واتساب بضغطة زر واحدة ومباشرة.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Coverage Request CTA Banner */}
      <section className="container my-10 sm:my-16">
        <div className="flex flex-col items-center gap-4 rounded-2xl sm:rounded-3xl border border-dashed border-border bg-muted/40 p-5 sm:p-8 text-center sm:flex-row sm:text-start">
          <span className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold/20 text-gold">
            <span className="absolute inset-0 animate-pulse-ring rounded-full bg-gold/30" />
            <MapPinned className="relative h-7 w-7" />
          </span>
          <div className="flex-1 space-y-1">
            <h3 className="font-display text-base sm:text-xl font-black text-foreground">
              لم تجد خطاً يغطي منطقتك حتى الآن؟
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              حدد موقعك على الخريطة وأرسل طلبك وسنقوم بالتواصل مع السائقين لتوفير خط لك في أقرب وقت.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setCoverageModalOpen(true)}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-3 text-xs sm:text-sm font-black text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
          >
            <MapPinned className="h-4 w-4" />
            حدد موقعك واطلب خطاً
          </button>
        </div>
      </section>

      {/* Modals */}
      <BookingModal
        line={bookingLine}
        open={bookingLine !== null}
        onOpenChange={(open) => !open && setBookingLine(null)}
      />

      <RequestCoverageModal
        open={coverageModalOpen}
        onOpenChange={setCoverageModalOpen}
      />

      <AddLineModal
        open={addLineModalOpen}
        onOpenChange={setAddLineModalOpen}
      />
    </div>
  );
};
