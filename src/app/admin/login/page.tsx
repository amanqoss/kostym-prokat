import { loginAction } from "../actions";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-sm flex-col justify-center px-4 py-12">
      <h1 className="font-display text-xl font-semibold text-primary-dark">Вход в админ-панель</h1>
      <p className="mt-1 text-sm text-foreground/60">Только для сотрудников Prokat_kids</p>

      <form action={loginAction} className="mt-6 flex flex-col gap-3">
        <input type="hidden" name="next" value={params.next || "/admin"} />
        <input
          type="password"
          name="password"
          required
          autoFocus
          placeholder="Пароль"
          className="w-full rounded-lg border border-border px-3 py-2.5 text-sm"
        />
        {params.error && (
          <p className="text-sm text-newyear">Неверный пароль. Попробуйте снова.</p>
        )}
        <button
          type="submit"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-dark"
        >
          Войти
        </button>
      </form>
    </div>
  );
}
