import { NextRequest, NextResponse } from "next/server";
import { writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { reviews } from "@/db/schema";
import { getApprovedReviews } from "@/db/queries";

export async function GET() {
  const list = await getApprovedReviews();
  return NextResponse.json({ reviews: list });
}

// POST принимает multipart/form-data: authorName, ratingValue, text, lang, photo (файл, необязательно)
export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const authorName = String(formData.get("authorName") || "").trim();
  const text = String(formData.get("text") || "").trim();
  const ratingValue = Number(formData.get("ratingValue") || 5);
  const lang = String(formData.get("lang") || "ru");
  const photo = formData.get("photo") as File | null;

  if (!authorName || !text) {
    return NextResponse.json({ error: "Заполните имя и текст отзыва" }, { status: 400 });
  }

  let photoUrl: string | null = null;

  if (photo && photo.size > 0) {
    // Ограничение размера файла — 8 МБ
    if (photo.size > 8 * 1024 * 1024) {
      return NextResponse.json({ error: "Файл слишком большой (макс. 8 МБ)" }, { status: 400 });
    }
    const allowedTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!allowedTypes.includes(photo.type)) {
      return NextResponse.json({ error: "Разрешены только JPG, PNG, WEBP" }, { status: 400 });
    }

    const bytes = await photo.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const ext = photo.type === "image/png" ? "png" : photo.type === "image/webp" ? "webp" : "jpg";
    const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}.${ext}`;
    const uploadDir = path.join(process.cwd(), "public", "uploads", "reviews");
    await writeFile(path.join(uploadDir, filename), buffer);
    photoUrl = `/uploads/reviews/${filename}`;
  }

  const [inserted] = await db
    .insert(reviews)
    .values({
      authorName,
      ratingValue: Math.min(5, Math.max(1, ratingValue)),
      textRu: lang === "kz" ? null : text,
      textKz: lang === "kz" ? text : null,
      photoUrl,
      status: "pending", // ждёт модерации перед публикацией
    })
    .returning();

  return NextResponse.json({ review: inserted });
}
