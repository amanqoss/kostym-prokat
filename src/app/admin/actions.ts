"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { eq } from "drizzle-orm";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { costumes, costumeOccasions, bookings, reviews } from "@/db/schema";
import { ADMIN_PASSWORD, ADMIN_COOKIE_NAME, makeSessionToken, isAdminAuthed } from "@/lib/adminAuth";

// ---------- AUTH ----------

export async function loginAction(formData: FormData) {
  const password = String(formData.get("password") || "");
  const next = String(formData.get("next") || "/admin");

  if (password !== ADMIN_PASSWORD) {
    redirect(`/admin/login?error=1&next=${encodeURIComponent(next)}`);
  }

  const store = await cookies();
  store.set(ADMIN_COOKIE_NAME, makeSessionToken(password), {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 14, // 14 дней
    sameSite: "lax",
  });

  redirect(next || "/admin");
}

export async function logoutAction() {
  const store = await cookies();
  store.delete(ADMIN_COOKIE_NAME);
  redirect("/admin/login");
}

async function guard() {
  if (!(await isAdminAuthed())) {
    redirect("/admin/login");
  }
}

// ---------- COSTUMES ----------

export async function createCostumeAction(formData: FormData) {
  await guard();

  const slug = String(formData.get("slug") || "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9-]+/g, "-");

  const photo = formData.get("photo") as File | null;
  let mainImageUrl: string | null = null;
  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    await writeFile(path.join(process.cwd(), "public", "uploads", "costumes", filename), buffer);
    mainImageUrl = `/uploads/costumes/${filename}`;
  }

  const [inserted] = await db
    .insert(costumes)
    .values({
      slug,
      nameRu: String(formData.get("nameRu") || ""),
      nameKz: String(formData.get("nameKz") || ""),
      descriptionRu: String(formData.get("descriptionRu") || "") || null,
      descriptionKz: String(formData.get("descriptionKz") || "") || null,
      costumeTypeId: Number(formData.get("costumeTypeId")) || null,
      sizeLabel: String(formData.get("sizeLabel") || ""),
      ageGroup: String(formData.get("ageGroup") || "kindergarten"),
      pricePerRent: Number(formData.get("pricePerRent") || 0),
      deposit: Number(formData.get("deposit") || 0),
      city: String(formData.get("city") || "Алматы"),
      status: "active",
      mainImageUrl,
    })
    .returning();

  const occasionIds = formData.getAll("occasionIds").map(Number);
  for (const occId of occasionIds) {
    await db.insert(costumeOccasions).values({ costumeId: inserted.id, occasionId: occId });
  }

  revalidatePath("/admin/costumes");
  revalidatePath("/catalog");
  redirect("/admin/costumes");
}

export async function updateCostumeAction(costumeId: number, formData: FormData) {
  await guard();

  const photo = formData.get("photo") as File | null;
  let mainImageUrl: string | undefined = undefined;

  if (photo && photo.size > 0) {
    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    await writeFile(path.join(process.cwd(), "public", "uploads", "costumes", filename), buffer);
    mainImageUrl = `/uploads/costumes/${filename}`;
  }

  await db
    .update(costumes)
    .set({
      nameRu: String(formData.get("nameRu") || ""),
      nameKz: String(formData.get("nameKz") || ""),
      descriptionRu: String(formData.get("descriptionRu") || "") || null,
      descriptionKz: String(formData.get("descriptionKz") || "") || null,
      costumeTypeId: Number(formData.get("costumeTypeId")) || null,
      sizeLabel: String(formData.get("sizeLabel") || ""),
      ageGroup: String(formData.get("ageGroup") || "kindergarten"),
      pricePerRent: Number(formData.get("pricePerRent") || 0),
      deposit: Number(formData.get("deposit") || 0),
      city: String(formData.get("city") || "Алматы"),
      ...(mainImageUrl ? { mainImageUrl } : {}),
    })
    .where(eq(costumes.id, costumeId));

  // Пересобираем связи с поводами/праздниками заново
  await db.delete(costumeOccasions).where(eq(costumeOccasions.costumeId, costumeId));
  const occasionIds = formData.getAll("occasionIds").map(Number);
  for (const occId of occasionIds) {
    await db.insert(costumeOccasions).values({ costumeId, occasionId: occId });
  }

  revalidatePath("/admin/costumes");
  revalidatePath(`/admin/costumes/${costumeId}`);
  revalidatePath("/catalog");
  redirect("/admin/costumes");
}

export async function updateCostumeStatusAction(costumeId: number, status: string) {
  await guard();
  await db.update(costumes).set({ status }).where(eq(costumes.id, costumeId));
  revalidatePath("/admin/costumes");
  revalidatePath("/catalog");
}

export async function deleteCostumeAction(costumeId: number) {
  await guard();
  await db.delete(costumeOccasions).where(eq(costumeOccasions.costumeId, costumeId));
  await db.delete(bookings).where(eq(bookings.costumeId, costumeId));
  await db.delete(costumes).where(eq(costumes.id, costumeId));
  revalidatePath("/admin/costumes");
  revalidatePath("/catalog");
}

// ---------- BOOKINGS ----------

export async function updateBookingStatusAction(bookingId: number, status: string) {
  await guard();
  await db.update(bookings).set({ bookingStatus: status }).where(eq(bookings.id, bookingId));
  revalidatePath("/admin/bookings");
}

// ---------- REVIEWS ----------

export async function updateReviewStatusAction(reviewId: number, status: string) {
  await guard();
  await db.update(reviews).set({ status }).where(eq(reviews.id, reviewId));
  revalidatePath("/admin/reviews");
  revalidatePath("/");
  revalidatePath("/reviews");
}
