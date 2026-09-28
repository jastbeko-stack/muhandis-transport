import React, { useState, useEffect } from "react";
import { X, CheckCircle2, Copy, Check, MapPin, Clock } from "lucide-react";
import type { TransportLine, Coordinates } from "../../types";
import { UNIVERSITIES, AREA_COORDINATES, BASRA_CENTER } from "../../data/initialData";
import { InteractiveMap } from "../common/InteractiveMap";
import { formatPrice, createGoogleMapsUrl } from "../../utils/formatters";
import { toast } from "sonner";

interface BookingModalProps {
  line: TransportLine | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingModal: React.FC<BookingModalProps> = ({
  line,
  open,
  onOpenChange,
}) => {
  const [coords, setCoords] = useState<Coordinates>(BASRA_CENTER);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (line) {
      if (line.startPoint) {
        setCoords(line.startPoint);
      } else if (AREA_COORDINATES[line.fromArea]) {
        setCoords(AREA_COORDINATES[line.fromArea]);
      } else {
        setCoords(BASRA_CENTER);
      }
    }
  }, [line]);

  if (!open || !line) return null;

  const university = UNIVERSITIES.find((u) => u.id === line.universityId);
  const mapsUrl = createGoogleMapsUrl(coords.lat, coords.lng);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(mapsUrl);
    setCopied(true);
    toast.success("تم نسخ رابط موقعك بنجاح");
    setTimeout(() => setCopied(false), 2000);
  };

  const handleConfirmBooking = () => {
    toast.success("تم تأكيد طلب حجز مقعدك بنجاح! سيتم إشعار السائق وتأكيد الانطلاق معك.");
    onOpenChange(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => onOpenChange(false)}
      />

      {/* Dialog Content / Bottom Sheet */}
      <div className="relative z-10 flex max-h-[92vh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] border border-border bg-card shadow-2xl animate-fade-up sm:rounded-3xl">
        {/* Mobile Drag Indicator */}
        <div className="mx-auto mt-3 h-1.5 w-12 rounded-full bg-muted-foreground/30 sm:hidden" />

        {/* Header */}
        <div className="flex items-start justify-between border-b border-border p-4 sm:p-6">
          <div>
            <h3 className="font-display text-lg sm:text-xl font-extrabold text-foreground">
              تحديد موقع الانطلاق وحجز الخط
            </h3>
            <p className="mt-0.5 text-xs text-muted-foreground">
              حدد موقعك على الخريطة لتأكيد حجز مقعدك على هذا الخط
            </p>
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

        {/* Body */}
        <div className="flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
          {/* Quick Line Summary */}
          <div className="rounded-2xl border border-border bg-muted/30 p-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <span className="font-display text-base font-black text-foreground">
                  خط: {line.fromArea} ← {line.toArea}
                </span>
                <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
                  <MapPin className="h-3 w-3 text-primary" />
                  {university?.name} • السائق: {line.driverName}
                </p>
              </div>
              <div className="text-end">
                <span className="font-display text-lg font-black text-primary dark:text-gold">
                  {formatPrice(line.monthlyPrice)}
                </span>
                <span className="block text-[10px] text-muted-foreground">شهرياً</span>
              </div>
            </div>

            <div className="mt-3 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Clock className="h-3.5 w-3.5 text-primary" />
                الذهاب {line.departTime} — العودة {line.returnTime}
              </span>
            </div>
          </div>

          {/* Interactive Leaflet Map */}
          <div>
            <label className="mb-2 block text-xs font-bold text-foreground">
              حدد نقطة التقائك بالسائق (مكان بيتك أو نقطة الانطلاق):
            </label>
            <InteractiveMap
              value={coords}
              onChange={setCoords}
              destination={university?.location}
              destinationLabel={university?.short}
              pinLabel="مكان انطلاقك"
              heightClass="h-[200px] sm:h-[280px]"
            />
          </div>

          {/* Google Maps link preview */}
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-muted-foreground">
              رابط موقعك الجغرافي:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={mapsUrl}
                className="h-10 flex-1 rounded-xl border border-input bg-muted/40 px-3 text-xs font-mono text-muted-foreground selection:bg-primary/20"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className="flex h-10 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-bold text-foreground hover:bg-muted"
              >
                {copied ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                {copied ? "تم النسخ" : "نسخ الرابط"}
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex flex-col-reverse gap-3 border-t border-border bg-muted/20 p-5 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={() => onOpenChange(false)}
            className="rounded-xl border border-border px-5 py-2.5 text-sm font-bold text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            إلغاء
          </button>
          <button
            type="button"
            onClick={handleConfirmBooking}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-black text-primary-foreground shadow-md transition-all hover:bg-primary/90 active:scale-95"
          >
            <CheckCircle2 className="h-4 w-4" />
            تأكيد طلب الحجز
          </button>
        </div>
      </div>
    </div>
  );
};
