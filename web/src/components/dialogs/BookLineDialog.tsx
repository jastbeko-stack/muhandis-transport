import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Copy, MapPin, Send } from "lucide-react";
import { toast } from "sonner";

import { DriverAvatar } from "@/components/lines/DriverAvatar";
import { PickupMap } from "@/components/map/PickupMap";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { AREA_POINTS, UNIVERSITIES } from "@/data/seed";
import { formatIqd, googleMapsLink, toWhatsAppNumber } from "@/lib/format";
import type { Coordinates, Line } from "@/lib/types";

interface BookLineDialogProps {
  line: Line | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BookLineDialog({ line, open, onOpenChange }: BookLineDialogProps) {
  const [point, setPoint] = useState<Coordinates>({ lat: 30.5085, lng: 47.7804 });
  const [copied, setCopied] = useState<boolean>(false);

  useEffect(() => {
    if (line && open) {
      setPoint(AREA_POINTS[line.fromArea] ?? line.startPoint);
      setCopied(false);
    }
  }, [line, open]);

  const university = useMemo(() => UNIVERSITIES.find((u) => u.id === line?.universityId), [line?.universityId]);
  const mapsLink = useMemo(() => googleMapsLink(point.lat, point.lng), [point]);

  const handleCopy = useCallback(async (): Promise<void> => {
    try {
      await navigator.clipboard.writeText(mapsLink);
      setCopied(true);
      toast.success("تم نسخ رابط موقعك");
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.warn("تعذر نسخ الرابط", error);
      toast.error("تعذر نسخ الرابط، انسخه يدوياً من الحقل");
    }
  }, [mapsLink]);

  const whatsappHref = useMemo(() => {
    if (!line) return "#";
    const message = [
      "السلام عليكم 👋",
      `أرغب بالحجز على خط: ${line.fromArea} ← ${line.toArea}`,
      `الجامعة: ${university?.name ?? ""}`,
      `السعر الشهري: ${formatIqd(line.monthlyPrice)}`,
      `وقت الذهاب: ${line.departTime} — العودة: ${line.returnTime}`,
      `موقع انطلاقي: ${mapsLink}`,
      "",
      "أرسلت عبر منصة خطوط المهندس",
    ].join("\n");
    return `https://wa.me/${toWhatsAppNumber(line.driverPhone)}?text=${encodeURIComponent(message)}`;
  }, [line, mapsLink, university]);

  if (!line) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] gap-0 overflow-y-auto p-0 sm:max-w-2xl">
        <DialogHeader className="space-y-1 border-b border-border px-6 py-5 text-center">
          <DialogTitle className="font-display text-xl font-extrabold">تحديد موقع الانطلاق</DialogTitle>
          <DialogDescription>اسحب الدبوس لتحديد موقعك على الخريطة ثم أرسل الطلب للسائق مباشرة</DialogDescription>
        </DialogHeader>

        <div className="space-y-4 p-4 sm:p-6">
          <PickupMap
            value={point}
            onChange={setPoint}
            destination={university?.location}
            destinationLabel={university?.short}
            pinLabel={`${line.fromArea}، البصرة`}
            heightClass="h-[300px] sm:h-[340px]"
          />

          <div className="space-y-2">
            <label htmlFor="location-link" className="text-sm font-semibold text-foreground">
              رابط موقعك:
            </label>
            <div className="flex items-center gap-2">
              <Input id="location-link" readOnly value={mapsLink} dir="ltr" className="h-11 rounded-xl text-left" />
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={handleCopy}
                aria-label="نسخ رابط الموقع"
                className="h-11 w-11 shrink-0 rounded-xl"
              >
                {copied ? <Check className="h-4 w-4 text-success" aria-hidden="true" /> : <Copy className="h-4 w-4" aria-hidden="true" />}
              </Button>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border bg-muted/50 p-3">
            <DriverAvatar name={line.driverName} ring="gold" />
            <div className="min-w-0">
              <p className="truncate font-display text-sm font-bold text-foreground">
                {line.driverName} — {line.fromArea} ← {line.toArea}
              </p>
              <p className="text-xs text-muted-foreground">
                {formatIqd(line.monthlyPrice)} / شهرياً · الذهاب {line.departTime}
              </p>
            </div>
            <span className="me-auto hidden items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary sm:flex">
              <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              {line.fromArea}
            </span>
          </div>
        </div>

        <div className="flex flex-col-reverse gap-2 border-t border-border p-4 sm:flex-row sm:p-6">
          <Button type="button" variant="outline" className="h-12 rounded-xl sm:w-40" onClick={() => onOpenChange(false)}>
            إلغاء
          </Button>
          <Button
            asChild
            className="h-12 flex-1 gap-2 rounded-xl bg-whatsapp text-base font-bold text-white hover:bg-whatsapp/90 active:scale-[0.99]"
          >
            <a href={whatsappHref} target="_blank" rel="noreferrer">
              <Send className="h-5 w-5" aria-hidden="true" />
              إرسال الطلب عبر واتساب
            </a>
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
