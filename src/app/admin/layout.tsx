import Link from "next/link";
import { logoutAction } from "./actions";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-[80vh] bg-[#f4f1ea]">
      <div className="border-b border-border bg-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
          <div className="flex items-center gap-6">
            <span className="font-display text-base font-semibold text-primary-dark">
              Админ-панель · Prokat_kids
            </span>
            <nav className="flex gap-4 text-sm font-medium text-foreground/70">
              <Link href="/admin" className="hover:text-primary">Обзор</Link>
              <Link href="/admin/costumes" className="hover:text-primary">Костюмы</Link>
              <Link href="/admin/bookings" className="hover:text-primary">Брони</Link>
              <Link href="/admin/reviews" className="hover:text-primary">Отзывы</Link>
            </nav>
          </div>
          <form action={logoutAction}>
            <button className="text-sm text-foreground/50 hover:text-newyear">Выйти</button>
          </form>
        </div>
      </div>
      <div className="mx-auto max-w-6xl px-4 py-8">{children}</div>
    </div>
  );
}
