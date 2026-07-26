import { db } from "./index";
import { occasions, costumeTypes, costumes, costumeOccasions } from "./schema";

async function seed() {
  console.log("Очищаю и наполняю базу...");

  // 1. Поводы / события
  const occasionData = [
    { slug: "nauryz", nameRu: "Наурыз", nameKz: "Наурыз", peakMonth: 3 },
    { slug: "newyear", nameRu: "Новый год", nameKz: "Жаңа жыл", peakMonth: 12 },
    { slug: "autumn", nameRu: "Осенний бал", nameKz: "Күз балы", peakMonth: 10 },
    { slug: "victoryday", nameRu: "9 Мая / День Победы", nameKz: "9 Мамыр / Жеңіс күні", peakMonth: 5 },
    { slug: "any", nameRu: "День рождения / Утренник", nameKz: "Туған күн / Ертеңгілік", peakMonth: null },
  ];
  const insertedOccasions = await db.insert(occasions).values(occasionData).returning();
  const occ = Object.fromEntries(insertedOccasions.map((o) => [o.slug, o.id]));

  // 2. Типы костюмов
  const typeData = [
    { slug: "national", nameRu: "Национальный костюм", nameKz: "Ұлттық костюм" },
    { slug: "character", nameRu: "Персонаж / сказочный герой", nameKz: "Кейіпкер / ертегі кейіпкері" },
    { slug: "animal", nameRu: "Костюм животного", nameKz: "Жануар костюмі" },
    { slug: "military", nameRu: "Военная форма", nameKz: "Әскери форма" },
    { slug: "nature", nameRu: "Овощи / фрукты / природа", nameKz: "Көкөніс / жеміс / табиғат" },
  ];
  const insertedTypes = await db.insert(costumeTypes).values(typeData).returning();
  const type = Object.fromEntries(insertedTypes.map((t) => [t.slug, t.id]));

  // 3. Костюмы
  const costumeData = [
    {
      slug: "kamzol-boy-98-104",
      nameRu: "Камзол мужской (мальчик)",
      nameKz: "Ер бала камзолы",
      descriptionRu: "Национальный камзол с орнаментом, для Наурыза и утренников.",
      descriptionKz: "Өрнекті ұлттық камзол, Наурызға және ертеңгіліктерге арналған.",
      costumeTypeId: type.national,
      sizeLabel: "98-104",
      ageGroup: "kindergarten",
      pricePerRent: 4000,
      deposit: 10000,
      city: "Алматы",
      occasionSlugs: ["nauryz", "any"],
    },
    {
      slug: "takiya-set-girl-104-110",
      nameRu: "Такия + национальное платье (девочка)",
      nameKz: "Тақия + ұлттық көйлек (қыз)",
      descriptionRu: "Комплект: такия, платье с национальным орнаментом.",
      descriptionKz: "Жинақ: тақия, ұлттық өрнекті көйлек.",
      costumeTypeId: type.national,
      sizeLabel: "104-110",
      ageGroup: "kindergarten",
      pricePerRent: 4500,
      deposit: 10000,
      city: "Алматы",
      occasionSlugs: ["nauryz", "any"],
    },
    {
      slug: "snowflake-girl-116-122",
      nameRu: "Снежинка",
      nameKz: "Ақша қар",
      descriptionRu: "Пышное платье снежинки с блёстками, на утренник к Новому году.",
      descriptionKz: "Жаңа жылға арналған жылтыр көйлек.",
      costumeTypeId: type.character,
      sizeLabel: "116-122",
      ageGroup: "kindergarten",
      pricePerRent: 5000,
      deposit: 12000,
      city: "Алматы",
      occasionSlugs: ["newyear"],
    },
    {
      slug: "gnome-boy-104-110",
      nameRu: "Гномик",
      nameKz: "Гном",
      descriptionRu: "Колпак и жилет гнома, яркий и уютный костюм на Новый год.",
      descriptionKz: "Жаңа жылға арналған гном костюмі.",
      costumeTypeId: type.character,
      sizeLabel: "104-110",
      ageGroup: "kindergarten",
      pricePerRent: 4000,
      deposit: 8000,
      city: "Алматы",
      occasionSlugs: ["newyear"],
    },
    {
      slug: "ded-moroz-adult-child-122-128",
      nameRu: "Дед Мороз (детский)",
      nameKz: "Аяз Ата (балаларға арналған)",
      descriptionRu: "Костюм Деда Мороза для утренника или конкурса.",
      descriptionKz: "Ертеңгілікке арналған Аяз Ата костюмі.",
      costumeTypeId: type.character,
      sizeLabel: "122-128",
      ageGroup: "primary_school",
      pricePerRent: 6000,
      deposit: 15000,
      city: "Алматы",
      occasionSlugs: ["newyear"],
    },
    {
      slug: "carrot-98-104",
      nameRu: "Морковка",
      nameKz: "Сәбіз",
      descriptionRu: "Костюм морковки для Осеннего бала.",
      descriptionKz: "Күз балына арналған сәбіз костюмі.",
      costumeTypeId: type.nature,
      sizeLabel: "98-104",
      ageGroup: "kindergarten",
      pricePerRent: 3500,
      deposit: 7000,
      city: "Алматы",
      occasionSlugs: ["autumn"],
    },
    {
      slug: "mushroom-104-110",
      nameRu: "Мухомор / Грибок",
      nameKz: "Саңырауқұлақ",
      descriptionRu: "Яркий костюм гриба на Осенний бал.",
      descriptionKz: "Күз балына арналған саңырауқұлақ костюмі.",
      costumeTypeId: type.nature,
      sizeLabel: "104-110",
      ageGroup: "kindergarten",
      pricePerRent: 3500,
      deposit: 7000,
      city: "Алматы",
      occasionSlugs: ["autumn"],
    },
    {
      slug: "soldier-form-122-128",
      nameRu: "Военная форма (пехота ВОВ)",
      nameKz: "Әскери форма",
      descriptionRu: "Реплика военной формы для утренника к 9 Мая.",
      descriptionKz: "9 Мамырға арналған әскери форма.",
      costumeTypeId: type.military,
      sizeLabel: "122-128",
      ageGroup: "primary_school",
      pricePerRent: 5000,
      deposit: 10000,
      city: "Алматы",
      occasionSlugs: ["victoryday"],
    },
    {
      slug: "aldar-kose-110-116",
      nameRu: "Алдар Косе",
      nameKz: "Алдар Көсе",
      descriptionRu: "Костюм героя казахских сказок Алдара Косе.",
      descriptionKz: "Қазақ ертегісінің кейіпкері Алдар Көсе костюмі.",
      costumeTypeId: type.character,
      sizeLabel: "110-116",
      ageGroup: "kindergarten",
      pricePerRent: 4500,
      deposit: 9000,
      city: "Алматы",
      occasionSlugs: ["nauryz", "any"],
    },
    {
      slug: "hare-98-104",
      nameRu: "Зайчик",
      nameKz: "Қоян",
      descriptionRu: "Универсальный костюм зайца — подходит на любой праздник.",
      descriptionKz: "Кез келген мерекеге сай қоян костюмі.",
      costumeTypeId: type.animal,
      sizeLabel: "98-104",
      ageGroup: "kindergarten",
      pricePerRent: 3500,
      deposit: 7000,
      city: "Алматы",
      occasionSlugs: ["any", "newyear", "autumn"],
    },
    {
      slug: "fox-104-110",
      nameRu: "Лисичка",
      nameKz: "Түлкі",
      descriptionRu: "Костюм лисы — рыжий, с хвостом и ушками.",
      descriptionKz: "Түлкі костюмі — құйрығы мен құлақшаларымен.",
      costumeTypeId: type.animal,
      sizeLabel: "104-110",
      ageGroup: "kindergarten",
      pricePerRent: 3500,
      deposit: 7000,
      city: "Алматы",
      occasionSlugs: ["any", "newyear", "autumn"],
    },
    {
      slug: "bear-116-122",
      nameRu: "Медвежонок",
      nameKz: "Аю бала",
      descriptionRu: "Тёплый костюм медведя, объёмный, для утренников.",
      descriptionKz: "Ертеңгілікке арналған аю костюмі.",
      costumeTypeId: type.animal,
      sizeLabel: "116-122",
      ageGroup: "primary_school",
      pricePerRent: 4000,
      deposit: 8000,
      city: "Алматы",
      occasionSlugs: ["any", "newyear", "autumn"],
    },
  ];

  for (const c of costumeData) {
    const { occasionSlugs, ...costumeFields } = c;
    const [inserted] = await db.insert(costumes).values(costumeFields).returning();
    for (const slug of occasionSlugs) {
      await db.insert(costumeOccasions).values({
        costumeId: inserted.id,
        occasionId: occ[slug],
      });
    }
  }

  console.log(`Готово: ${costumeData.length} костюмов, ${occasionData.length} поводов, ${typeData.length} типов.`);
}

seed()
  .then(() => process.exit(0))
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
