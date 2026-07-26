import { db } from "@/db";
import { costumeTypes, occasions } from "@/db/schema";
import { createCostumeAction } from "../../actions";

export default async function NewCostumePage() {
  const types = await db.select().from(costumeTypes);
  const allOccasions = await db.select().from(occasions);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="font-display text-2xl font-semibold text-primary-dark">Добавить костюм</h1>

      <form action={createCostumeAction} className="mt-6 flex flex-col gap-4 rounded-2xl border border-border bg-white p-6">
        <Row>
          <Field label="Название (RU)">
            <input name="nameRu" required className="input" />
          </Field>
          <Field label="Название (KZ)">
            <input name="nameKz" required className="input" />
          </Field>
        </Row>

        <Field label="Slug (латиницей, для ссылки, например snowman-104-110)">
          <input name="slug" required className="input" />
        </Field>

        <Row>
          <Field label="Описание (RU)">
            <textarea name="descriptionRu" rows={2} className="input" />
          </Field>
          <Field label="Описание (KZ)">
            <textarea name="descriptionKz" rows={2} className="input" />
          </Field>
        </Row>

        <Row>
          <Field label="Тип костюма">
            <select name="costumeTypeId" className="input">
              {types.map((tp) => (
                <option key={tp.id} value={tp.id}>
                  {tp.nameRu}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Возрастная группа">
            <select name="ageGroup" className="input">
              <option value="kindergarten">Детский сад</option>
              <option value="primary_school">Начальная школа</option>
            </select>
          </Field>
        </Row>

        <Row>
          <Field label="Размер (например 98-104)">
            <input name="sizeLabel" required className="input" />
          </Field>
          <Field label="Город">
            <input name="city" defaultValue="Алматы" className="input" />
          </Field>
        </Row>

        <Row>
          <Field label="Цена аренды, ₸">
            <input name="pricePerRent" type="number" required className="input" />
          </Field>
          <Field label="Залог, ₸">
            <input name="deposit" type="number" required className="input" />
          </Field>
        </Row>

        <Field label="Фото костюма">
          <input type="file" name="photo" accept="image/jpeg,image/png,image/webp" className="input" />
        </Field>

        <Field label="Праздники / поводы (можно несколько)">
          <div className="flex flex-wrap gap-3">
            {allOccasions.map((o) => (
              <label key={o.id} className="flex items-center gap-1.5 text-sm">
                <input type="checkbox" name="occasionIds" value={o.id} />
                {o.nameRu}
              </label>
            ))}
          </div>
        </Field>

        <button
          type="submit"
          className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
        >
          Сохранить костюм
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
