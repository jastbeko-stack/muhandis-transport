import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Users,
  GraduationCap,
  Clock,
  Phone,
  MessageSquare,
  Search,
  CheckCircle2,
  Sparkles,
  Check,
} from "lucide-react";
import { usePlatform } from "../context/PlatformContext";
import { AREAS } from "../data/initialData";
import { formatPrice } from "../utils/formatters";
import { toast } from "sonner";
import { cn } from "../utils/formatters";

export const LineRequestsPage: React.FC = () => {
  const { studentRequests, updateStudentRequestStatus } = usePlatform();

  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGender, setSelectedGender] = useState<"all" | "girls" | "youth" | "mixed">("all");
  const [selectedShift, setSelectedShift] = useState<"all" | "morning" | "evening">("all");
  const [selectedArea, setSelectedArea] = useState<string>("all");

  // Filtering
  const filteredRequests = useMemo(() => {
    return studentRequests.filter((req) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = req.studentName.toLowerCase().includes(q);
        const matchesArea = req.area.toLowerCase().includes(q);
        const matchesUni = req.universityName.toLowerCase().includes(q);
        const matchesCollege = req.college ? req.college.toLowerCase().includes(q) : false;
        if (!matchesName && !matchesArea && !matchesUni && !matchesCollege) {
          return false;
        }
      }

      // Gender filter
      if (selectedGender !== "all" && req.gender !== selectedGender) {
        return false;
      }

      // Shift filter
      if (selectedShift !== "all" && req.shift !== selectedShift) {
        return false;
      }

      // Area filter
      if (selectedArea !== "all" && !req.area.includes(selectedArea)) {
        return false;
      }

      return true;
    });
  }, [studentRequests, searchQuery, selectedGender, selectedShift, selectedArea]);

  // Total passengers sum
  const totalWantedSeats = useMemo(() => {
    return filteredRequests.reduce((acc, curr) => acc + (curr.passengersCount || 1), 0);
  }, [filteredRequests]);

  const handleAcceptRequest = (id: string, studentName: string) => {
    updateStudentRequestStatus(id, "accepted");
    toast.success(`تم قبول طلب الطالب (${studentName}) وإرسال إشعار له برغبتك بنقله!`);
  };

  const handleContactStudent = (id: string) => {
    updateStudentRequestStatus(id, "contacted");
  };

  return (
    <div className="flex-1 min-h-[calc(100vh-4rem)] bg-gradient-to-b from-[#f4f7f6] to-background py-6 px-3 sm:px-4 pb-28">
      <div className="container max-w-3xl mx-auto space-y-5">
        {/* Header */}
        <div className="bg-card border border-border/80 rounded-3xl p-5 sm:p-6 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs font-black bg-amber-500/10 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full border border-amber-300 mb-2">
                <Sparkles className="h-3.5 w-3.5" />
                سوق طلبات النقل والخطوط
              </div>
              <h1 className="text-xl sm:text-2xl font-black text-foreground font-display">
                طلبات الخطوط للطلاب
              </h1>
              <p className="text-xs sm:text-sm text-muted-foreground mt-1">
                الطلاب الذين يبحثون عن خط يومي لجامعاتهم مع تفاصيل مناطقهم، عدد الأشخاص، والسعر المناسب
              </p>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 self-start sm:self-center">
              <div className="bg-[#eaf4f2] dark:bg-[#246158]/20 border border-[#246158]/20 rounded-2xl px-3.5 py-2 text-center">
                <span className="text-[10px] text-muted-foreground font-medium block">إجمالي الطلبات</span>
                <span className="text-base sm:text-lg font-black text-[#246158]">
                  {filteredRequests.length}
                </span>
              </div>
              <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-300/40 rounded-2xl px-3.5 py-2 text-center">
                <span className="text-[10px] text-muted-foreground font-medium block">المقاعد المطلوبة</span>
                <span className="text-base sm:text-lg font-black text-amber-600 dark:text-amber-400">
                  {totalWantedSeats} مقعد
                </span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="absolute right-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث باسم الطالب، المنطقة (الزبير، القبلة...) أو الجامعة..."
              className="w-full pl-3 pr-10 py-2.5 sm:py-3 rounded-2xl border border-border bg-background text-foreground text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-[#246158] transition-all"
            />
          </div>

          {/* Filter Pills */}
          <div className="space-y-2 pt-1 border-t border-border">
            {/* Gender Filters */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-xs">
              <span className="text-muted-foreground text-[11px] font-bold shrink-0 ml-1">نوع الخط:</span>
              <button
                type="button"
                onClick={() => setSelectedGender("all")}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all",
                  selectedGender === "all"
                    ? "bg-[#286058] text-white shadow-sm"
                    : "bg-muted/60 text-muted-foreground hover:bg-muted"
                )}
              >
                الكل
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender("girls")}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1",
                  selectedGender === "girls"
                    ? "bg-pink-600 text-white shadow-sm"
                    : "bg-pink-50 dark:bg-pink-950/30 text-pink-700 dark:text-pink-300 hover:bg-pink-100"
                )}
              >
                👩 بنات فقط
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender("youth")}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1",
                  selectedGender === "youth"
                    ? "bg-blue-600 text-white shadow-sm"
                    : "bg-blue-50 dark:bg-blue-950/30 text-blue-700 dark:text-blue-300 hover:bg-blue-100"
                )}
              >
                👨 شباب فقط
              </button>
              <button
                type="button"
                onClick={() => setSelectedGender("mixed")}
                className={cn(
                  "px-3 py-1.5 rounded-xl font-bold whitespace-nowrap transition-all flex items-center gap-1",
                  selectedGender === "mixed"
                    ? "bg-purple-600 text-white shadow-sm"
                    : "bg-purple-50 dark:bg-purple-950/30 text-purple-700 dark:text-purple-300 hover:bg-purple-100"
                )}
              >
                👥 مختلط
              </button>
            </div>

            {/* Shift & Area Row */}
            <div className="flex flex-wrap items-center gap-2 pt-1">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground text-[11px] font-bold shrink-0 ml-1">الدوام:</span>
                <button
                  type="button"
                  onClick={() => setSelectedShift("all")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold text-xs transition-all",
                    selectedShift === "all" ? "bg-[#286058] text-white" : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  الكل
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShift("morning")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold text-xs transition-all",
                    selectedShift === "morning" ? "bg-[#286058] text-white" : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  صباحي
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedShift("evening")}
                  className={cn(
                    "px-2.5 py-1 rounded-lg font-bold text-xs transition-all",
                    selectedShift === "evening" ? "bg-[#286058] text-white" : "bg-muted/60 text-muted-foreground"
                  )}
                >
                  مسائي
                </button>
              </div>

              {/* Area select */}
              <div className="mr-auto">
                <select
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                  className="text-xs bg-muted/60 border border-border rounded-xl px-2.5 py-1.5 text-foreground font-bold focus:outline-none"
                >
                  <option value="all">كل مناطق البصرة</option>
                  {AREAS.slice(0, 20).map((area) => (
                    <option key={area} value={area}>
                      {area}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Requests List */}
        <div className="space-y-4">
          {filteredRequests.length === 0 ? (
            <div className="bg-card border border-border rounded-3xl p-10 text-center space-y-3">
              <Users className="h-12 w-12 text-muted-foreground mx-auto" />
              <h3 className="font-bold text-base text-foreground">لا توجد طلبات مطابقة للبحث</h3>
              <p className="text-xs text-muted-foreground">
                جرب تغيير خيارات التصفية أو مسح عبارة البحث لمشاهدة جميع طلبات الطلاب
              </p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery("");
                  setSelectedGender("all");
                  setSelectedShift("all");
                  setSelectedArea("all");
                }}
                className="px-4 py-2 rounded-xl bg-[#286058] text-white text-xs font-bold"
              >
                إعادة ضبط الفلاتر
              </button>
            </div>
          ) : (
            filteredRequests.map((req) => {
              const totalPriceForDriver = (req.passengersCount || 1) * req.preferredPrice;

              return (
                <div
                  key={req.id}
                  className="bg-card border border-border/90 hover:border-[#246158]/50 rounded-3xl p-4 sm:p-5 shadow-sm hover:shadow-md transition-all space-y-3.5"
                >
                  {/* Card Header: Student Name + Status + Gender Tag */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-base sm:text-lg font-black text-foreground font-display">
                          {req.studentName}
                        </h3>
                        {/* Gender Badge */}
                        {req.gender === "girls" && (
                          <span className="text-[10px] font-black text-pink-700 dark:text-pink-300 bg-pink-50 dark:bg-pink-950/40 px-2 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                            👩 خط بنات فقط
                          </span>
                        )}
                        {req.gender === "youth" && (
                          <span className="text-[10px] font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded-full border border-blue-200 dark:border-blue-800">
                            👨 خط شباب فقط
                          </span>
                        )}
                        {req.gender === "mixed" && (
                          <span className="text-[10px] font-black text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/40 px-2 py-0.5 rounded-full border border-purple-200 dark:border-purple-800">
                            👥 خط مختلط
                          </span>
                        )}

                        {/* Shift Badge */}
                        <span className="text-[10px] font-black text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-muted px-2 py-0.5 rounded-full">
                          {req.shift === "morning" ? "☀️ دوام صباحي" : "🌙 دوام مسائي"}
                        </span>
                      </div>

                      {/* University & College */}
                      <div className="flex items-center gap-1.5 mt-1 text-xs text-muted-foreground font-medium">
                        <GraduationCap className="h-4 w-4 text-[#246158] shrink-0" />
                        <span className="text-foreground font-bold">{req.universityName}</span>
                        {req.college && (
                          <>
                            <span>•</span>
                            <span>{req.college}</span>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div className="shrink-0 text-end">
                      {req.status === "accepted" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-950/40 px-2.5 py-1 rounded-full border border-green-200">
                          <CheckCircle2 className="h-3.5 w-3.5" />
                          تم قبول الطلب
                        </span>
                      ) : req.status === "contacted" ? (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2.5 py-1 rounded-full border border-blue-200">
                          تم التواصل
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-300">
                          <span className="h-2 w-2 rounded-full bg-amber-500 animate-pulse" />
                          طلب جديد ({req.createdAt})
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Route & Address Information */}
                  <div className="rounded-2xl bg-gray-50/80 dark:bg-muted/30 border border-border p-3 space-y-2">
                    <div className="flex items-start gap-2.5">
                      <span className="h-3.5 w-3.5 rounded-full border-[2.5px] border-[#246158] mt-1 shrink-0" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">منطقة انطلاق الطالب (عنوان السكن):</p>
                        <p className="text-xs sm:text-sm font-black text-foreground">{req.area}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2.5">
                      <span className="h-3 w-3 rounded-[3px] bg-[#9e4a2e] mt-1 shrink-0" />
                      <div>
                        <p className="text-[11px] text-muted-foreground">الوجهة الجامعية:</p>
                        <p className="text-xs sm:text-sm font-bold text-foreground">
                          {req.destinationArea ? `${req.universityName} (${req.destinationArea})` : req.universityName}
                        </p>
                      </div>
                    </div>

                    {(req.departureTime || req.returnTime) && (
                      <div className="flex items-center gap-4 pt-1 border-t border-border/60 text-[11px] text-muted-foreground">
                        {req.departureTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#246158]" />
                            الانطلاق: <strong className="text-foreground">{req.departureTime}</strong>
                          </span>
                        )}
                        {req.returnTime && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5 text-[#9e4a2e]" />
                            العودة: <strong className="text-foreground">{req.returnTime}</strong>
                          </span>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Key Highlights Grid: كم شخص + السعر المناسب للطالب */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {/* 1. كم شخص (عدد المقاعد المطلوبة) */}
                    <div className="p-3 rounded-2xl bg-[#eaf4f2] dark:bg-[#246158]/20 border border-[#246158]/20 text-center">
                      <span className="text-[10px] text-muted-foreground font-medium block">
                        كم شخص (المقاعد المطلوبة)
                      </span>
                      <span className="text-sm sm:text-base font-black text-[#286058] dark:text-[#38a394] mt-0.5 flex items-center justify-center gap-1">
                        <Users className="h-4 w-4" />
                        {req.passengersCount === 1
                          ? "شخص واحد"
                          : req.passengersCount === 2
                          ? "شخصين (2)"
                          : `${req.passengersCount} أشخاص`}
                      </span>
                    </div>

                    {/* 2. السعر المناسب للطالب */}
                    <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-300 dark:border-amber-700/60 text-center">
                      <span className="text-[10px] text-muted-foreground font-medium block">
                        السعر المناسب للطالب
                      </span>
                      <span className="text-sm sm:text-base font-black text-amber-700 dark:text-amber-400 mt-0.5 block">
                        {formatPrice(req.preferredPrice)} <span className="text-[10px] font-normal">/شهر</span>
                      </span>
                    </div>

                    {/* 3. إجمالي دخل الكابتن من الطلب */}
                    <div className="col-span-2 sm:col-span-1 p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-300 dark:border-emerald-700/60 text-center">
                      <span className="text-[10px] text-muted-foreground font-medium block">
                        إجمالي دخل الكابتن
                      </span>
                      <span className="text-sm sm:text-base font-black text-emerald-700 dark:text-emerald-400 mt-0.5 block truncate">
                        {formatPrice(totalPriceForDriver)} <span className="text-[10px] font-normal">/شهر</span>
                      </span>
                    </div>
                  </div>

                  {/* Student Notes */}
                  {req.notes && (
                    <div className="text-xs text-muted-foreground bg-muted/30 p-2.5 rounded-xl border border-border/60">
                      <strong className="text-foreground">ملاحظة الطالب: </strong>
                      {req.notes}
                    </div>
                  )}

                  {/* Actions for Driver */}
                  <div className="flex items-center gap-2 pt-2 border-t border-border">
                    {req.status !== "accepted" ? (
                      <button
                        type="button"
                        onClick={() => handleAcceptRequest(req.id, req.studentName)}
                        className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-[#286058] hover:bg-[#204e47] active:scale-[0.98] text-white font-black text-xs sm:text-sm shadow-[0_4px_14px_rgba(40,96,88,0.25)] transition-all flex items-center justify-center gap-1.5"
                      >
                        <CheckCircle2 className="h-4 w-4" />
                        قبول الطلب وتأكيد الخط
                      </button>
                    ) : (
                      <span className="flex-1 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl bg-green-100 dark:bg-green-950/60 text-green-800 dark:text-green-300 font-black text-xs sm:text-sm text-center flex items-center justify-center gap-1">
                        <Check className="h-4 w-4" />
                        تم قبول هذا الطلب
                      </span>
                    )}

                    <Link
                      to="/messages"
                      onClick={() => handleContactStudent(req.id)}
                      className="py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl border border-border bg-card hover:bg-muted font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 text-foreground"
                    >
                      <MessageSquare className="h-4 w-4 text-[#246158]" />
                      مراسلة
                    </Link>

                    <a
                      href={`tel:${req.phone}`}
                      onClick={() => handleContactStudent(req.id)}
                      className="py-2.5 sm:py-3 px-3.5 rounded-xl sm:rounded-2xl border border-border bg-card hover:bg-muted font-bold text-xs sm:text-sm flex items-center justify-center gap-1.5 transition-all active:scale-95 text-[#246158]"
                      title="اتصال هاتفي مباشر"
                    >
                      <Phone className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
