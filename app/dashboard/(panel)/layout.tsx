import Link from "next/link";
import { logout } from "../actions";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/experience", label: "Experience" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/education", label: "Education & Certs" },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[var(--color-bg)] text-[var(--color-fg)]">
      <div className="mx-auto flex max-w-6xl">
        <aside className="hidden w-56 shrink-0 border-r border-[var(--color-border)] p-6 sm:block">
          <p className="font-display mb-6 text-sm font-bold">Dashboard</p>
          <nav className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="block rounded-md px-3 py-2 text-sm text-[var(--color-muted)] transition hover:bg-[var(--color-surface)] hover:text-[var(--color-fg)]"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form action={logout} className="mt-8">
            <button
              type="submit"
              className="w-full rounded-md border border-[var(--color-border)] px-3 py-2 text-left text-sm text-[var(--color-muted)] transition hover:border-red-400/50 hover:text-red-400"
            >
              Sign out
            </button>
          </form>
          <Link
            href="/"
            target="_blank"
            className="mt-4 block text-xs text-[var(--color-muted)] underline underline-offset-4"
          >
            View live site ↗
          </Link>
        </aside>
        <main className="min-w-0 flex-1 p-6 sm:p-10">{children}</main>
      </div>
    </div>
  );
}
