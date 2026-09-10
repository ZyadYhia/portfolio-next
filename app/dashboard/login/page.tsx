"use client";

import { useActionState } from "react";
import { login } from "../actions";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-6">
      <form
        action={formAction}
        className="w-full max-w-sm space-y-5 rounded-lg border border-white/10 bg-(--color-surface) p-8"
      >
        <div>
          <h1 className="font-[family-name:var(--font-syne)] text-xl font-semibold text-foreground">
            Dashboard
          </h1>
          <p className="mt-1 text-sm text-(--color-muted)">
            Sign in to edit your portfolio content.
          </p>
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-xs uppercase tracking-wide text-(--color-muted)">
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoFocus
            className="w-full rounded-md border border-white/10 bg-black/30 px-3 py-2 text-foreground outline-none focus:border-(--color-amber)"
          />
        </div>

        {state?.error ? (
          <p className="text-sm text-red-400">{state.error}</p>
        ) : null}

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-md bg-(--color-amber) px-4 py-2 font-medium text-black transition hover:opacity-90 disabled:opacity-50"
        >
          {pending ? "Signing in…" : "Sign in"}
        </button>
      </form>
    </div>
  );
}
