import { cookies } from "next/headers";


export const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || "prokatkids2026";

const SALT = "prokat-kids-admin-salt-v1";
export const ADMIN_COOKIE_NAME = "admin_session";


export function makeSessionToken(password: string) {
  return btoa(unescape(encodeURIComponent(password + SALT)));
}

export const VALID_SESSION_TOKEN = makeSessionToken(ADMIN_PASSWORD);

export async function isAdminAuthed(): Promise<boolean> {
  const store = await cookies();
  const token = store.get(ADMIN_COOKIE_NAME)?.value;
  return token === VALID_SESSION_TOKEN;
}
