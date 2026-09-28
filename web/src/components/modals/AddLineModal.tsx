import React, { useState } from "react";
import { X, UserPlus, Crown, Send } from "lucide-react";
import { UNIVERSITIES, AREAS, AREA_COORDINATES, BASRA_CENTER, VIP_FEE } from "../../data/initialData";
import type { Coordinates, GenderType, ShiftType, NewLineSubmission } from "../../types";
import { InteractiveMap } from "../common/InteractiveMap";
import { usePlatform } from "../../context/PlatformContext";
import { formatPrice } from "../../utils/formatters";
import { toast } from "sonner";

interface AddLineModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddLineModal: React.FC<AddLineModalProps> = ({ open, onOpenChange }) => {
  const { submitLine } = usePlatform();

  const [driverName, setDriverName] = useState("");
  const [driverPhone, setDriverPhone] = useState("");
  const [universityId, setUniversityId] = useState(UNIVERSITIES[0].id);
  const [fromArea, setFromArea] = useState(AREAS[0]);
  const [vehicleKind, setVehicleKind] = useState<"sedan" | "van" | "bus">("sedan");
  const [vehicleModel, setVehicleModel] = useState("");
  const [totalSeats, setTotalSeats] = useState(4);
  const [seatsAvailable, setSeatsAvailable] = useState(3);
  const [monthlyPrice, setMonthlyPrice] = useState(35000);
  const [shift, setShift] = useState<ShiftType>("morning");
  const [gender, setGender] = useState<GenderType>("girls");
  const [departTime, setDepartTime] = useState("06:30 ص");
  const [returnTime, setReturnTime] = useState("02:00 م");
  const [hasAc, setHasAc] = useState(true);
  const [isPunctual, setIsPunctual] = useState(true);
  const [vipRequested, setVipRequested] = useState(false);
  const [note, setNote] = useState("");
  const [startPoint, setStartPoint] = useState<Coordinates>(
    AREA_COORDINATES[AREAS[0]] || BASRA_CENTER
  );

  if (!open) return null;

  const handleAreaChange = (area: string) => {
    setFromArea(area);
    if (AREA_COORDINATES[area]) {
      setStartPoint(AREA_COORDINATES[area]);
    }
  };

  const handleVehicleKindChange = (kind: "sedan" | "van" | "bus") => {
    setVehicleKind(kind);
    if (kind === "sedan") {
      setTotalSeats(4);
      setSeatsAvailable(3);
      if (!vehicleModel) setVehicleModel("صالون كيا سيراتو");
    } else if (kind === "van") {
      setTotalSeats(14);
      setSeatsAvailable(8);
      if (!vehicleModel) setVehicleModel("فان هيونداي H1");
    } else {
      setTotalSeats(24);
      setSeatsAvailable(15);
      if (!vehicleModel) setVehicleModel("باص كوستر 24 راكب");
    }
  };

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!driverName.trim() || !driverPhone.trim() || !vehicleModel.trim()) {
      toast.error("يرجى ملء جميع الحقول الإلزامية");
      return;
    }

    const payload: NewLineSubmission = {
      driverName: driverName.trim(),
      driverPhone: driverPhone.trim(),
      universityId,
      fromArea,
      toArea: selectedUni ? selectedUni.short : fromArea,
      vehicle: {
        kind: vehicleKind,
        model: vehicleModel.trim(),
        seats: totalSeats,
      },
      seatsAvailable,
      monthlyPrice: Number(monthlyPrice),
      shift,
      gender,
      departTime,
      returnTime,
      hasAc,
      isPunctual,
      vipRequested,
      startPoint,
      note: note.trim() || undefined,
    };

    submitLine(payload);
    toast.success("تم إرسال طلبك بنجاح! سيقوم المشرف بمراجعة الخط ونشره خلال وقت قصير.");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />

      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-border bg-card shadow-2xl animate-fade-up sm:rounded-3xl">
        {/* Mobile Drag Indicator */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
              <UserPlus className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-foreground">
                أضف خطك كـ سائق
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                املأ بيانات خطك بدقة للنشر بعد المراجعة
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            aria-label="إغلاق"
            className="grid h-9 w-9 place-items-center rounded-xl text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Driver Contact */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">اسم السائق *</label>
              <input
                type="text"
                required
                placeholder="مثال: أبو مصطفى الجابري"
                value={driverName}
                onChange={(e) => setDriverName(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                رقم الهاتف (واتساب) *
              </label>
              <input
                type="tel"
                required
                placeholder="0770XXXXXXX"
                value={driverPhone}
                onChange={(e) => setDriverPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Route info */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                الجامعة المقصودة
              </label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
              >
                {UNIVERSITIES.map((u) => (
                  <option key={u.id} value={u.id}>
                    {u.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                منطقة الانطلاق
              </label>
              <select
                value={fromArea}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Vehicle info */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الصنف</label>
              <select
                value={vehicleKind}
                onChange={(e) =>
                  handleVehicleKindChange(e.target.value as "sedan" | "van" | "bus")
                }
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
              >
                <option value="sedan">صالون (4 ركاب)</option>
                <option value="van">فان (10-14 راكب)</option>
                <option value="bus">باص كوستر (24 راكب)</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">نوع وموديل المركبة *</label>
              <input
                type="text"
                required
                placeholder="مثال: كيا سيراتو"
                value={vehicleModel}
                onChange={(e) => setVehicleModel(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">المقاعد المتاحة</label>
              <input
                type="number"
                min="1"
                max={totalSeats}
                value={seatsAvailable}
                onChange={(e) => setSeatsAvailable(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-bold text-foreground"
              />
            </div>
          </div>

          {/* Pricing, Shift, Gender */}
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                السعر الشهري (د.ع) *
              </label>
              <input
                type="number"
                step="1000"
                min="15000"
                max="100000"
                value={monthlyPrice}
                onChange={(e) => setMonthlyPrice(Number(e.target.value))}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">نوع الركاب</label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value as GenderType)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
              >
                <option value="girls">بنات فقط</option>
                <option value="mixed">مختلط</option>
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">الدوام</label>
              <select
                value={shift}
                onChange={(e) => setShift(e.target.value as ShiftType)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground"
              >
                <option value="morning">صباحي</option>
                <option value="evening">مسائي</option>
                <option value="full">صباحي ومسائي</option>
              </select>
            </div>
          </div>

          {/* Timings */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">وقت الذهاب</label>
              <input
                type="text"
                value={departTime}
                onChange={(e) => setDepartTime(e.target.value)}
                placeholder="06:30 ص"
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">وقت العودة</label>
              <input
                type="text"
                value={returnTime}
                onChange={(e) => setReturnTime(e.target.value)}
                placeholder="02:00 م"
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Checkboxes & Amenities */}
          <div className="flex flex-wrap items-center gap-6 rounded-xl border border-border bg-muted/20 p-3.5">
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-foreground">
              <input
                type="checkbox"
                checked={hasAc}
                onChange={(e) => setHasAc(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              المركبة مكيفة
            </label>
            <label className="flex cursor-pointer items-center gap-2 text-xs font-bold text-foreground">
              <input
                type="checkbox"
                checked={isPunctual}
                onChange={(e) => setIsPunctual(e.target.checked)}
                className="h-4 w-4 rounded accent-primary"
              />
              التزام تام بالمواعيد
            </label>
          </div>

          {/* VIP Upgrade Banner */}
          <div className="rounded-2xl border border-gold/40 bg-gradient-to-r from-gold/10 via-card to-card p-4">
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={vipRequested}
                onChange={(e) => setVipRequested(e.target.checked)}
                className="mt-1 h-4 w-4 rounded accent-gold"
              />
              <div>
                <span className="flex items-center gap-1.5 font-display text-sm font-black text-foreground">
                  <Crown className="h-4 w-4 text-gold fill-gold" />
                  أرغب بترقية الخط إلى مميز VIP
                </span>
                <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">
                  رسوم <span className="font-bold text-gold">{formatPrice(VIP_FEE)}</span> شهرياً — يظهر خطك في أعلى الصفحة الرئيسية بإطار ذهبي مميز لجذب المزيد من الطلبة.
                </p>
              </div>
            </label>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="mb-1 block text-xs font-bold text-foreground">
              ملاحظات إضافية (اختياري)
            </label>
            <textarea
              rows={2}
              placeholder="نقاط التجمع، مرونة المواعيد، تفاصيل تهم الطلبة..."
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          {/* Start Point Map Pin */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground">
              حدد نقطة انطلاق الخط على الخريطة:
            </label>
            <InteractiveMap
              value={startPoint}
              onChange={setStartPoint}
              destination={selectedUni?.location}
              destinationLabel={selectedUni?.short}
              pinLabel="نقطة انطلاقك"
              heightClass="h-[180px] sm:h-[220px]"
            />
          </div>

          {/* Actions */}
          <div className="flex flex-col-reverse gap-3 pt-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="flex items-center justify-center gap-2 rounded-xl bg-gold px-6 py-2.5 text-sm font-black text-navy-deep shadow-md transition-all hover:bg-gold/90 active:scale-95"
            >
              <Send className="h-4 w-4" />
              إرسال الطلب للمراجعة
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
