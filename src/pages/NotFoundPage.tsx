import React from "react";
import { Link } from "react-router-dom";
import { BusFront, House, ArrowLeft } from "lucide-react";

export const NotFoundPage: React.FC = () => {
  return (
    <div className="flex flex-1 flex-col items-center justify-center p-6 text-center">
      <div className="card-surface max-w-md p-10 space-y-4 animate-fade-up">
        <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary/10 text-primary mx-auto">
          <BusFront className="h-8 w-8" />
        </span>
        <h1 className="font-display text-4xl font-black text-foreground">404</h1>
        <h2 className="font-display text-xl font-bold text-foreground">
          الصفحة المطلوبة غير موجودة
        </h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          عذراً، قد يكون الرابط الذي اتبعته غير صحيح أو تم نقل الصفحة.
        </p>
        <div className="pt-2">
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-black text-primary-foreground shadow-md hover:bg-primary/90"
          >
            <House className="h-4 w-4" />
            العودة إلى الصفحة الرئيسية
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};
