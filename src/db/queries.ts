import { and, desc, eq, inArray } from "drizzle-orm";
import { db } from "./index";
import { costumes, costumeOccasions, occasions, costumeTypes, reviews } from "./schema";

export type CatalogFilters = {
  occasion?: string;
  type?: string;
  age?: string;
};

export async function getCatalog(filters: CatalogFilters) {
  const conditions = [eq(costumes.status, "active")];

  if (filters.occasion) {
    const [occ] = await db.select().from(occasions).where(eq(occasions.slug, filters.occasion));
    if (!occ) return [];
    const links = await db
      .select({ id: costumeOccasions.costumeId })
      .from(costumeOccasions)
      .where(eq(costumeOccasions.occasionId, occ.id));
    const ids = links.map((l) => l.id);
    if (ids.length === 0) return [];
    conditions.push(inArray(costumes.id, ids));
  }

  if (filters.type) {
    const [typ] = await db.select().from(costumeTypes).where(eq(costumeTypes.slug, filters.type));
    if (!typ) return [];
    conditions.push(eq(costumes.costumeTypeId, typ.id));
  }

  if (filters.age) {
    conditions.push(eq(costumes.ageGroup, filters.age));
  }

  const results = await db
    .select()
    .from(costumes)
    .where(and(...conditions));

  return results;
}

export async function getAllOccasions() {
  return db.select().from(occasions);
}

export async function getAllTypes() {
  return db.select().from(costumeTypes);
}

export async function getCostumeBySlug(slug: string) {
  const [costume] = await db.select().from(costumes).where(eq(costumes.slug, slug));
  return costume ?? null;
}

export async function getApprovedReviews(limit?: number) {
  const query = db
    .select()
    .from(reviews)
    .where(eq(reviews.status, "approved"))
    .orderBy(desc(reviews.createdAt));
  const results = limit ? await query.limit(limit) : await query;
  return results;
}

export async function getCostumeOccasionIds(costumeId: number) {
  const rows = await db
    .select({ occasionId: costumeOccasions.occasionId })
    .from(costumeOccasions)
    .where(eq(costumeOccasions.costumeId, costumeId));
  return rows.map((r) => r.occasionId);
}
