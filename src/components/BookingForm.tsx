"use client";

import { useEffect, useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

type Props = {
  lang: Lang;
  costumeId: number;
  costumeName: string;
  whatsappPhone: string;
};

type BusyRange = { dateFrom: string; dateTo: string };

export default function BookingForm({ lang, costumeId, costumeName, whatsappPhone }: Props) {
  const [busyRanges, setBusyRanges] = useState<BusyRange[]>([]);
  const [loadingAvailability, setLoadingAvailability] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    dateFrom: "",
    dateTo: "",
    parentName: "",
    phone: "",
    childName: "",
    city: "",
  });

  useEffect(() => {
    fetch(`/api/bookings?costumeId=${costumeId}`)
      .then((r) => r.json())
      .then((data) => setBusyRanges(data.busyRanges || []))
      .catch(() => setBusyRanges([]))
      .finally(() => setLoadingAvailability(false));
  }, [costumeId]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ costumeId, ...form }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Что-то пошло не так");
        setSubmitting(false);
        return;
      }

      setSuccess(true);

      const message =
        lang === "kz"
          ? `Сәлеметсіз бе! "${costumeName}" костюмін ${form.dateFrom} - ${form.dateTo} күндеріне брондадым. Атым: ${form.parentName}, телефон: ${form.phone}.`
          : `Здравствуйте! Забронировал(а) костюм "${costumeName}" на даты ${form.dateFrom} - ${form.dateTo}. Меня зовут ${form.parentName}, телефон: ${form.phone}.`;

      const waUrl = `https://wa.me/${whatsappPhone}?text=${encodeURIComponent(message)}`;
      window.open(waUrl, "_blank");
    } catch {
      setError("Не удалось отправить бронь. Проверьте соединение и попробуйте снова.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="rounded-2xl border border-border bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-primary-dark">{t(lang, "bookingTitle")}</h2>

      <div className="mt-3 text-sm">
        {loadingAvailability ? (
          <p className="text-foreground/50">{t(lang, "checkingAvailability")}</p>
        ) : busyRanges.length > 0 ? (
          <div className="rounded-lg bg-newyear/5 p-3 text-newyear">
            <p className="font-medium">{t(lang, "unavailableDates")}</p>
            <ul className="mt-1 list-inside list-disc">
              {busyRanges.map((r, i) => (
                <li key={i}>
                  {r.dateFrom} — {r.dateTo}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p className="text-nauryz">{t(lang, "freeToChoose")}</p>
        )}
      </div>

      {success ? (
        <p className="mt-5 rounded-lg bg-nauryz/10 p-4 text-sm font-medium text-nauryz">
          {t(lang, "bookingSuccess")}
        </p>
      ) : (
        <form onSubmit={handleSubmit} className="mt-5 flex flex-col gap-3">
          <div className="grid grid-cols-2 gap-3">
            <Field label={t(lang, "dateFrom")}>
              <input
                type="date"
                required
                value={form.dateFrom}
                onChange={(e) => setForm({ ...form, dateFrom: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </Field>
            <Field label={t(lang, "dateTo")}>
              <input
                type="date"
                required
                value={form.dateTo}
                onChange={(e) => setForm({ ...form, dateTo: e.target.value })}
                className="w-full rounded-lg border border-border px-3 py-2 text-sm"
              />
            </Field>
          </div>

          <Field label={t(lang, "parentName")}>
            <input
              type="text"
              required
              value={form.parentName}
              onChange={(e) => setForm({ ...form, parentName: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </Field>

          <Field label={t(lang, "phone")}>
            <input
              type="tel"
              required
              placeholder="+7 7__ ___ __ __"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </Field>

          <Field label={t(lang, "childName")}>
            <input
              type="text"
              value={form.childName}
              onChange={(e) => setForm({ ...form, childName: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </Field>

          <Field label={t(lang, "city")}>
            <input
              type="text"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full rounded-lg border border-border px-3 py-2 text-sm"
            />
          </Field>

          {error && <p className="text-sm text-newyear">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="mt-2 rounded-full bg-[#25D366] px-5 py-3 text-sm font-semibold text-white transition hover:brightness-95 disabled:opacity-60"
          >
            {t(lang, "submitBooking")}
          </button>
        </form>
      )}
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-medium text-foreground/60">{label}</span>
      {children}
    </label>
  );
}
