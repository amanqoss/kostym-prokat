import { desc } from "drizzle-orm";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { updateReviewStatusAction } from "../actions";

const statusLabels: Record<string, string> = {
  pending: "На проверке",
  approved: "Опубликован",
  rejected: "Отклонён",
};

export default async function AdminReviewsPage() {
  const list = await db.select().from(reviews).orderBy(desc(reviews.createdAt));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-primary-dark">Отзывы</h1>

      <div className="mt-6 flex flex-col gap-3">
        {list.map((r) => (
          <div key={r.id} className="flex items-start gap-4 rounded-2xl border border-border bg-white p-4">
            {r.photoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={r.photoUrl} alt={r.authorName} className="h-20 w-20 rounded-xl object-cover" />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-xl bg-primary/10 text-2xl">💬</div>
            )}
            <div className="flex-1">
              <p className="font-medium text-foreground">
                {r.authorName} · {"★".repeat(r.ratingValue)}
              </p>
              <p className="mt-1 text-sm text-foreground/70">{r.textRu || r.textKz}</p>
              <p className="mt-1 text-xs text-foreground/40">
                Статус: {statusLabels[r.status] ?? r.status}
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <form
                action={async () => {
                  "use server";
                  await updateReviewStatusAction(r.id, "approved");
                }}
              >
                <button
                  disabled={r.status === "approved"}
                  className="rounded-full bg-nauryz px-3 py-1.5 text-xs font-semibold text-white disabled:opacity-40"
                >
                  Опубликовать
                </button>
              </form>
              <form
                action={async () => {
                  "use server";
                  await updateReviewStatusAction(r.id, "rejected");
                }}
              >
                <button
                  disabled={r.status === "rejected"}
                  className="rounded-full border border-newyear px-3 py-1.5 text-xs font-semibold text-newyear disabled:opacity-40"
                >
                  Отклонить
                </button>
              </form>
            </div>
          </div>
        ))}
        {list.length === 0 && (
          <p className="rounded-2xl border border-border bg-white p-6 text-center text-sm text-foreground/50">
            Отзывов пока нет
          </p>
        )}
      </div>
    </div>
  );
}
