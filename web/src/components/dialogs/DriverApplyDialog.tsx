import { useCallback, useMemo, useState } from "react";
import { BadgeCheck, Crown, Loader2, UserPlus } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { AREAS, AREA_POINTS, UNIVERSITIES, VIP_FEE } from "@/data/seed";
import { formatIqd } from "@/lib/format";
import type { LineGender, Shift, VehicleKind } from "@/lib/types";
import { usePlatform } from "@/store/PlatformStore";

interface DriverApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  driverName: string;
  driverPhone: string;
  universityId: string;
  fromArea: string;
  vehicleKind: VehicleKind;
  vehicleModel: string;
  seats: string;
  gender: LineGender;
  shift: Shift;
  monthlyPrice: string;
  departTime: string;
  returnTime: string;
  hasAc: boolean;
  wantsVip: boolean;
  note: string;
}

const EMPTY_FORM: FormState = {
  driverName: "",
  driverPhone: "",
  universityId: UNIVERSITIES[0].id,
  fromArea: AREAS[0],
  vehicleKind: "sedan",
  vehicleModel: "",
  seats: "4",
  gender: "mixed",
  shift: "morning",
  monthlyPrice: "35000",
  departTime: "07:00 ص",
  returnTime: "02:00 م",
  hasAc: true,
  wantsVip: false,
  note: "",
};

export function DriverApplyDialog({ open, onOpenChange }: DriverApplyDialogProps) {
  const { submitLine } = usePlatform();
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState<boolean>(false);

  const update = useCallback(<K extends keyof FormState>(key: K, value: FormState[K]): void => {
    setForm((prev) => ({ ...prev, [key]: value }));
  }, []);

  const destination = useMemo(
    () => UNIVERSITIES.find((u) => u.id === form.universityId)?.short ?? "الجامعة",
    [form.universityId],
  );

  const isValid = useMemo(() => {
    const phoneOk = /^07\d{9}$/.test(form.driverPhone.trim());
    const priceOk = Number(form.monthlyPrice) >= 5000;
    return form.driverName.trim().length >= 3 && phoneOk && form.vehicleModel.trim().length >= 3 && priceOk;
  }, [form]);

  const handleSubmit = useCallback(
    (event: React.FormEvent<HTMLFormElement>): void => {
      event.preventDefault();
      if (!isValid || submitting) return;
      setSubmitting(true);

      try {
        submitLine({
          driverName: form.driverName.trim(),
          driverPhone: form.driverPhone.trim(),
          universityId: form.universityId,
          fromArea: form.fromArea,
          toArea: destination,
          vehicle: {
            kind: form.vehicleKind,
            model: form.vehicleModel.trim(),
            seats: Math.max(1, Number(form.seats) || 4),
          },
          seatsAvailable: Math.max(1, Number(form.seats) || 4),
          gender: form.gender,
          shift: form.shift,
          monthlyPrice: Number(form.monthlyPrice),
          hasAc: form.hasAc,
          isPunctual: true,
          vipRequested: form.wantsVip,
          departTime: form.departTime,
          returnTime: form.returnTime,
          startPoint: AREA_POINTS[form.fromArea] ?? { lat: 30.5085, lng: 47.7804 },
          note: form.note.trim() || undefined,
        });

        toast.success("تم إرسال طلبك بنجاح", {
          description: "سيقوم المشرف بمراجعة الخط ونشره خلال وقت قصير.",
        });
        setForm(EMPTY_FORM);
        onOpenChange(false);
      } catch (error) {
        console.error("تعذر إرسال طلب الخط", error);
        toast.error("حدث خطأ أثناء إرسال الطلب، حاول مجدداً");
      } finally {
        setSubmitting(false);
      }
    },
    [destination, form, isValid, onOpenChange, submitLine, submitting],
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader className="space-y-1 text-start">
          <DialogTitle className="flex items-center gap-2 font-display text-xl font-extrabold">
            <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" />
            أضف خطك كـ سائق
          </DialogTitle>
          <DialogDescription>
            املأ بيانات خطك بدقة. يصل الطلب إلى المشرف ويُنشر بعد المراجعة والموافقة.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Label htmlFor="driverName">اسم السائق</Label>
              <Input
                id="driverName"
                value={form.driverName}
                onChange={(e) => update("driverName", e.target.value)}
                placeholder="مثال: أبو مصطفى الجابري"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="driverPhone">رقم الهاتف (واتساب)</Label>
              <Input
                id="driverPhone"
                value={form.driverPhone}
                onChange={(e) => update("driverPhone", e.target.value)}
                placeholder="07XXXXXXXXX"
                inputMode="numeric"
                dir="ltr"
                className="h-11 rounded-xl text-left"
                required
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="university">الجامعة</Label>
              <Select value={form.universityId} onValueChange={(v) => update("universityId", v)}>
                <SelectTrigger id="university" className="h-11 rounded-xl">
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
              <Label htmlFor="area">منطقة الانطلاق</Label>
              <Select value={form.fromArea} onValueChange={(v) => update("fromArea", v)}>
                <SelectTrigger id="area" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {AREAS.map((area) => (
                    <SelectItem key={area} value={area}>
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="vehicleModel">نوع المركبة</Label>
              <Input
                id="vehicleModel"
                value={form.vehicleModel}
                onChange={(e) => update("vehicleModel", e.target.value)}
                placeholder="مثال: صالون كيا سيراتو"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="vehicleKind">الصنف</Label>
                <Select value={form.vehicleKind} onValueChange={(v) => update("vehicleKind", v as VehicleKind)}>
                  <SelectTrigger id="vehicleKind" className="h-11 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sedan">صالون</SelectItem>
                    <SelectItem value="van">فان</SelectItem>
                    <SelectItem value="bus">باص</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="seats">عدد المقاعد</Label>
                <Input
                  id="seats"
                  value={form.seats}
                  onChange={(e) => update("seats", e.target.value)}
                  inputMode="numeric"
                  className="h-11 rounded-xl"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="price">السعر الشهري (د.ع)</Label>
              <Input
                id="price"
                value={form.monthlyPrice}
                onChange={(e) => update("monthlyPrice", e.target.value.replace(/[^\d]/g, ""))}
                inputMode="numeric"
                className="h-11 rounded-xl"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="shift">الدوام</Label>
              <Select value={form.shift} onValueChange={(v) => update("shift", v as Shift)}>
                <SelectTrigger id="shift" className="h-11 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="morning">صباحي</SelectItem>
                  <SelectItem value="evening">مسائي</SelectItem>
                  <SelectItem value="full">صباحي ومسائي</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="depart">وقت الذهاب</Label>
              <Input
                id="depart"
                value={form.departTime}
                onChange={(e) => update("departTime", e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="return">وقت العودة</Label>
              <Input
                id="return"
                value={form.returnTime}
                onChange={(e) => update("returnTime", e.target.value)}
                className="h-11 rounded-xl"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>نوع الخط</Label>
            <RadioGroup
              value={form.gender}
              onValueChange={(v) => update("gender", v as LineGender)}
              className="flex gap-3"
            >
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold transition-colors hover:bg-muted/60">
                <RadioGroupItem value="girls" id="gender-girls" />
                بنات فقط
              </label>
              <label className="flex flex-1 cursor-pointer items-center gap-2 rounded-xl border border-border p-3 text-sm font-semibold transition-colors hover:bg-muted/60">
                <RadioGroupItem value="mixed" id="gender-mixed" />
                مختلط
              </label>
            </RadioGroup>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="note">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="note"
              value={form.note}
              onChange={(e) => update("note", e.target.value)}
              placeholder="نقاط التجمع، مرونة المواعيد، تفاصيل تهم الطلبة..."
              className="min-h-20 rounded-xl"
            />
          </div>

          <label className="flex items-start gap-3 rounded-xl border border-border p-3 text-sm">
            <Checkbox checked={form.hasAc} onCheckedChange={(v) => update("hasAc", v === true)} className="mt-0.5" />
            <span className="font-semibold">المركبة مكيفة</span>
          </label>

          <label className="flex items-start gap-3 rounded-xl border border-gold/45 bg-gold/10 p-3 text-sm">
            <Checkbox
              checked={form.wantsVip}
              onCheckedChange={(v) => update("wantsVip", v === true)}
              className="mt-0.5 border-gold data-[state=checked]:bg-gold data-[state=checked]:text-navy-deep"
            />
            <span>
              <span className="flex items-center gap-1.5 font-bold text-foreground">
                <Crown className="h-4 w-4 text-gold" aria-hidden="true" />
                أرغب بترقية الخط إلى مميز VIP
              </span>
              <span className="mt-1 block text-xs text-muted-foreground">
                رسوم {formatIqd(VIP_FEE)} شهرياً — يظهر خطك في أعلى الصفحة الرئيسية بإطار ذهبي.
              </span>
            </span>
          </label>

          <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row">
            <Button type="button" variant="outline" className="h-12 rounded-xl sm:w-36" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button
              type="submit"
              disabled={!isValid || submitting}
              className="h-12 flex-1 gap-2 rounded-xl text-base font-bold active:scale-[0.99]"
            >
              {submitting ? (
                <Loader2 className="h-5 w-5 animate-spin" aria-hidden="true" />
              ) : (
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
              )}
              إرسال الطلب للمراجعة
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
