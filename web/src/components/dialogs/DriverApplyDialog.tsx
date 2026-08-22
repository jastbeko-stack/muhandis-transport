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

import { db } from "@/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

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
  universityId: UNIVERSITIES[0]?.id ?? "iq-uni",
  fromArea: AREAS[0] ?? "الجزائر",
  vehicleKind: "سيدان",
  vehicleModel: "",
  seats: "4",
  gender: "مختلط",
  shift: "صباحي",
  monthlyPrice: "75000",
  departTime: "07:00",
  returnTime: "14:30",
  hasAc: true,
  wantsVip: false,
  note: "",
};

export function DriverApplyDialog({ open, onOpenChange }: DriverApplyDialogProps) {
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [submitting, setSubmitting] = useState(false);

  const destination = useMemo(() => {
    return UNIVERSITIES.find((u) => u.id === form.universityId)?.name ?? "جامعة البصرة";
  }, [form.universityId]);

  const isValid = useMemo(() => {
    const phoneOk = /^07\d{9}$/.test(form.driverPhone.trim());
    const priceOk = Number(form.monthlyPrice) >= 5000;
    return form.driverName.trim().length >= 3 && phoneOk && form.vehicleModel.trim().length >= 2 && priceOk;
  }, [form]);

  const handleSubmit = useCallback(
    async (event: React.FormEvent<HTMLFormElement>) => {
      event.preventDefault();
      if (!isValid || submitting) return;
      setSubmitting(true);

      try {
        await addDoc(collection(db, "requests"), {
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
          status: "pending",
          createdAt: serverTimestamp(),
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
    [isValid, submitting, form, destination, onOpenChange]
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-[620px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <UserPlus className="h-5 w-5 text-emerald-600" />
            أضف خطك كـ سائق
          </DialogTitle>
          <DialogDescription>
            سجل بيانات خطك لتسهيل وصول الطلاب إليك بعد مراجعة المشرف.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 pt-2">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="driverName">اسم السائق الثلاثي *</Label>
              <Input
                id="driverName"
                value={form.driverName}
                onChange={(e) => setForm((prev) => ({ ...prev, driverName: e.target.value }))}
                placeholder="مثال: علي جاسم محمد"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="driverPhone">رقم الهاتف (واتساب) *</Label>
              <Input
                id="driverPhone"
                dir="ltr"
                value={form.driverPhone}
                onChange={(e) => setForm((prev) => ({ ...prev, driverPhone: e.target.value }))}
                placeholder="07700000000"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>من منطقة *</Label>
              <Select value={form.fromArea} onValueChange={(val) => setForm((prev) => ({ ...prev, fromArea: val }))}>
                <SelectTrigger>
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

            <div className="space-y-2">
              <Label>إلى وجهة الجامعة *</Label>
              <Select value={form.universityId} onValueChange={(val) => setForm((prev) => ({ ...prev, universityId: val }))}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {UNIVERSITIES.map((u) => (
                    <SelectItem key={u.id} value={u.id}>
                      {u.name} ({u.city})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>نوع المركبة</Label>
              <Select
                value={form.vehicleKind}
                onValueChange={(val) => setForm((prev) => ({ ...prev, vehicleKind: val as VehicleKind }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="سيدان">سيدان</SelectItem>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="فان">فان / كيا</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="vehicleModel">موديل المركبة *</Label>
              <Input
                id="vehicleModel"
                value={form.vehicleModel}
                onChange={(e) => setForm((prev) => ({ ...prev, vehicleModel: e.target.value }))}
                placeholder="مثال: الترا 2020"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="seats">عدد المقاعد الكلي</Label>
              <Input
                id="seats"
                type="number"
                min={1}
                max={15}
                value={form.seats}
                onChange={(e) => setForm((prev) => ({ ...prev, seats: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>فئة الركاب المستهدفة</Label>
              <RadioGroup
                value={form.gender}
                onValueChange={(val) => setForm((prev) => ({ ...prev, gender: val as LineGender }))}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="مختلط" id="g-mix" />
                  <Label htmlFor="g-mix">مختلط</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="طالبات فقط" id="g-female" />
                  <Label htmlFor="g-female">طالبات فقط</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>الدوام</Label>
              <RadioGroup
                value={form.shift}
                onValueChange={(val) => setForm((prev) => ({ ...prev, shift: val as Shift }))}
                className="flex gap-4 pt-1"
              >
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="صباحي" id="s-m" />
                  <Label htmlFor="s-m">صباحي</Label>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <RadioGroupItem value="مسائي" id="s-e" />
                  <Label htmlFor="s-e">مسائي</Label>
                </div>
              </RadioGroup>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="monthlyPrice">السعر الشهري (د.ع) *</Label>
              <Input
                id="monthlyPrice"
                type="number"
                step={5000}
                value={form.monthlyPrice}
                onChange={(e) => setForm((prev) => ({ ...prev, monthlyPrice: e.target.value }))}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="departTime">وقت الانطلاق</Label>
              <Input
                id="departTime"
                type="time"
                value={form.departTime}
                onChange={(e) => setForm((prev) => ({ ...prev, departTime: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="returnTime">وقت العودة</Label>
              <Input
                id="returnTime"
                type="time"
                value={form.returnTime}
                onChange={(e) => setForm((prev) => ({ ...prev, returnTime: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center space-x-2 space-x-reverse">
              <Checkbox
                id="hasAc"
                checked={form.hasAc}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, hasAc: Boolean(checked) }))}
              />
              <Label htmlFor="hasAc" className="text-sm font-normal">
                السيارة مكيفة وتعمل بشكل ممتاز
              </Label>
            </div>

            <div className="flex items-start space-x-2 space-x-reverse rounded-lg border border-amber-200 bg-amber-50/50 p-3 dark:border-amber-900/50 dark:bg-amber-950/20">
              <Checkbox
                id="wantsVip"
                checked={form.wantsVip}
                onCheckedChange={(checked) => setForm((prev) => ({ ...prev, wantsVip: Boolean(checked) }))}
                className="mt-0.5"
              />
              <div className="grid gap-1 leading-none">
                <Label htmlFor="wantsVip" className="flex items-center gap-1.5 text-sm font-medium text-amber-900 dark:text-amber-200">
                  <Crown className="h-4 w-4 text-amber-500" />
                  طلب شارة التوثيق الذهبي (VIP) ({formatIqd(VIP_FEE)})
                </Label>
                <p className="text-xs text-muted-foreground">
                  تمنح خطك الأولوية بالظهور في الصفحة الأولى مع إشارة توثيق تميزك أمام الطلاب.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">ملاحظات إضافية (اختياري)</Label>
            <Textarea
              id="note"
              value={form.note}
              onChange={(e) => setForm((prev) => ({ ...prev, note: e.target.value }))}
              placeholder="أي تفاصيل أخرى تريد ذكرها للطلاب..."
              rows={2}
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              إلغاء
            </Button>
            <Button type="submit" disabled={!isValid || submitting} className="bg-emerald-600 hover:bg-emerald-700">
              {submitting ? (
                <>
                  <Loader2 className="ml-2 h-4 w-4 animate-spin" />
                  جاري الإرسال...
                </>
              ) : (
                <>
                  <BadgeCheck className="ml-2 h-4 w-4" />
                  إرسال طلب الخط
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}