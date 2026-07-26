"use client";

import { useState } from "react";
import type { Lang } from "@/lib/i18n";
import { t } from "@/lib/i18n";

export default function ReviewForm({ lang }: { lang: Lang }) {
  const [authorName, setAuthorName] = useState("");
  const [rating, setRating] = useState(5);
  const [text, setText] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      const formData = new FormData();
      formData.set("authorName", authorName);
      formData.set("ratingValue", String(rating));
      formData.set("text", text);
      formData.set("lang", lang);
      if (photo) formData.set("photo", photo);

      const res = await fetch("/api/reviews", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Не удалось отправить отзыв");
        setSubmitting(false);
        return;
      }

      setSuccess(true);
    } catch {
      setError("Ошибка сети. Попробуйте ещё раз.");
    } finally {
      setSubmitting(false);
    }
  }

  if (success) {
    return (
      <p className="rounded-xl bg-nauryz/10 p-4 text-sm font-medium text-nauryz">
        {t(lang, "reviewsSuccess")}
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3 rounded-2xl border border-border bg-white p-6">
      <h2 className="font-display text-lg font-semibold text-primary-dark">{t(lang, "reviewsLeaveTitle")}</h2>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-foreground/60">{t(lang, "reviewsAuthorName")}</span>
        <input
          required
          value={authorName}
          onChange={(e) => setAuthorName(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-foreground/60">{t(lang, "reviewsRating")}</span>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        >
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>
              {"★".repeat(n)}
              {"☆".repeat(5 - n)}
            </option>
          ))}
        </select>
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-foreground/60">{t(lang, "reviewsText")}</span>
        <textarea
          required
          rows={4}
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full rounded-lg border border-border px-3 py-2 text-sm"
        />
      </label>

      <label className="block">
        <span className="mb-1 block text-xs font-medium text-foreground/60">{t(lang, "reviewsPhoto")}</span>
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={(e) => setPhoto(e.target.files?.[0] || null)}
          className="w-full text-sm"
        />
      </label>

      {error && <p className="text-sm text-newyear">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary-dark disabled:opacity-60"
      >
        {t(lang, "reviewsSubmit")}
      </button>
    </form>
  );
}
