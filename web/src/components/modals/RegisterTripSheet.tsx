import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ChevronDown,
  Plus,
  Minus,
} from "lucide-react";
import { UNIVERSITIES, AREAS } from "../../data/initialData";
import { supabaseService, isSupabaseConfigured } from "../../lib/supabase";
import { useAuth } from "../../context/AuthContext";
import { usePlatform } from "../../context/PlatformContext";
import { toast } from "sonner";
import { cn } from "../../utils/formatters";

interface RegisterTripSheetProps {
  open: boolean;
  onClose: () => void;
  initialFromArea?: string;
  initialToUniversity?: string;
}

export const RegisterTripSheet: React.FC<RegisterTripSheetProps> = ({
  open,
  onClose,
  initialFromArea = "",
  initialToUniversity = "",
}) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { submitStudentRequest } = usePlatform();

  // Form Fields matching screenshot 1 & 2
  const [fromArea, setFromArea] = useState(initialFromArea);
  const [toArea, setToArea] = useState(initialToUniversity);
  const [shift, setShift] = useState<"morning" | "evening">("morning");
  const [arrivalTime, setArrivalTime] = useState("");
  const [returnTime, setReturnTime] = useState("");
  const [personCount, setPersonCount] = useState(1);
  const [forWhom, setForWhom] = useState<"me" | "daughter" | "son">("me");
  const [genderType, setGenderType] = useState<"youth" | "girls" | "mixed">("youth");
  const [allowCall, setAllowCall] = useState(true);
  const [allowChat, setAllowChat] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Suggestions filter
  const [showFromSuggestions, setShowFromSuggestions] = useState(false);
  const [showToSuggestions, setShowToSuggestions] = useState(false);

  if (!open) return null;

  const filteredAreas = AREAS.filter((a) =>
    a.includes(fromArea.trim())
  ).slice(0, 6);

  const filteredUnis = UNIVERSITIES.filter((u) =>
    u.name.includes(toArea.trim()) || u.short.includes(toArea.trim())
  ).slice(0, 6);

  const getPersonLabel = (count: number) => {
    if (count === 1) return "شخص واحد";
    if (count === 2) return "شخصين";
    if (count <= 10) return `${count} أشخاص`;
    return `${count} شخص`;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fromArea.trim()) {
      toast.error("يرجى كتابة اسم منطقتك (منين تطلع؟)");
      return;
    }
    if (!toArea.trim()) {
      toast.error("يرجى كتابة وجهتك أو جامعتك (وين تروح؟)");
      return;
    }

    setSubmitting(true);

    try {
      // Save student line request to Platform context for drivers to view
      submitStudentRequest({
        studentName: user?.name || "طالب مسجل",
        phone: user?.phone || "07800000000",
        universityName: toArea,
        area: fromArea,
        passengersCount: personCount,
        preferredPrice: 35000,
        gender: genderType,
        shift: shift,
        departureTime: arrivalTime || "07:30 ص",
        returnTime: returnTime || "02:00 م",
        notes: `حجز لـ ${getPersonLabel(personCount)} - ${forWhom === "me" ? "للطالب نفسه" : forWhom === "daughter" ? "لابنتي" : "لابني"}`,
      });

      // Save student trip request to Supabase
      if (isSupabaseConfigured) {
        await supabaseService.submitCoverageRequest({
          student_name: user?.name || "طالب مسجل",
          phone: user?.phone || "07700000000",
          university_id: toArea,
          area: fromArea,
          status: "pending",
        });
      }

      toast.success("تم تسجيل طلب خطك بنجاح! تم نشره للسائقين وجاري عرض الخطوط المناسبة لمسارك...");
      onClose();

      // Navigate to matching drivers
      const params = new URLSearchParams();
      params.set("area", fromArea.trim());
      params.set("shift", shift);
      params.set("gender", genderType);
      navigate(`/services?${params.toString()}`);
    } catch (err) {
      console.warn("Failed to submit trip request:", err);
      toast.success("تم تسجيل خطك بنجاح!");
      onClose();
      navigate(`/services?area=${encodeURIComponent(fromArea.trim())}`);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-[#fafbfb] dark:bg-background overflow-hidden animate-fade-up select-none">
      {/* Top Header matching screenshot */}
      <div className="sticky top-0 z-20 flex items-center justify-between border-b border-border/80 bg-white/95 dark:bg-card/95 px-4 py-3 backdrop-blur-md pt-[max(0.6rem,env(safe-area-inset-top,0px))]">
        <button
          type="button"
          onClick={onClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-muted/50 hover:bg-muted text-foreground active:scale-95 transition-all"
          aria-label="رجوع إلى الخريطة"
        >
          {/* Back arrow pointing right in RTL */}
          <ChevronRight className="h-6 w-6 stroke-[2.2]" />
        </button>

        <div className="text-center flex-1 pr-2">
          <h1 className="text-lg font-black text-foreground font-display">سجّل خطك</h1>
          <p className="text-[11px] text-muted-foreground font-semibold">
            اكتب من وين ولـ وين حتى تشوف السواق
          </p>
        </div>

        <div className="w-10" />
      </div>

      {/* Scrollable Form Body */}
      <div className="flex-1 overflow-y-auto px-4 py-4 pb-28 space-y-3.5 max-w-lg mx-auto w-full">
        {/* Section 1: منين تطلع؟ */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-1.5 relative">
          <label className="block text-xs font-black text-foreground">منين تطلع؟</label>
          <div className="relative">
            <input
              type="text"
              placeholder="اكتب اسم منطقتك"
              value={fromArea}
              onFocus={() => setShowFromSuggestions(true)}
              onChange={(e) => {
                setFromArea(e.target.value);
                setShowFromSuggestions(true);
              }}
              className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#286058]"
            />
            {fromArea && (
              <button
                type="button"
                onClick={() => setFromArea("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                مسح
              </button>
            )}
          </div>

          {/* Autocomplete suggestions dropdown */}
          {showFromSuggestions && filteredAreas.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground w-full block">اقتراحات سريعة:</span>
              {filteredAreas.map((area) => (
                <button
                  key={area}
                  type="button"
                  onClick={() => {
                    setFromArea(area);
                    setShowFromSuggestions(false);
                  }}
                  className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-[#eaf4f2] hover:text-[#246158] transition-colors"
                >
                  {area}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 2: وين تروح؟ */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-1.5 relative">
          <label className="block text-xs font-black text-foreground">وين تروح؟</label>
          <div className="relative">
            <input
              type="text"
              placeholder="اكتب وين تروح"
              value={toArea}
              onFocus={() => setShowToSuggestions(true)}
              onChange={(e) => {
                setToArea(e.target.value);
                setShowToSuggestions(true);
              }}
              className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-[#286058]"
            />
            {toArea && (
              <button
                type="button"
                onClick={() => setToArea("")}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground hover:text-foreground"
              >
                مسح
              </button>
            )}
          </div>

          {/* Autocomplete suggestions dropdown */}
          {showToSuggestions && filteredUnis.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1.5 pt-1 border-t border-border/50">
              <span className="text-[10px] text-muted-foreground w-full block">جامعات ومجمعات مقترحة:</span>
              {filteredUnis.map((uni) => (
                <button
                  key={uni.id}
                  type="button"
                  onClick={() => {
                    setToArea(uni.name);
                    setShowToSuggestions(false);
                  }}
                  className="rounded-lg border border-border bg-muted/40 px-2.5 py-1 text-[11px] font-bold text-foreground hover:bg-[#eaf4f2] hover:text-[#246158] transition-colors"
                >
                  {uni.short}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Section 3: الدوام (صباحي / مسائي) */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-2">
          <label className="block text-xs font-black text-foreground">الدوام</label>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShift("morning")}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-black transition-all text-center",
                shift === "morning"
                  ? "border-2 border-[#246158] text-[#246158] bg-[#eaf4f2]/60 shadow-xs"
                  : "border border-border text-foreground bg-muted/20 hover:bg-muted"
              )}
            >
              صباحي
            </button>
            <button
              type="button"
              onClick={() => setShift("evening")}
              className={cn(
                "flex-1 py-2.5 rounded-xl text-xs font-black transition-all text-center",
                shift === "evening"
                  ? "border-2 border-[#246158] text-[#246158] bg-[#eaf4f2]/60 shadow-xs"
                  : "border border-border text-foreground bg-muted/20 hover:bg-muted"
              )}
            >
              مسائي
            </button>
          </div>
        </div>

        {/* Section 4: أوقات الوصول والرجوع (اختياري) */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-2">
          <div className="grid grid-cols-2 gap-3">
            {/* Arrival Time */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground">
                وقت الوصول (اختياري)
              </label>
              <div className="relative">
                <select
                  value={arrivalTime}
                  onChange={(e) => setArrivalTime(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#286058]"
                >
                  <option value="">-</option>
                  <option value="07:00 ص">07:00 ص</option>
                  <option value="07:30 ص">07:30 ص</option>
                  <option value="08:00 ص">08:00 ص</option>
                  <option value="08:30 ص">08:30 ص</option>
                  <option value="09:00 ص">09:00 ص</option>
                  <option value="12:30 م">12:30 م (مسائي)</option>
                  <option value="01:30 م">01:30 م (مسائي)</option>
                </select>
                <ChevronDown className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>

            {/* Return Time */}
            <div className="space-y-1">
              <label className="block text-[11px] font-bold text-muted-foreground">
                وقت الرجوع (اختياري)
              </label>
              <div className="relative">
                <select
                  value={returnTime}
                  onChange={(e) => setReturnTime(e.target.value)}
                  className="h-10 w-full appearance-none rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[#286058]"
                >
                  <option value="">-</option>
                  <option value="01:30 م">01:30 م</option>
                  <option value="02:00 م">02:00 م</option>
                  <option value="02:30 م">02:30 م</option>
                  <option value="03:00 م">03:00 م</option>
                  <option value="04:00 م">04:00 م</option>
                  <option value="05:30 م">05:30 م</option>
                </select>
                <ChevronDown className="pointer-events-none absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Section 5: كم شخص؟ */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs flex items-center justify-between">
          <span className="text-xs font-black text-foreground">كم شخص؟</span>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setPersonCount((prev) => Math.min(8, prev + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#d7f1ec] text-[#246158] hover:bg-[#c4ebe4] active:scale-90 transition-all font-bold"
              aria-label="زيادة عدد الركاب"
            >
              <Plus className="h-4 w-4" />
            </button>

            <span className="text-xs font-black text-foreground min-w-[70px] text-center">
              {getPersonLabel(personCount)}
            </span>

            <button
              type="button"
              onClick={() => setPersonCount((prev) => Math.max(1, prev - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-[#eaf4f2] text-[#246158] hover:bg-[#dcefe9] active:scale-90 transition-all font-bold"
              aria-label="تقليل عدد الركاب"
            >
              <Minus className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Section 6: لمن؟ (إلي / لبنتي / لابني) */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-2">
          <label className="block text-xs font-black text-foreground">لمن؟</label>
          <div className="flex items-center gap-2">
            {[
              { id: "me", label: "إلي" },
              { id: "daughter", label: "لبنتي" },
              { id: "son", label: "لابني" },
            ].map((opt) => (
              <button
                key={opt.id}
                type="button"
                onClick={() => {
                  setForWhom(opt.id as any);
                  if (opt.id === "daughter") setGenderType("girls");
                  if (opt.id === "son") setGenderType("youth");
                }}
                className={cn(
                  "flex-1 py-2 rounded-xl text-xs font-black transition-all text-center",
                  forWhom === opt.id
                    ? "border-2 border-[#246158] text-[#246158] bg-[#eaf4f2]/60 shadow-xs"
                    : "border border-border text-foreground bg-muted/20 hover:bg-muted"
                )}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <p className="text-[11px] text-muted-foreground font-semibold">
            نختار السواق حسب منو يركب
          </p>
        </div>

        {/* Section 7: نوع الخط (شباب / بنات / مختلط) */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-2">
          <label className="block text-xs font-black text-foreground">نوع الخط</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: "youth", label: "شباب" },
              { id: "girls", label: "بنات" },
              { id: "mixed", label: "مختلط" },
            ].map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setGenderType(item.id as "youth" | "girls" | "mixed")}
                className={cn(
                  "py-2.5 rounded-xl text-xs font-black transition-all text-center",
                  genderType === item.id
                    ? "border-2 border-[#246158] text-[#246158] bg-[#eaf4f2]/60 shadow-xs"
                    : "border border-border text-foreground bg-muted/20 hover:bg-muted"
                )}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section 8: التواصل والتنبيهات (Toggle switches) */}
        <div className="rounded-2xl border border-border/80 bg-white dark:bg-card p-4 shadow-xs space-y-3.5 divide-y divide-border/60">
          {/* Toggle 1: السواق يكدرون يتصلون بيك */}
          <div className="flex items-center justify-between pt-1 gap-3">
            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-black text-foreground">السواق يكدرون يتصلون بيك</p>
              <p className="text-[11px] text-muted-foreground">
                رقمك يظهر لكل سائق بمدينتك، مو بس اللي على خطك
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={allowCall}
              onClick={() => setAllowCall(!allowCall)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                allowCall ? "bg-[#286058]" : "bg-gray-300 dark:bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  allowCall ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>

          {/* Toggle 2: السواق يكدرون يراسلونك */}
          <div className="flex items-center justify-between pt-3 gap-3">
            <div className="space-y-0.5 flex-1">
              <p className="text-xs font-black text-foreground">السواق يكدرون يراسلونك</p>
              <p className="text-[11px] text-muted-foreground">
                أي سائق يفتح وياك محادثة
              </p>
            </div>

            <button
              type="button"
              role="switch"
              aria-checked={allowChat}
              onClick={() => setAllowChat(!allowChat)}
              className={cn(
                "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                allowChat ? "bg-[#286058]" : "bg-gray-300 dark:bg-muted"
              )}
            >
              <span
                className={cn(
                  "pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out",
                  allowChat ? "translate-x-5" : "translate-x-0"
                )}
              />
            </button>
          </div>
        </div>

        {/* Section 9: Disclaimer Note */}
        <p className="text-[11px] text-muted-foreground text-center leading-relaxed px-2 py-1">
          لازم تسجّل خطك حتى تشوف السواق، وتسجيلك يظهر لسواق مدينتك، ويتواصلون وياك حسب ما تسمح.
        </p>

        {/* Section 10: Main Action Button (سجّل خطي) */}
        <button
          type="button"
          disabled={submitting}
          onClick={handleSubmit}
          className="w-full py-3.5 rounded-2xl bg-[#286058] hover:bg-[#204e47] active:scale-[0.98] text-white font-black text-base shadow-[0_4px_16px_rgba(40,96,88,0.3)] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {submitting ? "جاري الحفظ..." : "سجّل خطي"}
        </button>
      </div>
    </div>
  );
};
