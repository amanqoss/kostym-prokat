// import { drizzle } from "drizzle-orm/better-sqlite3";
// import Database from "better-sqlite3";
// import * as schema from "./schema";

// const sqlite = new Database(process.env.DB_FILE_NAME || "sqlite.db");
// sqlite.pragma("journal_mode = WAL");

// export const db = drizzle(sqlite, { schema });


import { neon } from '@neondatabase/serverless';
import { drizzle } from 'drizzle-orm/neon-http';
import * as schema from './schema'; // путь к файлу со схемами

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
