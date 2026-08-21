import { useCallback, useMemo, useState } from "react";
import { MapPinned, Send } from "lucide-react";
import { toast } from "sonner";

import { PickupMap } from "@/components/map/PickupMap";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AREAS, AREA_POINTS, BASRA_CENTER, PLATFORM_WHATSAPP, UNIVERSITIES } from "@/data/seed";
import { googleMapsLink } from "@/lib/format";
import type { Coordinates } from "@/lib/types";
import { usePlatform } from "@/store/PlatformStore";

interface CoverageRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CoverageRequestDialog({ open, onOpenChange }: CoverageRequestDialogProps) {
  const { submitCoverageRequest } = usePlatform();
  const [studentName, setStudentName] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [universityId, setUniversityId] = useState<string>(UNIVERSITIES[0].id);
  const [area, setArea] = useState<string>(AREAS[0]);
  const [point, setPoint] = useState<Coordinates>(BASRA_CENTER);

  const isValid = useMemo(
    () => studentName.trim().length >= 3 && /^07\d{9}$/.test(phone.trim()),
    [phone, studentName],
  );

  const handleAreaChange = useCallback((next: string): void => {
    setArea(next);
    setPoint(AREA_POINTS[next] ?? BASRA_CENTER);
  }, []);

  const handleSubmit = useCallback((): void => {
    if (!isValid) return;
    submitCoverageRequest({ studentName: studentName.trim(), phone: phone.trim(), universityId, area, point });

    const university = UNIVERSITIES.find((u) => u.id === universityId);
    const message = [
      "السلام عليكم 👋",
      "أبحث عن خط نقل جامعي يغطي منطقتي:",
      `الاسم: ${studentName.trim()}`,
      `الهاتف: ${phone.trim()}`,
      `الجامعة: ${university?.name ?? ""}`,
      `المنطقة: ${area}`,
      `الموقع: ${googleMapsLink(point.lat, point.lng)}`,
      "",
      "أرسلت عبر منصة خطوط المهندس",
    ].join("\n");

    window.open(`https://wa.me/${PLATFORM_WHATSAPP}?text=${encodeURIComponent(message)}`, "_blank", "noopener");
    toast.success("تم استلام طلبك", { description: "سنبحث لك عن سائق يغطي منطقتك ونعاود التواصل معك." });
    setStudentName("");
    setPhone("");
    onOpenChange(false);
  }, [area, isValid, onOpenChange, phone, point, studentName, submitCoverageRequest, universityId]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-xl">
        <DialogHeader className="space-y-1 text-start">
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-extrabold">
            <MapPinned className="h-5 w-5 text-gold" aria-hidden="true" />
            حدد موقعك واطلب خطاً
          </DialogTitle>
          <DialogDescription>سنرسل طلبك للسائقين في منطقتك ونوفر لك خطاً في أقرب وقت.</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="student-name">الاسم</Label>
              <Input
                id="student-name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="اسمك الكامل"
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-phone">رقم الهاتف</Label>
              <Input
                id="student-phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="07XXXXXXXXX"
                dir="ltr"
                inputMode="numeric"
                className="h-11 rounded-xl text-left"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="student-university">الجامعة</Label>
              <Select value={universityId} onValueChange={setUniversityId}>
                <SelectTrigger id="student-university" className="h-11 rounded-xl">
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
              <Label htmlFor="student-area">المنطقة</Label>
              <Select value={area} onValueChange={handleAreaChange}>
                <SelectTrigger id="student-area" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((a) => (
                    <SelectItem key={a} value={a}>
                      {a}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <PickupMap value={point} onChange={setPoint} pinLabel={`${area}، البصرة`} heightClass="h-[260px]" />

          <Button
            type="button"
            disabled={!isValid}
            onClick={handleSubmit}
            className="h-12 w-full gap-2 rounded-xl bg-whatsapp text-base font-bold text-white hover:bg-whatsapp/90 active:scale-[0.99]"
          >
            <Send className="h-5 w-5" aria-hidden="true" />
            إرسال الطلب
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
