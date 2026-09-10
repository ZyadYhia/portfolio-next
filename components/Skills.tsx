import type { Skill } from "@/lib/queries";

export default function Skills({
  skillsByCategory,
}: {
  readonly skillsByCategory: Record<string, Skill[]>;
}) {
  const categories = Object.keys(skillsByCategory);
  if (categories.length === 0) return null;

  return (
    <section id="skills" className="mx-auto w-full lg:w-[70%] px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
        Skills
      </h2>
      <div className="mt-8 grid gap-8 sm:grid-cols-2">
        {categories.map((category) => (
          <div key={category}>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-(--color-teal)">
              {category}
            </h3>
            <div className="flex flex-wrap gap-2">
              {skillsByCategory[category].map((skill) => (
                <span
                  key={skill.id}
                  className="rounded-full border border-(--color-border) bg-(--color-surface) px-3 py-1 text-sm text-foreground"
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
