import Link from "next/link";
import { db } from "@/db";
import { costumes } from "@/db/schema";
import { updateCostumeStatusAction, deleteCostumeAction } from "../actions";
import StatusSelect from "@/components/admin/StatusSelect";

const statusLabels: Record<string, string> = {
  active: "В обороте",
  cleaning: "В химчистке",
  repair: "В ремонте",
  archived: "Списан",
};

export default async function AdminCostumesPage() {
  const list = await db.select().from(costumes).orderBy(costumes.id);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-semibold text-primary-dark">Костюмы</h1>
        <Link
          href="/admin/costumes/new"
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          + Добавить костюм
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-2xl border border-border bg-white">
        <table className="w-full text-sm">
          <thead className="border-b border-border bg-[#faf6ef] text-left text-xs uppercase tracking-wide text-foreground/50">
            <tr>
              <th className="px-4 py-3">Название</th>
              <th className="px-4 py-3">Размер</th>
              <th className="px-4 py-3">Цена</th>
              <th className="px-4 py-3">Статус</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-b border-border last:border-0">
                <td className="px-4 py-3">
                  <p className="font-medium text-foreground">{c.nameRu}</p>
                  <p className="text-xs text-foreground/50">{c.slug}</p>
                </td>
                <td className="px-4 py-3 text-foreground/70">{c.sizeLabel}</td>
                <td className="px-4 py-3 text-foreground/70">{c.pricePerRent.toLocaleString("ru-RU")} ₸</td>
                <td className="px-4 py-3">
                  <StatusSelect
                    defaultValue={c.status}
                    options={Object.entries(statusLabels).map(([value, label]) => ({ value, label }))}
                    onChangeAction={async (value) => {
                      "use server";
                      await updateCostumeStatusAction(c.id, value);
                    }}
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <div className="flex items-center justify-end gap-3">
                    <Link href={`/admin/costumes/${c.id}`} className="text-xs text-primary hover:underline">
                      Редактировать
                    </Link>
                    <form
                      action={async () => {
                        "use server";
                        await deleteCostumeAction(c.id);
                      }}
                    >
                      <button className="text-xs text-newyear hover:underline">Удалить</button>
                    </form>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {list.length === 0 && (
          <p className="p-6 text-center text-sm text-foreground/50">Костюмов пока нет</p>
        )}
      </div>
    </div>
  );
}
