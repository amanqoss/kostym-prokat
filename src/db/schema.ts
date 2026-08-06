import { pgTable, text, integer, doublePrecision, serial, timestamp } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

/**
 * КАТЕГОРИИ / ПОВОДЫ (пересекающиеся признаки для фильтров каталога)
 */
export const occasions = pgTable("occasions", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
  peakMonth: integer("peak_month"),
});

// Тип костюма: национальный, персонаж, животное, военная форма и т.д.
export const costumeTypes = pgTable("costume_types", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),
  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
});

/**
 * ОСНОВНАЯ ТАБЛИЦА КОСТЮМОВ
 */
export const costumes = pgTable("costumes", {
  id: serial("id").primaryKey(),
  slug: text("slug").notNull().unique(),

  nameRu: text("name_ru").notNull(),
  nameKz: text("name_kz").notNull(),
  descriptionRu: text("description_ru"),
  descriptionKz: text("description_kz"),

  costumeTypeId: integer("costume_type_id").references(() => costumeTypes.id),

  sizeLabel: text("size_label").notNull(),
  ageGroup: text("age_group").notNull(),

  pricePerRent: doublePrecision("price_per_rent").notNull(),
  deposit: doublePrecision("deposit").notNull().default(0),

  status: text("status").notNull().default("active"),
  city: text("city").notNull().default("Алматы"),
  mainImageUrl: text("main_image_url"),

  createdAt: timestamp("created_at").defaultNow(),
});

// Связь многие-ко-многим: костюм <-> повод
export const costumeOccasions = pgTable("costume_occasions", {
  id: serial("id").primaryKey(),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),
  occasionId: integer("occasion_id").notNull().references(() => occasions.id),
});

// Доп. фотографии костюма
export const costumeImages = pgTable("costume_images", {
  id: serial("id").primaryKey(),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),
  url: text("url").notNull(),
  sortOrder: integer("sort_order").default(0),
});

/**
 * БРОНИРОВАНИЯ — ядро бизнес-логики проката.
 */
export const bookings = pgTable("bookings", {
  id: serial("id").primaryKey(),
  costumeId: integer("costume_id").notNull().references(() => costumes.id),

  dateFrom: text("date_from").notNull(),
  dateTo: text("date_to").notNull(),

  parentName: text("parent_name").notNull(),
  phone: text("phone").notNull(),
  childName: text("child_name"),
  city: text("city"),

  bookingStatus: text("booking_status").notNull().default("new"),
  notes: text("notes"),

  createdAt: timestamp("created_at").defaultNow(),
});

/**
 * СВЯЗИ (для JOIN-запросов через Drizzle)
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
 */
export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),

  authorName: text("author_name").notNull(),
  ratingValue: integer("rating_value").notNull().default(5),

  textRu: text("text_ru"),
  textKz: text("text_kz"),

  photoUrl: text("photo_url"),
  videoUrl: text("video_url"),

  occasionId: integer("occasion_id").references(() => occasions.id),
  costumeId: integer("costume_id").references(() => costumes.id),

  status: text("status").notNull().default("pending"),

  createdAt: timestamp("created_at").defaultNow(),
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