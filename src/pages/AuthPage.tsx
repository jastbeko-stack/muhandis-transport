import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  GraduationCap,
  Bus,
  Phone,
  Mail,
  Lock,
  User,
  ArrowLeft,
  CheckCircle2,
  Camera,
  Car,
  Palette,
  ShieldCheck,
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { usePlatform } from "../context/PlatformContext";
import { UNIVERSITIES, AREAS, AREA_COORDINATES, BASRA_CENTER } from "../data/initialData";
import type { UserRole } from "../types";
import { toast } from "sonner";
import { cn } from "../utils/formatters";

interface AuthPageProps {
  onSuccess?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({ onSuccess }) => {
  const navigate = useNavigate();
  const { loginWithPhone, loginWithEmail, register } = useAuth();
  const { submitLine, addDriverRecord } = usePlatform();

  // Selected Role: student vs driver
  const [role, setRole] = useState<UserRole>("student");

  // Auth Mode: login vs register
  const [isRegister, setIsRegister] = useState(false);

  // Method: phone vs email
  const [method, setMethod] = useState<"phone" | "email">("phone");

  // Form Fields
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [universityId, setUniversityId] = useState(UNIVERSITIES[0].id);
  const [area, setArea] = useState(AREAS[0]);

  // Driver Specific Registration Fields
  const [carName, setCarName] = useState("كيا سيراتو");
  const [carModel, setCarModel] = useState("2023");
  const [carColor, setCarColor] = useState("أبيض لؤلؤي");
  const [photoUrl, setPhotoUrl] = useState<string>("");
  const [licenseNumber, setLicenseNumber] = useState("");
  const [vehicleKind, setVehicleKind] = useState<"sedan" | "van" | "bus">("sedan");
  const [loading, setLoading] = useState(false);

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("حجم الصورة كبير جداً، يرجى اختيار صورة أصغر من 5 ميغابايت");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoUrl(event.target?.result as string);
        toast.success("تم اختيار صورتك الشخصية بنجاح");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isRegister) {
        if (!name.trim()) {
          toast.error("يرجى إدخال الاسم الكامل");
          setLoading(false);
          return;
        }

        const cleanPhone = phone.trim() || "07701234567";
        const totalSeats = vehicleKind === "sedan" ? 4 : vehicleKind === "van" ? 14 : 24;
        const combinedVehicleModel = `${carName.trim()} (${carModel.trim()}) - ${carColor.trim()}`;

        await register({
          name: name.trim(),
          phone: cleanPhone,
          email: email.trim() || undefined,
          role,
          universityId,
          area,
          photoUrl: photoUrl || undefined,
          carName: role === "driver" ? carName.trim() : undefined,
          carModel: role === "driver" ? carModel.trim() : undefined,
          carColor: role === "driver" ? carColor.trim() : undefined,
          vehicleModel: role === "driver" ? combinedVehicleModel : undefined,
          vehicleKind: role === "driver" ? vehicleKind : undefined,
          totalSeats: role === "driver" ? totalSeats : undefined,
        });

        if (role === "driver") {
          // Register driver in the Admin directory visible only to management
          addDriverRecord({
            name: name.trim(),
            phone: cleanPhone,
            area,
            photoUrl: photoUrl || undefined,
            carName: carName.trim(),
            carModel: carModel.trim(),
            carColor: carColor.trim(),
            vehicleKind,
            totalSeats,
            licenseNumber: licenseNumber.trim() || undefined,
            status: "pending",
            notes: `سائق جديد مسجل عبر المنصة - منطقة ${area}`,
          });

          const selectedUni = UNIVERSITIES.find((u) => u.id === universityId);
          submitLine({
            driverName: name.trim(),
            driverPhone: cleanPhone,
            universityId,
            fromArea: area,
            toArea: selectedUni ? selectedUni.short : area,
            vehicle: {
              kind: vehicleKind,
              model: combinedVehicleModel,
              seats: totalSeats,
            },
            seatsAvailable: Math.max(1, totalSeats - 1),
            monthlyPrice: 35000,
            shift: "morning",
            gender: "mixed",
            departTime: "07:30 ص",
            returnTime: "02:00 م",
            hasAc: true,
            isPunctual: true,
            vipRequested: false,
            startPoint: AREA_COORDINATES[area] || BASRA_CENTER,
          });
          toast.success(`أهلاً بك كابتن ${name}! تم حفظ بياناتك وصورتك ومعلومات مركبتك لإدارة المنصة.`);
        } else {
          toast.success(`أهلاً بك يا ${name}! تم إنشاء حسابك كطالب بنجاح.`);
        }
      } else {
        if (method === "phone") {
          if (!phone.trim()) {
            toast.error("يرجى إدخال رقم الهاتف");
            setLoading(false);
            return;
          }
          await loginWithPhone(phone.trim(), role, name || undefined);
          toast.success(`تم تسجيل الدخول بنجاح كـ ${role === "student" ? "طالب" : "سائق"}`);
        } else {
          if (!email.trim() || !password.trim()) {
            toast.error("يرجى إدخال البريد الإلكتروني وكلمة المرور");
            setLoading(false);
            return;
          }
          await loginWithEmail(email.trim(), password, role);
          toast.success(`تم تسجيل الدخول بنجاح كـ ${role === "student" ? "طالب" : "سائق"}`);
        }
      }

      onSuccess?.();
      if (role === "driver") {
        navigate("/driver");
      } else {
        navigate("/");
      }
    } catch {
      toast.error("حدث خطأ أثناء تسجيل الدخول، يرجى المحاولة ثانية");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col justify-center bg-background px-4 py-8 sm:px-6">
      <div className="mx-auto w-full max-w-md space-y-6">
        {/* Brand App Header */}
        <div className="text-center space-y-2">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-3xl bg-gold/15 text-gold ring-1 ring-gold/40 shadow-lg">
            <Bus className="h-8 w-8 stroke-[2.2]" />
          </div>
          <h1 className="font-display text-3xl font-black tracking-tight text-foreground">
            خطوط المهندس
          </h1>
          <p className="text-xs font-semibold text-muted-foreground">
            منصة النقل الجامعي الأولى في محافظة البصرة
          </p>
        </div>

        {/* Card Box */}
        <div className="card-surface p-6 sm:p-8 shadow-xl animate-fade-up">
          {/* Step 1: Role Selector (طالب vs سائق) */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold text-muted-foreground">
              اختر هويتك للمتابعة:
            </label>
            <div className="grid grid-cols-2 gap-3">
              {/* Student Card */}
              <button
                type="button"
                onClick={() => setRole("student")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all active:scale-95",
                  role === "student"
                    ? "border-primary bg-primary/10 text-primary dark:text-gold shadow-md"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/40"
                )}
              >
                {role === "student" && (
                  <CheckCircle2 className="absolute top-2.5 left-2.5 h-4 w-4 text-primary dark:text-gold" />
                )}
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    role === "student"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <GraduationCap className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-display text-sm font-extrabold text-foreground">
                    طالب جامعي
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    أبحث عن خط وحجز مقعد
                  </span>
                </div>
              </button>

              {/* Driver Card */}
              <button
                type="button"
                onClick={() => setRole("driver")}
                className={cn(
                  "relative flex flex-col items-center gap-2 rounded-2xl border-2 p-4 text-center transition-all active:scale-95",
                  role === "driver"
                    ? "border-gold bg-gold/10 text-navy-deep dark:text-gold shadow-md"
                    : "border-border bg-card text-muted-foreground hover:border-border hover:bg-muted/40"
                )}
              >
                {role === "driver" && (
                  <CheckCircle2 className="absolute top-2.5 left-2.5 h-4 w-4 text-gold fill-gold text-navy-deep" />
                )}
                <div
                  className={cn(
                    "grid h-12 w-12 place-items-center rounded-2xl",
                    role === "driver"
                      ? "bg-gold text-navy-deep"
                      : "bg-muted text-muted-foreground"
                  )}
                >
                  <Bus className="h-6 w-6" />
                </div>
                <div>
                  <span className="font-display text-sm font-extrabold text-foreground">
                    سائق خط
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    نشر خط وإدارة الركاب
                  </span>
                </div>
              </button>
            </div>
          </div>

          {/* Login Mode Toggle: Phone vs Email */}
          <div className="mt-5 flex rounded-xl bg-muted/50 p-1">
            <button
              type="button"
              onClick={() => setMethod("phone")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all",
                method === "phone"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Phone className="h-3.5 w-3.5" />
              رقم الهاتف
            </button>
            <button
              type="button"
              onClick={() => setMethod("email")}
              className={cn(
                "flex flex-1 items-center justify-center gap-1.5 rounded-lg py-2 text-xs font-bold transition-all",
                method === "email"
                  ? "bg-card text-foreground shadow-sm ring-1 ring-border"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <Mail className="h-3.5 w-3.5" />
              البريد الإلكتروني
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-5 space-y-4">
            {/* If Registering, show full name */}
            {isRegister && (
              <div>
                <label className="mb-1 block text-xs font-bold text-foreground">
                  الاسم الكامل *
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    placeholder={role === "student" ? "مثال: مريم علي السعد" : "مثال: أبو كرار الحلفي"}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background pe-9 ps-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>
            )}

            {/* Phone Input */}
            {method === "phone" && (
              <div>
                <label className="mb-1 block text-xs font-bold text-foreground">
                  رقم الهاتف *
                </label>
                <div className="relative">
                  <Phone className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="tel"
                    required
                    dir="ltr"
                    placeholder="0770XXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background pe-9 ps-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-end"
                  />
                </div>
              </div>
            )}

            {/* Email Input */}
            {method === "email" && (
              <>
                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">
                    البريد الإلكتروني *
                  </label>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="email"
                      required
                      dir="ltr"
                      placeholder="name@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background pe-9 ps-3 text-xs font-mono text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-end"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground">
                    كلمة المرور *
                  </label>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute end-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="password"
                      required
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background pe-9 ps-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>
              </>
            )}

            {/* Role Specific Registration Fields */}
            {isRegister && role === "student" && (
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-xs font-bold text-muted-foreground">جامعتك</label>
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-bold text-muted-foreground">منطقة سكنك</label>
                  <select
                    value={area}
                    onChange={(e) => setArea(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                  >
                    {AREAS.map((a) => (
                      <option key={a} value={a}>
                        {a}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {isRegister && role === "driver" && (
              <div className="space-y-3.5 pt-1 border-t border-border">
                {/* 1. Driver Personal Photo */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1.5">
                      <Camera className="h-3.5 w-3.5 text-gold" />
                      الصورة الشخصية للكابتن *
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-full border border-amber-300">
                      خاصة بالإدارة فقط
                    </span>
                  </label>

                  <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-muted/30 border border-dashed border-border hover:border-gold/60 transition-all">
                    {photoUrl ? (
                      <img
                        src={photoUrl}
                        alt="معاينة الصورة"
                        className="h-14 w-14 rounded-2xl object-cover border-2 border-gold shadow-sm shrink-0"
                      />
                    ) : (
                      <div className="h-14 w-14 rounded-2xl bg-gold/15 text-gold flex items-center justify-center font-bold text-xl shrink-0 border border-gold/30">
                        👨‍✈️
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="file"
                        id="driver-photo-upload"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        className="hidden"
                      />
                      <label
                        htmlFor="driver-photo-upload"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-background border border-border text-xs font-bold text-foreground hover:bg-muted cursor-pointer transition-all shadow-sm"
                      >
                        <Camera className="h-3.5 w-3.5 text-gold" />
                        {photoUrl ? "تغيير الصورة الشخصية" : "رفع صورتك الشخصية"}
                      </label>
                      <p className="text-[10px] text-muted-foreground mt-1">
                        صورة واضحة للوجه تُستخدم فقط لتدقيق الهوية لدى الإدارة
                      </p>
                    </div>
                  </div>
                </div>

                {/* 2. Car Name & Model */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground flex items-center gap-1">
                      <Car className="h-3.5 w-3.5 text-gold" />
                      اسم السيارة والماركة *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: كيا سيراتو / هيونداي ستاركس"
                      value={carName}
                      onChange={(e) => setCarName(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-foreground">
                      الموديل (سنة الصنع) *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="مثال: 2023"
                      value={carModel}
                      onChange={(e) => setCarModel(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* 3. Car Color */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-foreground flex items-center justify-between">
                    <span className="flex items-center gap-1">
                      <Palette className="h-3.5 w-3.5 text-gold" />
                      لون السيارة *
                    </span>
                    <span className="text-[10px] text-muted-foreground">اختر أو اكتب اللون</span>
                  </label>
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      required
                      placeholder="مثال: أبيض لؤلؤي / رصاصي / أسود"
                      value={carColor}
                      onChange={(e) => setCarColor(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                    {/* Quick color buttons */}
                    <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar text-[11px]">
                      {["أبيض", "رصاصي", "أسود", "فضي", "أصفر", "أزرق"].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setCarColor(c)}
                          className={cn(
                            "px-2.5 py-1 rounded-lg border text-xs font-bold transition-all whitespace-nowrap",
                            carColor.includes(c)
                              ? "bg-gold text-navy-deep border-gold font-black"
                              : "bg-muted/40 border-border text-foreground hover:bg-muted"
                          )}
                        >
                          {c}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* 4. Vehicle Kind & Area */}
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-xs font-bold text-muted-foreground">صنف المركبة</label>
                    <select
                      value={vehicleKind}
                      onChange={(e) => setVehicleKind(e.target.value as "sedan" | "van" | "bus")}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                    >
                      <option value="sedan">صالون (4 ركاب)</option>
                      <option value="van">فان (10-14 راكب)</option>
                      <option value="bus">باص كوستر (24 راكب)</option>
                    </select>
                  </div>

                  <div>
                    <label className="mb-1 block text-xs font-bold text-muted-foreground">منطقة انطلاق خطك</label>
                    <select
                      value={area}
                      onChange={(e) => setArea(e.target.value)}
                      className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                    >
                      {AREAS.map((a) => (
                        <option key={a} value={a}>
                          {a}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Destination University */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-muted-foreground">جامعة الوجهة المقصودة لخطك</label>
                  <select
                    value={universityId}
                    onChange={(e) => setUniversityId(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs font-bold text-foreground"
                  >
                    {UNIVERSITIES.map((u) => (
                      <option key={u.id} value={u.id}>
                        {u.name} ({u.short})
                      </option>
                    ))}
                  </select>
                </div>

                {/* 5. Plate / License number */}
                <div>
                  <label className="mb-1 block text-xs font-bold text-muted-foreground">
                    رقم لوحة المركبة (اختياري للإدارة)
                  </label>
                  <input
                    type="text"
                    placeholder="مثال: بصرة 12345 خصوصي / أجرة"
                    value={licenseNumber}
                    onChange={(e) => setLicenseNumber(e.target.value)}
                    className="h-11 w-full rounded-xl border border-input bg-background px-3 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                {/* Privacy Badge */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-500/10 border border-amber-300/40 text-[11px] text-amber-700 dark:text-amber-400 font-medium">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-amber-600" />
                  <span>معلومات مركبتك وصورتك الشخصية مشفرة وتظهر حصرياً للجنة إدارة المنصة للتحقق والاعتماد.</span>
                </div>
              </div>
            )}

            {/* Submit Action */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "flex h-12 w-full items-center justify-center gap-2 rounded-xl text-sm font-black shadow-md transition-all active:scale-95",
                role === "driver"
                  ? "bg-gold text-navy-deep hover:bg-gold/90"
                  : "bg-primary text-primary-foreground hover:bg-primary/90"
              )}
            >
              <span>{isRegister ? "إنشاء الحساب والمتابعة" : "تسجيل الدخول"}</span>
              <ArrowLeft className="h-4 w-4" />
            </button>
          </form>

          {/* Toggle Login / Register */}
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => setIsRegister(!isRegister)}
              className="text-xs font-bold text-muted-foreground hover:text-primary"
            >
              {isRegister
                ? "لديك حساب بالفعل؟ تسجيل الدخول"
                : "مستخدم جديد؟ إنشاء حساب طالب أو سائق"}
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
