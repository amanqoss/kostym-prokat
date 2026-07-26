import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { getCatalog, getAllOccasions, getAllTypes } from "@/db/queries";
import CostumeCard from "@/components/CostumeCard";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ occasion?: string; type?: string; age?: string }>;
}) {
  const lang = await getLang();
  const params = await searchParams;

  const [costumeList, allOccasions, allTypes] = await Promise.all([
    getCatalog(params),
    getAllOccasions(),
    getAllTypes(),
  ]);

  function buildHref(next: Partial<typeof params>) {
    const merged = { ...params, ...next };
    const qs = new URLSearchParams();
    if (merged.occasion) qs.set("occasion", merged.occasion);
    if (merged.type) qs.set("type", merged.type);
    if (merged.age) qs.set("age", merged.age);
    const s = qs.toString();
    return `/catalog${s ? `?${s}` : ""}`;
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-primary-dark md:text-3xl">
        {t(lang, "catalogTitle")}
      </h1>

      {/* FILTERS */}
      <div className="mt-6 flex flex-wrap gap-6">
        <FilterGroup
          label={t(lang, "filterOccasion")}
          activeSlug={params.occasion}
          allHref={buildHref({ occasion: undefined })}
          allLabel={t(lang, "filterAll")}
          options={allOccasions.map((o) => ({
            slug: o.slug,
            label: lang === "kz" ? o.nameKz : o.nameRu,
            href: buildHref({ occasion: o.slug }),
          }))}
        />
        <FilterGroup
          label={t(lang, "filterType")}
          activeSlug={params.type}
          allHref={buildHref({ type: undefined })}
          allLabel={t(lang, "filterAll")}
          options={allTypes.map((tp) => ({
            slug: tp.slug,
            label: lang === "kz" ? tp.nameKz : tp.nameRu,
            href: buildHref({ type: tp.slug }),
          }))}
        />
        <FilterGroup
          label={t(lang, "filterAge")}
          activeSlug={params.age}
          allHref={buildHref({ age: undefined })}
          allLabel={t(lang, "filterAll")}
          options={[
            { slug: "kindergarten", label: t(lang, "ageKindergarten"), href: buildHref({ age: "kindergarten" }) },
            { slug: "primary_school", label: t(lang, "agePrimarySchool"), href: buildHref({ age: "primary_school" }) },
          ]}
        />
      </div>

      {/* RESULTS */}
      {costumeList.length === 0 ? (
        <p className="mt-12 rounded-xl border border-border bg-white/70 p-6 text-center text-foreground/70">
          {t(lang, "noResults")}
        </p>
      ) : (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {costumeList.map((c) => (
            <CostumeCard key={c.id} costume={c} lang={lang} />
          ))}
        </div>
      )}
    </div>
  );
}

function FilterGroup({
  label,
  options,
  activeSlug,
  allHref,
  allLabel,
}: {
  label: string;
  options: { slug: string; label: string; href: string }[];
  activeSlug?: string;
  allHref: string;
  allLabel: string;
}) {
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground/50">{label}</p>
      <div className="flex flex-wrap gap-2">
        <a
          href={allHref}
          className={`rounded-full border px-3 py-1.5 text-sm transition ${
            !activeSlug
              ? "border-primary bg-primary text-white"
              : "border-border bg-white text-foreground/70 hover:border-primary/40"
          }`}
        >
          {allLabel}
        </a>
        {options.map((opt) => (
          <a
            key={opt.slug}
            href={opt.href}
            className={`rounded-full border px-3 py-1.5 text-sm transition ${
              activeSlug === opt.slug
                ? "border-primary bg-primary text-white"
                : "border-border bg-white text-foreground/70 hover:border-primary/40"
            }`}
          >
            {opt.label}
          </a>
        ))}
      </div>
    </div>
  );
}
