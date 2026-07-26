import { db } from "./index";
import { reviews, occasions } from "./schema";
import { eq } from "drizzle-orm";

async function seedReviews() {
  const [nauryz] = await db.select().from(occasions).where(eq(occasions.slug, "nauryz"));
  const [newyear] = await db.select().from(occasions).where(eq(occasions.slug, "newyear"));
  const [autumn] = await db.select().from(occasions).where(eq(occasions.slug, "autumn"));

  const data = [
    {
      authorName: "Айгерим, мама Аружан",
      ratingValue: 5,
      textRu: "Брали такия и платье на Наурыз в садик №25. Всё чистое, красивое, размер подошёл идеально. Спасибо!",
      textKz: "Наурызға 25-балабақшаға тақия мен көйлек алдық. Барлығы таза, әдемі, өлшемі дәл келді. Рахмет!",
      occasionId: nauryz?.id,
      status: "approved",
    },
    {
      authorName: "Марат",
      ratingValue: 5,
      textRu: "Сын был снежинкой... то есть гномиком на утреннике :) Костюм яркий, ребёнку очень понравился.",
      textKz: "Ұлым ертеңгілікте гном болды. Костюм жарқын, балаға өте ұнады.",
      occasionId: newyear?.id,
      status: "approved",
    },
    {
      authorName: "Жанна",
      ratingValue: 4,
      textRu: "Костюм морковки на Осенний бал — забронировали за день, всё оперативно решили в WhatsApp.",
      textKz: "Күз балына сәбіз костюмі — бір күн бұрын брондадық, WhatsApp арқылы бәрін тез шештік.",
      occasionId: autumn?.id,
      status: "approved",
    },
  ];

  await db.insert(reviews).values(data);
  console.log(`Добавлено отзывов: ${data.length}`);
}

seedReviews()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
