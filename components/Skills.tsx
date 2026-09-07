import type { Skill } from "@/lib/queries";

export default function Skills({
  skillsByCategory,
}: {
  skillsByCategory: Record<string, Skill[]>;
}) {
  const categories = Object.keys(skillsByCategory);
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
        Skills
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-teal)]">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category].map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-1 text-sm text-[var(--color-fg)]"
                >
                  {skill.name}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
