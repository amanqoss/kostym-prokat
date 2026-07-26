import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { COMPANY, whatsappLink } from "@/lib/config";

export default async function Footer() {
  const lang = await getLang();
  return (
    <footer className="mt-16 border-t border-border bg-white/60">
      <div className="ornament-divider" />
      <div className="mx-auto grid max-w-6xl gap-8 px-4 py-10 text-sm text-foreground/70 sm:grid-cols-3">
        <div>
          <p className="font-display text-base text-primary-dark">{COMPANY.name}</p>
          <p className="mt-1">{t(lang, "tagline")} · {COMPANY.city}</p>
          <p className="mt-3">{t(lang, "footerRights")}</p>
        </div>

        <div>
          <p className="font-semibold text-foreground">{t(lang, "footerContacts")}</p>
          <p className="mt-2">
            <span className="text-foreground/50">{t(lang, "footerAddress")}: </span>
            {COMPANY.address}
          </p>
          <p className="mt-1">
            <span className="text-foreground/50">{t(lang, "footerHours")}: </span>
            {COMPANY.hours}
          </p>
          <p className="mt-1">
            <span className="text-foreground/50">{t(lang, "footerPhone")}: </span>
            <a href={whatsappLink("Здравствуйте! Хочу узнать про прокат костюма.")} className="text-primary hover:underline">
              {COMPANY.phone}
            </a>
          </p>
          <a
            href={COMPANY.twoGisUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 inline-block rounded-full border border-primary/30 px-4 py-1.5 text-xs font-semibold text-primary-dark transition hover:bg-primary/5"
          >
            {t(lang, "footer2gis")}
          </a>
        </div>

        <div>
          <p className="font-semibold text-foreground">{t(lang, "footerNav")}</p>
          <nav className="mt-2 flex flex-col gap-1.5">
            <Link href="/catalog" className="hover:text-primary">{t(lang, "navCatalog")}</Link>
            <Link href="/reviews" className="hover:text-primary">
              {lang === "kz" ? "Пікірлер" : "Отзывы"}
            </Link>
            <Link href="/catalog?occasion=nauryz" className="hover:text-primary">{t(lang, "navNauryz")}</Link>
            <Link href="/catalog?occasion=newyear" className="hover:text-primary">{t(lang, "navNewyear")}</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}
