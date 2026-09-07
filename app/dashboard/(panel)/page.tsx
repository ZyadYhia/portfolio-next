import Link from "next/link";
import {
  getExperience,
  getProjects,
  getSkills,
  getEducation,
  getCertifications,
} from "@/lib/queries";

export const dynamic = "force-dynamic";

export default function DashboardOverview() {
  const stats = [
    { label: "Experience entries", value: getExperience().length, href: "/dashboard/experience" },
    { label: "Projects", value: getProjects().length, href: "/dashboard/projects" },
    { label: "Skills", value: getSkills().length, href: "/dashboard/skills" },
    { label: "Education entries", value: getEducation().length, href: "/dashboard/education" },
    { label: "Certifications", value: getCertifications().length, href: "/dashboard/education" },
  ];

  return (
    <div>
      <h1 className="font-display text-2xl font-bold">Overview</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        Everything here is stored in the local SQLite database and reflected on
        the live site immediately after you save.
      </p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 transition hover:border-[var(--color-teal)]/50"
          >
            <p className="text-3xl font-bold text-[var(--color-fg)]">{stat.value}</p>
            <p className="mt-1 text-sm text-[var(--color-muted)]">{stat.label}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
