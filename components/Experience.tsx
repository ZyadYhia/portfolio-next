import type { Experience as ExperienceType } from "@/lib/queries";

export default function Experience({ items }: { items: ExperienceType[] }) {
  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
        Experience
      </h2>
      <ol className="mt-8 space-y-10 border-l border-[var(--color-border)] pl-6">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-[29px] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--color-amber)]" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-lg font-bold text-[var(--color-fg)]">
                {item.role} · {item.company}
              </h3>
              <span className="font-mono text-xs text-[var(--color-muted)]">
                {item.start_date} — {item.end_date || "Present"}
              </span>
            </div>
            {item.tech_tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tech_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 text-xs text-[var(--color-teal)]"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {item.bullets.length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
                {item.bullets.map((bullet, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-[var(--color-amber)]">–</span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            ) : null}
          </li>
        ))}
      </ol>
    </section>
  );
}
