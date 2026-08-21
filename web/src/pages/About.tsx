import { useState } from "react";
import { Link } from "react-router-dom";
import { BadgeCheck, ClipboardCheck, Crown, MapPinned, MessageCircle, Search, ShieldCheck, UserPlus } from "lucide-react";

import { DriverApplyDialog } from "@/components/dialogs/DriverApplyDialog";
import { SiteFooter } from "@/components/layout/SiteFooter";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { VIP_FEE } from "@/data/seed";
import { formatIqd } from "@/lib/format";
import { usePlatform } from "@/store/PlatformStore";

const STUDENT_STEPS = [
  { icon: Search, title: "ابحث", body: "اختر جامعتك ومنطقتك ونوع الخط والدوام لتظهر لك الخطوط المطابقة فقط." },
  { icon: MapPinned, title: "حدد موقعك", body: "اسحب الدبوس على الخريطة لتحديد نقطة انطلاقك بدقة قرب بيتك." },
  { icon: MessageCircle, title: "أرسل الطلب", body: "يصل السائق رسالة واتساب فيها تفاصيل الخط ورابط موقعك جاهزاً." },
];

const DRIVER_STEPS = [
  { icon: UserPlus, title: "سجّل خطك", body: "أدخل بيانات المركبة والمسار والسعر ومواعيد الذهاب والعودة." },
  { icon: ClipboardCheck, title: "مراجعة المشرف", body: "يتحقق فريق المنصة من البيانات قبل نشر الخط للطلبة." },
  { icon: Crown, title: "ترقية VIP", body: `اطلب الترقية مقابل ${formatIqd(VIP_FEE)} شهرياً ليظهر خطك في أعلى الصفحة.` },
];

export default function About() {
  const { activeLines, vipLines } = usePlatform();
  const [driverOpen, setDriverOpen] = useState<boolean>(false);

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />

      <main className="flex-1">
        <section className="hero-grid relative overflow-hidden brand-surface py-16 text-white">
          <div className="container relative max-w-3xl space-y-4 animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-gold/40 bg-gold/10 px-4 py-1.5 text-xs font-bold text-gold">
              <ShieldCheck className="h-4 w-4" aria-hidden="true" />
              عن المنصة
            </span>
            <h1 className="font-display text-4xl font-black sm:text-5xl">نقل جامعي منظّم في البصرة</h1>
            <p className="text-lg leading-8 text-white/85">
              بدأت «خطوط المهندس» من مشكلة يعرفها كل طالب بصراوي: البحث عن خط نقل موثوق كل بداية سنة دراسية عبر مجموعات
              متفرقة وأرقام مجهولة. جمعنا الخطوط في مكان واحد، بمعلومات واضحة ومراجعة إدارية قبل النشر.
            </p>
            <div className="flex flex-wrap gap-6 pt-2">
              {[
                { value: `${activeLines.length}`, label: "خط منشور" },
                { value: `${vipLines.length}`, label: "خط مميز VIP" },
                { value: "5", label: "جامعات مغطاة" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-display text-3xl font-black text-gold">{stat.value}</p>
                  <p className="text-sm text-white/70">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="container mt-14">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-foreground">للطالب — ثلاث خطوات</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {STUDENT_STEPS.map((step, index) => (
              <article key={step.title} className="card-surface relative p-6">
                <span className="absolute start-6 top-6 font-display text-5xl font-black text-primary/10">{index + 1}</span>
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="container mt-14">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-foreground">للسائق — انشر خطك</h2>
          <div className="grid gap-5 md:grid-cols-3">
            {DRIVER_STEPS.map((step) => (
              <article key={step.title} className="card-surface p-6">
                <span className="mb-4 grid h-12 w-12 place-items-center rounded-xl bg-gold/15 text-gold">
                  <step.icon className="h-6 w-6" aria-hidden="true" />
                </span>
                <h3 className="font-display text-lg font-bold text-foreground">{step.title}</h3>
                <p className="mt-1 text-sm leading-7 text-muted-foreground">{step.body}</p>
              </article>
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button
              type="button"
              onClick={() => setDriverOpen(true)}
              className="h-12 gap-2 rounded-xl px-6 text-base font-bold active:scale-[0.98]"
            >
              <UserPlus className="h-5 w-5" aria-hidden="true" />
              أضف خطك الآن
            </Button>
            <Button asChild variant="outline" className="h-12 gap-2 rounded-xl px-6 text-base font-bold">
              <Link to="/services">
                <BadgeCheck className="h-5 w-5" aria-hidden="true" />
                تصفح الخطوط المنشورة
              </Link>
            </Button>
          </div>
        </section>

        <section className="container mt-14">
          <h2 className="mb-6 font-display text-2xl font-extrabold text-foreground">أسئلة شائعة</h2>
          <Accordion type="single" collapsible className="card-surface divide-y divide-border px-5">
            <AccordionItem value="q1" className="border-none">
              <AccordionTrigger className="text-start font-display text-base font-bold">
                هل الحجز يتم عبر المنصة؟
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                المنصة تعرّفك على الخط المناسب وترسل طلبك للسائق عبر واتساب مع رابط موقعك. الاتفاق النهائي والدفع يتمان
                مباشرة بينك وبين السائق.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q2" className="border-none">
              <AccordionTrigger className="text-start font-display text-base font-bold">
                ما معنى خط «بنات فقط»؟
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                خط مخصص للطالبات فقط، وغالباً بسائق معروف لدى العوائل أو بسائقة. يمكنك فلترة النتائج لعرض هذه الخطوط فقط.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q3" className="border-none">
              <AccordionTrigger className="text-start font-display text-base font-bold">
                كيف يصبح الخط مميزاً VIP؟
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                يطلب السائق الترقية عند التسجيل ويدفع رسم {formatIqd(VIP_FEE)} شهرياً، ثم يعتمد المشرف الطلب فيظهر الخط
                بإطار ذهبي في أعلى الصفحة الرئيسية.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="q4" className="border-none">
              <AccordionTrigger className="text-start font-display text-base font-bold">
                منطقتي غير مغطاة، ماذا أفعل؟
              </AccordionTrigger>
              <AccordionContent className="text-sm leading-7 text-muted-foreground">
                أرسل طلب تغطية من صفحة الخدمات مع تحديد موقعك على الخريطة، ويصل الطلب إلى الإدارة للبحث عن سائق في منطقتك.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </section>
      </main>

      <SiteFooter />
      <DriverApplyDialog open={driverOpen} onOpenChange={setDriverOpen} />
    </div>
  );
}
