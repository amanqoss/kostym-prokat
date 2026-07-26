import type { Lang } from "@/lib/i18n";

type Review = {
  authorName: string;
  ratingValue: number;
  textRu: string | null;
  textKz: string | null;
  photoUrl: string | null;
};

export default function ReviewCard({ review, lang }: { review: Review; lang: Lang }) {
  const text = (lang === "kz" ? review.textKz : review.textRu) || review.textRu || review.textKz;

  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-white">
      {review.photoUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={review.photoUrl} alt={review.authorName} className="h-48 w-full object-cover" />
      ) : (
        <img src="/uploads/reviews/IMG_9321.jpg" alt="Отзыв" className="h-48 w-full object-cover" />
      )}
      <div className="flex flex-1 flex-col p-4">
        <div className="text-gold">{"★".repeat(review.ratingValue)}{"☆".repeat(5 - review.ratingValue)}</div>
        <p className="mt-2 flex-1 text-sm text-foreground/80">{text}</p>
        <p className="mt-3 text-xs font-semibold text-foreground/60">{review.authorName}</p>
      </div>
    </div>
  );
}
