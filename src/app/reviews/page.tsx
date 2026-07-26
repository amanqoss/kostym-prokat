import { getLang } from "@/lib/getLang";
import { t } from "@/lib/i18n";
import { getApprovedReviews } from "@/db/queries";
import ReviewCard from "@/components/ReviewCard";
import ReviewForm from "@/components/ReviewForm";

export default async function ReviewsPage() {
  const lang = await getLang();
  const allReviews = await getApprovedReviews();

  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <h1 className="font-display text-2xl font-semibold text-primary-dark md:text-3xl">
        {t(lang, "reviewsPageTitle")}
      </h1>

      <div className="mt-8 grid gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {allReviews.length === 0 ? (
            <p className="rounded-xl border border-border bg-white/70 p-6 text-center text-foreground/70">
              {t(lang, "reviewsEmpty")}
            </p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2">
              {allReviews.map((r) => (
                <ReviewCard key={r.id} review={r} lang={lang} />
              ))}
            </div>
          )}
        </div>

        <div>
          <ReviewForm lang={lang} />
        </div>
      </div>
    </div>
  );
}
