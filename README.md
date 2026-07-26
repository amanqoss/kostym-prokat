# ПрокатКостюм.kz — children's costume rental website (Prokat_kids)

## The brief description

A full-stack rental platform for children's costumes in Atyrau, Kazakhstan, built for parents of kindergarten and primary school kids. Customers browse a bilingual (Russian/Kazakh) catalog filtered by occasion (Nauryz, New Year, Autumn Ball, Victory Day) or costume type, check real-time date availability, and book directly through WhatsApp — no accounts or online payment required. Includes a password-protected admin panel for managing inventory, bookings, and customer review moderation, with no user registration system needed.

## What's inside
- **Next.js** (React + TypeScript) — website, API and admin panel in one project
- **SQLite + Drizzle ORM** — database (suits, armor, reviews, categories)
- **Tailwind CSS** — styles
- Bilingual RU/ KZ interface (switch in the header of the site)
- Catalog with filters (occasion/ type/ age)
- Booking with check of busy dates + automatic opening of WhatsApp with a ready message
- A block of reviews with photos on the main page + a feedback page with a form (moderation is required)
- Admin panel (`/admin`) — management of costumes, armor, moderation of reviews

## How to run locally

1. Installation:
   ```bash
   npm install
   ```

2. Create a database and tables:
   ```bash
   npx drizzle-kit push
   ```

3. Fill the database with test data:
   ```bash
   npx tsx src/db/seed.ts          
   npx tsx src/db/seed-reviews.ts  
   ```

4. Run it:
   ```bash
   npm run dev
   ```
   Откройте http://localhost:3000



## The structure of project
```
src/
  app/
    page.tsx          — main page (hero, holidays, reviews, trust block)
    catalog/           — catalog with filters
    costume/[slug]/    — costume card + booking
    reviews/           — feedback page + form
    admin/             — admin panel (login, costumes, armor, reviews)
    api/bookings/       — API booking
    api/reviews/        — API reviews (with photo upload)
  components/         — header, footer, cards, forms
  db/                 — database schema, queries, scripts for filling with test data
  lib/                — transfers (i18n), company configuration, admin panel authorization
  proxy.ts            — protection /admin (former middleware.ts)
```

