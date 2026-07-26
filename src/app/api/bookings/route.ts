import { NextRequest, NextResponse } from "next/server";
import { and, eq, ne } from "drizzle-orm";
import { db } from "@/db";
import { bookings, costumes } from "@/db/schema";

// GET /api/bookings?costumeId=1 -> список занятых периодов (для отображения в форме брони)
export async function GET(request: NextRequest) {
  const costumeId = Number(request.nextUrl.searchParams.get("costumeId"));
  if (!costumeId) {
    return NextResponse.json({ error: "costumeId is required" }, { status: 400 });
  }

  const rows = await db
    .select({ dateFrom: bookings.dateFrom, dateTo: bookings.dateTo })
    .from(bookings)
    .where(and(eq(bookings.costumeId, costumeId), ne(bookings.bookingStatus, "cancelled")));

  return NextResponse.json({ busyRanges: rows });
}

// POST /api/bookings -> создать новую бронь (статус "new", ждёт подтверждения менеджером в WhatsApp)
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { costumeId, dateFrom, dateTo, parentName, phone, childName, city, notes } = body;

  if (!costumeId || !dateFrom || !dateTo || !parentName || !phone) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const [costume] = await db.select().from(costumes).where(eq(costumes.id, Number(costumeId)));
  if (!costume) {
    return NextResponse.json({ error: "Costume not found" }, { status: 404 });
  }

  // Проверка пересечения дат с уже существующими подтверждёнными/новыми бронями
  const existing = await db
    .select()
    .from(bookings)
    .where(and(eq(bookings.costumeId, Number(costumeId)), ne(bookings.bookingStatus, "cancelled")));

  const overlaps = existing.some(
    (b) => dateFrom <= b.dateTo && dateTo >= b.dateFrom
  );
  if (overlaps) {
    return NextResponse.json(
      { error: "Костюм уже забронирован на выбранные даты" },
      { status: 409 }
    );
  }

  const [inserted] = await db
    .insert(bookings)
    .values({
      costumeId: Number(costumeId),
      dateFrom,
      dateTo,
      parentName,
      phone,
      childName: childName || null,
      city: city || costume.city,
      notes: notes || null,
      bookingStatus: "new",
    })
    .returning();

  return NextResponse.json({ booking: inserted, costume });
}
