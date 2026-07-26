import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { bookings, costumes } from "@/db/schema";
import { updateBookingStatusAction } from "../actions";
import StatusSelect from "@/components/admin/StatusSelect";

const statusLabels: Record<string, string> = {
  new: "Новая",
  confirmed: "Подтверждена",
  completed: "Завершена",
  cancelled: "Отменена",
};

export default async function AdminBookingsPage() {
  const list = await db
    .select({
      id: bookings.id,
      dateFrom: bookings.dateFrom,
      dateTo: bookings.dateTo,
      parentName: bookings.parentName,
      phone: bookings.phone,
      childName: bookings.childName,
      bookingStatus: bookings.bookingStatus,
      costumeNameRu: costumes.nameRu,
    })
    .from(bookings)
    .leftJoin(costumes, eq(bookings.costumeId, costumes.id))
    .orderBy(desc(bookings.createdAt));

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-primary-dark">Брони</h1>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-[#faf6ef] text-left text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Костюм</th>
              <th className="px-4 py-3">Даты</th>
              <th className="px-4 py-3">Родитель / телефон</th>
              <th className="px-4 py-3">Ребёнок</th>
              <th className="px-4 py-3">Статус</th>
            </tr>
          </thead>
          <tbody>
            {list.map((b) => (
              <tr key={b.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3 font-medium text-foreground">{b.costumeNameRu}</td>
                <td className="px-4 py-3 text-foreground/70">
                  {b.dateFrom} — {b.dateTo}
                </td>
                <td className="px-4 py-3 text-foreground/70">
                  {b.parentName} · {b.phone}
                </td>
                <td className="px-4 py-3 text-foreground/70">{b.childName || "—"}</td>
                <td className="px-4 py-3">
                  <StatusSelect
                    defaultValue={b.bookingStatus}
                    options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                    onChangeAction={async (value) => {
                      "use server";
                      await updateBookingStatusAction(b.id, value);
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="p-6 text-center text-sm text-foreground/50">Броней пока нет</p>
        )}
      </div>
    </div>
  );
}
