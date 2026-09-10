"use client";

import { useState } from "react";
import Link from "next/link";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/profile", label: "Profile" },
  { href: "/dashboard/experience", label: "Experience" },
  { href: "/dashboard/projects", label: "Projects" },
  { href: "/dashboard/skills", label: "Skills" },
  { href: "/dashboard/education", label: "Education & Certs" },
];

function NavLinks({
  logout,
  onNavigate,
}: {
  readonly logout: () => Promise<void>;
  readonly onNavigate?: () => void;
}) {
  return (
    <>
      <nav className="space-y-1">
        {NAV_ITEMS.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="block rounded-md px-3 py-2 text-sm text-(--color-muted) transition hover:bg-(--color-surface) hover:text-foreground"
          >
            {item.label}
          </Link>
        ))}
      </nav>
      <form action={logout} className="mt-8">
        <button
          type="submit"
          className="w-full rounded-md border border-(--color-border) px-3 py-2 text-left text-sm text-(--color-muted) transition hover:border-red-400/50 hover:text-red-400"
        >
          Sign out
        </button>
      </form>
      <Link
        href="/"
        target="_blank"
        className="mt-4 block text-xs text-(--color-muted) underline underline-offset-4"
      >
        View live site ↗
      </Link>
    </>
  );
}

export default function Sidebar({ logout }: { logout: () => Promise<void> }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Mobile top bar with menu toggle — only shown below the sm breakpoint */}
      <div className="flex items-center justify-between border-b border-(--color-border) p-4 sm:hidden">
        <span className="font-display text-sm font-bold">Dashboard</span>
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          className="rounded-md border border-(--color-border) p-2 text-foreground"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          >
            <line x1="3" y1="6" x2="21" y2="6" />
            <line x1="3" y1="12" x2="21" y2="12" />
            <line x1="3" y1="18" x2="21" y2="18" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open ? (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-64 max-w-[80%] overflow-y-auto border-r border-(--color-border) bg-background p-6">
            <div className="mb-6 flex items-center justify-between">
              <span className="font-display text-sm font-bold">Dashboard</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
                className="rounded-md border border-(--color-border) p-1.5 text-foreground"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="16"
                  height="16"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </svg>
              </button>
            </div>
            <NavLinks logout={logout} onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      {/* Desktop sidebar — unchanged, always visible at sm and above */}
      <aside className="hidden w-56 shrink-0 border-r border-(--color-border) p-6 sm:block">
        <p className="font-display mb-6 text-sm font-bold">Dashboard</p>
        <NavLinks logout={logout} />
      </aside>
    </>
  );
}
