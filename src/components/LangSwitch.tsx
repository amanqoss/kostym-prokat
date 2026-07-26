"use client";

import { useRouter } from "next/navigation";
import type { Lang } from "@/lib/i18n";

export default function LangSwitch({ lang }: { lang: Lang }) {
  const router = useRouter();

  function setLang(next: Lang) {
    document.cookie = `lang=${next}; path=/; max-age=${60 * 60 * 24 * 365}`;
    router.refresh();
  }

  return (
    <div className="flex items-center gap-1 rounded-full border border-border bg-white/70 p-0.5 text-sm font-medium">
      <button
        onClick={() => setLang("ru")}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "ru" ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"
        }`}
        aria-pressed={lang === "ru"}
      >
        RU
      </button>
      <button
        onClick={() => setLang("kz")}
        className={`rounded-full px-2.5 py-1 transition ${
          lang === "kz" ? "bg-primary text-white" : "text-foreground/60 hover:text-foreground"
        }`}
        aria-pressed={lang === "kz"}
      >
        ҚАЗ
      </button>
    </div>
  );
}
