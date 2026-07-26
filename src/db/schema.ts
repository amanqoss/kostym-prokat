import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { relations, sql } from "drizzle-orm";

/**
 * КАТЕГОРИИ / ПОВОДЫ (пересекающиеся признаки для фильтров каталога)
 * Один костюм может относиться к нескольким "occasion" (например,
 * костюм зайца подходит и на Новый год, и на день рождения).
 */

// Повод / событие: Наурыз, Новый год, Осенний бал, 9 Мая, Утренник/ДР (вне сезона)
export const occasions = sqliteTable("occasions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(), // "nauryz", "newyear", "autumn", "victoryday", "any"
  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
  // месяц пика сезона (1-12) — используется, чтобы поднимать лендинг в навигации за 3-4 недели
  peakMonth: integer("peak_month"),
});

// Тип костюма: национальный, персонаж, животное, военная форма и т.д.
export const costumeTypes = sqliteTable("costume_types", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(), // "national", "character", "animal", "military"
  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
});

/**
 * ОСНОВНАЯ ТАБЛИЦА КОСТЮМОВ
 */
export const costumes = sqliteTable("costumes", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  slug: text("slug").notNull().unique(),

  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
  descriptionRu: text("description_ru"),
  descriptionKz: text("description_kz"),

  costumeTypeId: integer("costume_type_id").references(() => costumeTypes.id),

  // Размер по росту, например "98-104"
  sizeLabel: text("size_label").notNull(),
  // Возрастная группа: "kindergarten" | "primary_school" | "both"
  ageGroup: text("age_group").notNull(),

  // Цена аренды за один прокат (сутки/на мероприятие)
  pricePerRent: real("price_per_rent").notNull(),
  // Размер залога
  deposit: real("deposit").notNull().default(0),

  // Общий статус экземпляра (не путать с занятостью по датам!):
  // "active" - в обороте, "cleaning" - в химчистке, "repair" - в ремонте, "archived" - списан
  status: text("status").notNull().default("active"),

  // Город / точка выдачи
  city: text("city").notNull().default("Алматы"),

  // Главное фото
  mainImageUrl: text("main_image_url"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

// Связь многие-ко-многим: костюм <-> повод
export const costumeOccasions = sqliteTable("costume_occasions", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),
  occasionId: integer("occasion_id").notNull().references(() => occasions.id),
});

// Доп. фотографии костюма
export const costumeImages = sqliteTable("costume_images", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0),
});

/**
 * БРОНИРОВАНИЯ — ядро бизнес-логики проката.
 * Именно эта таблица определяет, свободен ли костюм на конкретные даты,
 * а НЕ поле "status" в костюме (костюм арендуется многократно).
 */
export const bookings = sqliteTable("bookings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),

  // Даты, на которые костюм занят (дата мероприятия -> дата возврата)
  dateFrom: text("date_from").notNull(), // ISO "2026-03-19"
  dateTo: text("date_to").notNull(),

  // Контакты клиента
  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  childName: text("child_name"),
  city: text("city"),

  // Статус брони: "new" (только оформлена, ждёт подтверждения в WhatsApp),
  // "confirmed" (менеджер подтвердил), "completed" (костюм возвращён), "cancelled"
  bookingStatus: text("booking_status").notNull().default("new"),

  notes: text("notes"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

/**
 * СВЯЗИ (для удобных JOIN-запросов через Drizzle)
 */
export const costumesRelations = relations(costumes, ({ one, many }) => ({
  type: one(costumeTypes, {
    fields: [costumes.costumeTypeId],
    references: [costumeTypes.id],
  }),
  images: many(costumeImages),
  occasionLinks: many(costumeOccasions),
  bookings: many(bookings),
}));

export const costumeOccasionsRelations = relations(costumeOccasions, ({ one }) => ({
  costume: one(costumes, {
    fields: [costumeOccasions.costumeId],
    references: [costumes.id],
  }),
  occasion: one(occasions, {
    fields: [costumeOccasions.occasionId],
    references: [occasions.id],
  }),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  costume: one(costumes, {
    fields: [bookings.costumeId],
    references: [costumes.id],
  }),
}));

/**
 * ОТЗЫВЫ — с фото/видео от родителей.
 * Модерация: новый отзыв всегда попадает со статусом "pending" и
 * появляется на сайте только после того как статус сменят на "approved"
 * (через админ-панель — следующий этап).
 */
export const reviews = sqliteTable("reviews", {
  id: integer("id").primaryKey({ autoIncrement: true }),

  authorName: text("author_name").notNull(),
  ratingValue: integer("rating_value").notNull().default(5), // 1-5

  textRu: text("text_ru"),
  textKz: text("text_kz"),

  // Путь к фото (например /uploads/reviews/xxx.jpg) — можно несколько через запятую,
  // либо ссылка на внешнее видео (YouTube/Instagram Reels)
  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),

  occasionId: integer("occasion_id").references(() => occasions.id),
  costumeId: integer("costume_id").references(() => costumes.id),

  // "pending" | "approved" | "rejected"
  status: text("status").notNull().default("pending"),

  createdAt: text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
});

export const reviewsRelations = relations(reviews, ({ one }) => ({
  occasion: one(occasions, {
    fields: [reviews.occasionId],
    references: [occasions.id],
  }),
  costume: one(costumes, {
    fields: [reviews.costumeId],
    references: [costumes.id],
  }),
}));
