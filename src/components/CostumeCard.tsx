import Link from "next/link";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Costume = {
  slug: string;
  nameRu: string;
  nameKz: string;
  sizeLabel: string;
  ageGroup: string;
  pricePerRent: number;
  deposit: number;
  city: string;
  mainImageUrl?: string | null;
};

export default function CostumeCard({ costume, lang }: { costume: Costume; lang: Lang }) {
  const name = lang === "kz" ? costume.nameKz : costume.nameRu;
  const ageLabel =
    costume.ageGroup === "kindergarten"
      ? t(lang, "ageKindergarten")
      : costume.ageGroup === "primary_school"
      ? t(lang, "agePrimarySchool")
      : "";

  return (
    <Link
      href={`/costume/${costume.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-white transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex h-40 items-center justify-center overflow-hidden bg-gradient-to-br from-primary/10 to-gold/10 text-4xl">
        {costume.mainImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={costume.mainImageUrl}
            alt={name}
            className="h-full w-full object-cover"
          />
        ) : (
          "🎭"
        )}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <p className="font-display text-base font-semibold text-foreground group-hover:text-primary-dark">
          {name}
        </p>
        <p className="mt-1 text-xs text-foreground/60">
          {costume.sizeLabel} · {ageLabel} · {costume.city}
        </p>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold text-primary-dark">
            {costume.pricePerRent.toLocaleString("ru-RU")} ₸
          </span>
          <span className="text-xs text-foreground/50">{t(lang, "perEvent")}</span>
        </div>
        <p className="mt-0.5 text-xs text-foreground/50">
          {t(lang, "deposit")}: {costume.deposit.toLocaleString("ru-RU")} ₸
        </p>
        <span className="mt-3 text-sm font-semibold text-primary group-hover:underline">
          {t(lang, "viewDetails")} →
        </span>
      </div>
    </Link>
  );
}
