import React from "react";
import { Link } from "react-router-dom";
import { BusFront, Phone, MapPin, ShieldCheck } from "lucide-react";
import { DEFAULT_WHATSAPP } from "../../data/initialData";

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-border bg-card pt-12 pb-28 lg:pb-12 text-card-foreground">
      <div className="container grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {/* Brand Col */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-xl bg-gold/15 text-gold ring-1 ring-gold/40">
              <BusFront className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-display text-2xl font-black tracking-tight text-foreground">
              خطوط المهندس
            </span>
          </Link>
          <p className="text-sm leading-relaxed text-muted-foreground">
            منصة بصراوية تجمع خطوط النقل الجامعي المعتمدة في مكان واحد، لتختار الطالبة أو الطالب
            الخط الأنسب بثقة ووضوح.
          </p>
          <div className="flex items-center gap-2 text-xs font-bold text-success">
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            <span>جميع الخطوط تمر بمراجعة إدارية قبل النشر</span>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="font-display text-base font-extrabold text-foreground">روابط سريعة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>
              <Link to="/services" className="transition-colors hover:text-primary">
                تصفح الخطوط المعتمدة
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="transition-colors hover:text-primary">
                لوحة تحكم المشرف
              </Link>
            </li>
          </ul>
        </div>

        {/* Universities */}
        <div className="space-y-3">
          <h3 className="font-display text-base font-extrabold text-foreground">جامعات مغطاة</h3>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>جامعة البصرة - كرمة علي</li>
            <li>جامعة البصرة - باب الزبير</li>
            <li>جامعة المعقل</li>
            <li>جامعة البصرة للنفط والغاز</li>
            <li>الجامعة التقنية الجنوبية</li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="space-y-3">
          <h3 className="font-display text-base font-extrabold text-foreground">تواصل معنا</h3>
          <ul className="space-y-2.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
              <span>البصرة — العراق</span>
            </li>
            <li className="flex items-center gap-2.5">
              <Phone className="h-4 w-4 shrink-0 text-whatsapp" aria-hidden="true" />
              <a
                href={`https://wa.me/${DEFAULT_WHATSAPP}`}
                target="_blank"
                rel="noopener noreferrer"
                dir="ltr"
                className="font-mono hover:text-whatsapp"
              >
                +964 780 123 4567
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-8 border-t border-border pt-6 text-center text-xs text-muted-foreground">
        <p>
          خطوط المهندس © {new Date().getFullYear()} — جميع الحقوق محفوظة لطلبة وسائقي جامعات البصرة.
        </p>
      </div>
    </footer>
  );
};
