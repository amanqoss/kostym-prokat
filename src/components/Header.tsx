import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { whatsappLink } from "@/lib/config";
import LangSwitch from "./LangSwitch";

export default async function Header() {
  const lang = await getLang();

  const navItems = [
    { href: "/catalog", label: t(lang, "navCatalog") },
    { href: "/catalog?occasion=nauryz", label: t(lang, "navNauryz") },
    { href: "/catalog?occasion=newyear", label: t(lang, "navNewyear") },
    { href: "/catalog?occasion=autumn", label: t(lang, "navAutumn") },
    { href: "/catalog?occasion=victoryday", label: t(lang, "navVictory") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link href="/" className="flex items-baseline gap-2 shrink-0">
          <span className="font-display text-lg font-semibold text-primary-dark">
            {t(lang, "siteName")}
          </span>
        </Link>

        <nav className="hidden flex-1 items-center justify-center gap-5 text-sm font-medium text-foreground/80 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-primary transition-colors">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <LangSwitch lang={lang} />
          <a
            href={whatsappLink("Здравствуйте! Хочу узнать про прокат костюма.")}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden rounded-full bg-[#25D366] px-4 py-2 text-sm font-semibold text-white transition hover:brightness-95 sm:inline-block"
          >
            {t(lang, "whatsappCta")}
          </a>
        </div>
      </div>
      <nav className="flex gap-4 overflow-x-auto px-4 pb-3 text-sm font-medium text-foreground/80 md:hidden">
        {navItems.map((item) => (
          <Link key={item.href} href={item.href} className="whitespace-nowrap hover:text-primary">
            {item.label}
          </Link>
        ))}
      </nav>
      <div className="ornament-divider" />
    </header>
  );
}
