// import { defineConfig } from "drizzle-kit";

// export default defineConfig({
//   out: "./drizzle",
//   schema: "./src/db/schema.ts",
//   dialect: "sqlite",
//   dbCredentials: {
//     url: process.env.DB_FILE_NAME || "sqlite.db",
//   },
// });

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

import { defineConfig } from 'drizzle-kit';

export default defineConfig({
  schema: './src/db/schema.ts', // путь к вашим схемам (таблицам)
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
