import { notFound } from "next/navigation";
import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { getCostumeBySlug } from "@/db/queries";
import { WHATSAPP_PHONE } from "@/lib/config";
import BookingForm from "@/components/BookingForm";

export default async function CostumePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const lang = await getLang();
  const costume = await getCostumeBySlug(slug);

  if (!costume) return notFound();

  const name = lang === "kz" ? costume.nameKz : costume.nameRu;
  const description = lang === "kz" ? costume.descriptionKz : costume.descriptionRu;
  const ageLabel =
    costume.ageGroup === "kindergarten" ? t(lang, "ageKindergarten") : t(lang, "agePrimarySchool");

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="grid gap-10 md:grid-cols-2">
        <div className="flex h-80 items-center justify-center overflow-hidden rounded-2xl bg-linear-to-br from-primary/10 to-gold/10 text-7xl md:h-full">
          {costume.mainImageUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={costume.mainImageUrl} alt={name} className="h-full w-full object-cover" />
          ) : (
            "🎭"
          )}
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-primary-dark md:text-3xl">{name}</h1>
          <p className="mt-2 text-sm text-foreground/60">
            {costume.sizeLabel} · {ageLabel} · {costume.city}
          </p>
          {description && <p className="mt-4 text-foreground/80">{description}</p>}

          <div className="mt-6 flex items-baseline gap-3">
            <span className="font-display text-2xl font-semibold text-primary-dark">
              {costume.pricePerRent.toLocaleString("ru-RU")} ₸
            </span>
            <span className="text-sm text-foreground/50">{t(lang, "perEvent")}</span>
          </div>
          <p className="mt-1 text-sm text-foreground/60">
            {t(lang, "deposit")}: {costume.deposit.toLocaleString("ru-RU")} ₸
          </p>

          <div className="mt-8">
            <BookingForm
              lang={lang}
              costumeId={costume.id}
              costumeName={name}
              whatsappPhone={WHATSAPP_PHONE}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
