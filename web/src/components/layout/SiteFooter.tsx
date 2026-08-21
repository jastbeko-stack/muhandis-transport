import { Link } from "react-router-dom";
import { BusFront, MapPin, Phone, ShieldCheck } from "lucide-react";

import { PLATFORM_WHATSAPP } from "@/data/seed";

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-white/10 brand-surface text-white/75">
      <div className="container grid gap-10 py-12 md:grid-cols-3">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/40">
              <BusFront className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-xl font-extrabold text-white">خطوط المهندس</span>
          </div>
          <p className="max-w-sm text-sm leading-7">
            منصة بصراوية تجمع خطوط النقل الجامعي المعتمدة في مكان واحد، لتختار الطالبة أو الطالب الخط الأنسب بثقة ووضوح.
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-display text-base font-bold text-white">روابط سريعة</h3>
          <ul className="space-y-2">
            <li>
              <Link to="/services" className="transition-colors hover:text-gold">
                تصفح الخطوط المعتمدة
              </Link>
            </li>
            <li>
              <Link to="/about" className="transition-colors hover:text-gold">
                كيف تعمل المنصة
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="transition-colors hover:text-gold">
                لوحة تحكم المشرف
              </Link>
            </li>
          </ul>
        </div>

        <div className="space-y-3 text-sm">
          <h3 className="font-display text-base font-bold text-white">تواصل معنا</h3>
          <p className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-gold" aria-hidden="true" />
            <a href={`https://wa.me/${PLATFORM_WHATSAPP}`} className="transition-colors hover:text-gold" dir="ltr">
              +{PLATFORM_WHATSAPP}
            </a>
          </p>
          <p className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-gold" aria-hidden="true" />
            البصرة — العراق
          </p>
          <p className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-gold" aria-hidden="true" />
            جميع الخطوط تمر بمراجعة إدارية قبل النشر
          </p>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-xs text-white/55">
        © {new Date().getFullYear()} خطوط المهندس — جميع الحقوق محفوظة
      </div>
    </footer>
  );
}
