import React, { useState } from "react";
import { X, MapPinned, Send } from "lucide-react";
import { UNIVERSITIES, AREAS, AREA_COORDINATES, BASRA_CENTER } from "../../data/initialData";
import type { Coordinates } from "../../types";
import { InteractiveMap } from "../common/InteractiveMap";
import { usePlatform } from "../../context/PlatformContext";
import { toast } from "sonner";

interface RequestCoverageModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultArea?: string;
  defaultUniversityId?: string;
}

export const RequestCoverageModal: React.FC<RequestCoverageModalProps> = ({
  open,
  onOpenChange,
  defaultArea = AREAS[0],
  defaultUniversityId = UNIVERSITIES[0].id,
}) => {
  const { submitCoverageRequest } = usePlatform();

  const [studentName, setStudentName] = useState("");
  const [phone, setPhone] = useState("");
  const [universityId, setUniversityId] = useState(defaultUniversityId);
  const [area, setArea] = useState(defaultArea);
  const [coords, setCoords] = useState<Coordinates>(
    AREA_COORDINATES[defaultArea] || BASRA_CENTER
  );

  if (!open) return null;

  const handleAreaChange = (newArea: string) => {
    setArea(newArea);
    if (AREA_COORDINATES[newArea]) {
      setCoords(AREA_COORDINATES[newArea]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!studentName.trim() || !phone.trim()) {
      toast.error("يرجى ملء جميع الحقول المطلوبة (الاسم ورقم الهاتف)");
      return;
    }

    submitCoverageRequest({
      studentName: studentName.trim(),
      phone: phone.trim(),
      universityId,
      area,
      location: coords,
    });

    toast.success("تم استلام طلبك بنجاح! سنبحث لك عن سائق يغطي منطقتك ونعاود التواصل معك.");
    onOpenChange(false);

    // Reset fields
    setStudentName("");
    setPhone("");
  };

  const selectedUni = UNIVERSITIES.find((u) => u.id === universityId);

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Window / Bottom Sheet */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-xl flex-col overflow-hidden rounded-t-[2rem] border border-border bg-card shadow-2xl animate-fade-up sm:rounded-3xl">
        {/* Mobile Drag Indicator */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-4 sm:p-6">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold">
              <MapPinned className="h-5 w-5" />
            </span>
            <div>
              <h3 className="font-display text-lg sm:text-xl font-black text-foreground">
                طلب خط لمنطقتك
              </h3>
              <p className="mt-0.5 text-xs text-muted-foreground">
                حدد موقعك وسنقوم بالتواصل مع سائقي منطقتك لتوفير خط
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
        <form onSubmit={handleSubmit} className="max-h-[75vh] space-y-4 overflow-y-auto p-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                اسمك الكامل *
              </label>
              <input
                type="text"
                required
                placeholder="مثال: أحمد عبد الله"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
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
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3.5 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-bold text-foreground">
                الجامعة المقصودة
              </label>
              <select
                value={universityId}
                onChange={(e) => setUniversityId(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
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
                منطقة السكن / الانطلاق
              </label>
              <select
                value={area}
                onChange={(e) => handleAreaChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-input bg-background px-3 text-sm font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              >
                {AREAS.map((a) => (
                  <option key={a} value={a}>
                    {a}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Interactive Pinpoint Map */}
          <div>
            <label className="mb-1.5 block text-xs font-bold text-foreground">
              حدد موقع بيتك بدقة على الخريطة:
            </label>
            <InteractiveMap
              value={coords}
              onChange={setCoords}
              destination={selectedUni?.location}
              destinationLabel={selectedUni?.short}
              pinLabel="موقع بيتك"
              heightClass="h-[180px] sm:h-[240px]"
            />
          </div>

          {/* Footer Actions */}
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
              className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
            >
              <Send className="h-4 w-4" />
              إرسال الطلب
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
