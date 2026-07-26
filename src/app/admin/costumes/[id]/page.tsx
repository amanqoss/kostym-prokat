import { notFound } from "next/navigation";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { costumes, costumeTypes, occasions } from "@/db/schema";
import { getCostumeOccasionIds } from "@/db/queries";
import { updateCostumeAction } from "../../actions";

export default async function EditCostumePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const costumeId = Number(id);

  const [costume] = await db.select().from(costumes).where(eq(costumes.id, costumeId));
  if (!costume) return notFound();

  const types = await db.select().from(costumeTypes);
  const allOccasions = await db.select().from(occasions);
  const selectedOccasionIds = await getCostumeOccasionIds(costumeId);

  const updateAction = updateCostumeAction.bind(null, costumeId);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-primary-dark">
        Редактировать: {costume.nameRu}
      </h1>

      <form action={updateAction} className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-white p-6">
        <Row>
          <Field label="Название (RU)">
            <input name="nameRu" required defaultValue={costume.nameRu} className="input" />
          </Field>
          <Field label="Название (KZ)">
            <input name="nameKz" required defaultValue={costume.nameKz} className="input" />
          </Field>
        </Row>

        <p className="text-xs text-foreground/40">
          Slug (ссылка): <code>{costume.slug}</code> — менять нельзя, чтобы не сломать уже выданные ссылки
        </p>

        <Row>
          <Field label="Описание (RU)">
            <textarea name="descriptionRu" rows={2} defaultValue={costume.descriptionRu ?? ""} className="input" />
          </Field>
          <Field label="Описание (KZ)">
            <textarea name="descriptionKz" rows={2} defaultValue={costume.descriptionKz ?? ""} className="input" />
          </Field>
        </Row>

        <Row>
          <Field label="Тип костюма">
            <select name="costumeTypeId" defaultValue={costume.costumeTypeId ?? ""} className="input">
              {types.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.nameRu}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Возрастная группа">
            <select name="ageGroup" defaultValue={costume.ageGroup} className="input">
              <option value="kindergarten">Детский сад</option>
              <option value="primary_school">Начальная школа</option>
            </select>
          </Field>
        </Row>

        <Row>
          <Field label="Размер (например 98-104)">
            <input name="sizeLabel" required defaultValue={costume.sizeLabel} className="input" />
          </Field>
          <Field label="Город">
            <input name="city" defaultValue={costume.city} className="input" />
          </Field>
        </Row>

        <Row>
          <Field label="Цена аренды, ₸">
            <input name="pricePerRent" type="number" required defaultValue={costume.pricePerRent} className="input" />
          </Field>
          <Field label="Залог, ₸">
            <input name="deposit" type="number" required defaultValue={costume.deposit} className="input" />
          </Field>
        </Row>

        <Field label={costume.mainImageUrl ? "Заменить фото (сейчас есть фото)" : "Загрузить фото"}>
          {costume.mainImageUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={costume.mainImageUrl}
              alt={costume.nameRu}
              className="mb-2 h-32 w-32 rounded-xl object-cover"
            />
          )}
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="input" />
        </Field>

        <Field label="Праздники / поводы (можно несколько)">
          <div className="flex flex-wrap gap-3">
            {allOccasions.map((o) => (
              <label key={o.id} className="flex items-center gap-1.5 text-sm">
                <input
                  type="checkbox"
                  name="occasionIds"
                  value={o.id}
                  defaultChecked={selectedOccasionIds.includes(o.id)}
                />
                {o.nameRu}
              </label>
            ))}
          </div>
        </Field>

        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Сохранить изменения
        </button>
      </form>
    </div>
  );
}

function Row({ children }: { children: React.ReactNode }) {
  return <div className="grid gap-4 sm:grid-cols-2">{children}</div>;
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground/60">{label}</span>
      {children}
    </label>
  );
}
