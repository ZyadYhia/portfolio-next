import type { Experience as ExperienceType } from "@/lib/queries";

type ExperienceProps = { readonly items: ExperienceType[] };

export default function Experience(props: ExperienceProps) {
  const { items } = props;
  if (items.length === 0) return null;

  return (
    <section id="experience" className="mx-auto w-full lg:w-[70%] px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        Experience
      </h2>
      <ol className="mt-8 space-y-10 border-l border-(--color-border) pl-6">
        {items.map((item) => (
          <li key={item.id} className="relative">
            <span className="absolute -left-7.25 top-1.5 h-2.5 w-2.5 rounded-full bg-(--color-amber)" />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <h3 className="font-display text-lg font-bold text-foreground">
                {item.role} · {item.company}
              </h3>
              <span className="font-mono text-xs text-(--color-muted)">
                {item.start_date} — {item.end_date || "Present"}
              </span>
            </div>
            {item.tech_tags.length > 0 ? (
              <div className="mt-2 flex flex-wrap gap-2">
                {item.tech_tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-(--color-surface-2) px-2.5 py-0.5 text-xs text-(--color-teal)"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : null}
            {item.bullets.length > 0 ? (
              <ul className="mt-3 space-y-1.5 text-sm leading-relaxed text-(--color-muted)">
                {item.bullets.map((bullet) => (
                  <li key={bullet} className="flex gap-2">
                    <span className="text-(--color-amber)">–</span>
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
