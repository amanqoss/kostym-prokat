import Link from "next/link";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { db } from "@/db";
import { occasions } from "@/db/schema";
import { getApprovedReviews } from "@/db/queries";
import ReviewCard from "@/components/ReviewCard";

const occasionAccent: Record<string, string> = {
  nauryz: "bg-nauryz/10 border-nauryz/30 text-nauryz",
  newyear: "bg-newyear/10 border-newyear/30 text-newyear",
  autumn: "bg-autumn/10 border-autumn/30 text-autumn",
  victoryday: "bg-victory/10 border-victory/30 text-victory",
  any: "bg-primary/10 border-primary/30 text-primary",
};

export default async function Home() {
  const lang = await getLang();
  const allOccasions = await db.select().from(occasions);
  const featuredReviews = await getApprovedReviews(6);

  const occasionNames: Record<string, { ru: string; kz: string }> = {
    nauryz: { ru: "Наурыз", kz: "Наурыз" },
    newyear: { ru: "Новый год", kz: "Жаңа жыл" },
    autumn: { ru: "Осенний бал", kz: "Күз балы" },
    victoryday: { ru: "9 Мая", kz: "9 Мамыр" },
    any: { ru: "На любой день рождения", kz: "Кез келген туған күнге" },
  };

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-16 md:grid-cols-2 md:py-24">
          <div className="flex flex-col justify-center">
            <span className="mb-4 inline-block w-fit rounded-full border border-gold/40 bg-gold/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-gold">
              {t(lang, "tagline")}
            </span>
            <h1 className="font-display text-3xl leading-tight font-semibold text-primary-dark md:text-4xl">
              {t(lang, "heroTitle")}
            </h1>
            <p className="mt-4 text-base text-foreground/75 md:text-lg">{t(lang, "heroSubtitle")}</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link
                href="/catalog"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-primary-dark"
              >
                {t(lang, "heroCta")}
              </Link>
              <Link
                href="#occasions"
                className="rounded-full border border-primary/30 px-6 py-3 text-sm font-semibold text-primary-dark transition hover:bg-primary/5"
              >
                {t(lang, "heroCtaSecondary")}
              </Link>
            </div>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="grid grid-cols-2 gap-3">
              <div className="h-36 rounded-2xl bg-nauryz/15 border border-nauryz/25" />
              <div className="mt-6 h-36 rounded-2xl bg-newyear/15 border border-newyear/25" />
              <div className="h-36 rounded-2xl bg-autumn/15 border border-autumn/25" />
              <div className="mt-6 h-36 rounded-2xl bg-primary/15 border border-primary/25" />
            </div>
          </div>
        </div>
      </section>

      <div className="ornament-divider" />

      {/* OCCASIONS */}
      <section id="occasions" className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-semibold text-primary-dark">
          {t(lang, "occasionsTitle")}
        </h2>
        <p className="mt-2 text-foreground/70">{t(lang, "occasionsSubtitle")}</p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {allOccasions.map((o) => {
            const accent = occasionAccent[o.slug] ?? occasionAccent.any;
            const names = occasionNames[o.slug] ?? { ru: o.nameRu, kz: o.nameKz };
            return (
              <Link
                key={o.id}
                href={`/catalog?occasion=${o.slug}`}
                className={`rounded-2xl border p-5 transition hover:-translate-y-0.5 hover:shadow-md ${accent}`}
              >
                <p className="font-display text-lg font-semibold">
                  {lang === "kz" ? names.kz : names.ru}
                </p>
                {o.peakMonth && (
                  <p className="mt-2 text-xs opacity-70">
                    {lang === "kz" ? "Мезгіл шыңы" : "Пик сезона"}:{" "}
                    {new Date(2000, o.peakMonth - 1).toLocaleString(lang === "kz" ? "kk" : "ru", {
                      month: "long",
                    })}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-white/60 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="font-display text-2xl font-semibold text-primary-dark">{t(lang, "howTitle")}</h2>
          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              { title: t(lang, "how1title"), text: t(lang, "how1text") },
              { title: t(lang, "how2title"), text: t(lang, "how2text") },
              { title: t(lang, "how3title"), text: t(lang, "how3text") },
            ].map((step, i) => (
              <div key={i} className="rounded-2xl border border-border bg-background p-6">
                <span className="font-display text-2xl font-semibold text-gold">{i + 1}</span>
                <p className="mt-3 font-semibold text-foreground">{step.title}</p>
                <p className="mt-1 text-sm text-foreground/70">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      {featuredReviews.length > 0 && (
        <section className="bg-white/60 py-16">
          <div className="mx-auto max-w-6xl px-4">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <h2 className="font-display text-2xl font-semibold text-primary-dark">
                  {t(lang, "reviewsTitle")}
                </h2>
                <p className="mt-2 text-foreground/70">{t(lang, "reviewsSubtitle")}</p>
              </div>
              <Link href="/reviews" className="text-sm font-semibold text-primary hover:underline">
                {t(lang, "reviewsSeeAll")} →
              </Link>
            </div>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {featuredReviews.map((r) => (
                <ReviewCard key={r.id} review={r} lang={lang} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* TRUST */}
      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="font-display text-2xl font-semibold text-primary-dark">{t(lang, "trustTitle")}</h2>
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[t(lang, "trust1"), t(lang, "trust2"), t(lang, "trust3"), t(lang, "trust4")].map((item, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl border border-border bg-white/70 p-4">
              <span className="mt-0.5 text-gold">✦</span>
              <p className="text-sm text-foreground/80">{item}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
