import type { Project } from "@/lib/queries";

function CardBody({ project }: { project: Project }) {
  return (
    <>
      <div className="flex items-start justify-between gap-3">
        <h3 className="font-display text-lg font-bold text-[var(--color-fg)] group-hover:text-[var(--color-teal)]">
          {project.title}
        </h3>
        {project.featured ? (
          <span className="shrink-0 rounded-full bg-[var(--color-amber)]/15 px-2 py-0.5 text-[10px] uppercase tracking-wide text-[var(--color-amber)]">
            Featured
          </span>
        ) : null}
      </div>
      {project.subtitle ? (
        <p className="mt-1 text-sm text-[var(--color-muted)]">{project.subtitle}</p>
      ) : null}
      {project.bullets.length > 0 ? (
        <ul className="mt-4 space-y-1.5 text-sm leading-relaxed text-[var(--color-muted)]">
          {project.bullets.map((bullet, i) => (
            <li key={i} className="flex gap-2">
              <span className="text-[var(--color-amber)]">–</span>
              <span>{bullet}</span>
            </li>
          ))}
        </ul>
      ) : null}
      {project.tech_tags.length > 0 ? (
        <div className="mt-4 flex flex-wrap gap-2">
          {project.tech_tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-[var(--color-surface-2)] px-2.5 py-0.5 text-xs text-[var(--color-teal)]"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </>
  );
}

const CARD_CLASSES =
  "group flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6 transition hover:border-[var(--color-teal)]/50";

export default function ProjectCard({ project }: { project: Project }) {
  if (project.link_url) {
    return (
      <a
        href={project.link_url}
        target="_blank"
        rel="noopener noreferrer"
        className={CARD_CLASSES}
      >
        <CardBody project={project} />
      </a>
    );
  }

  return (
    <div className={CARD_CLASSES}>
      <CardBody project={project} />
    </div>
  );
}
