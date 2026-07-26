import Link from "next/link";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { costumes, bookings, reviews } from "@/db/schema";

export default async function AdminHome() {
  const allCostumes = await db.select().from(costumes);
  const newBookings = await db.select().from(bookings).where(eq(bookings.bookingStatus, "new"));
  const pendingReviews = await db.select().from(reviews).where(eq(reviews.status, "pending"));

  const stats = [
    { label: "Костюмов в базе", value: allCostumes.length, href: "/admin/costumes" },
    { label: "Новых броней (ждут подтверждения)", value: newBookings.length, href: "/admin/bookings" },
    { label: "Отзывов на модерации", value: pendingReviews.length, href: "/admin/reviews" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-primary-dark">Обзор</h1>
      <div className="mt-6 grid gap-4 sm:grid-cols-3">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="rounded-2xl border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <p className="font-display text-3xl font-semibold text-primary-dark">{s.value}</p>
            <p className="mt-1 text-sm text-foreground/60">{s.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
