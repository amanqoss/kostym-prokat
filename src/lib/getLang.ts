import { cookies } from "next/headers";
import type { Lang } from "./i18n";

export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get("lang")?.value;
  return value === "kz" ? "kz" : "ru";
}
