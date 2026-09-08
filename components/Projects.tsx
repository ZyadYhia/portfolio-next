import type { Project } from "@/lib/queries";
import ProjectCard from "./ProjectCard";

export default function Projects({ items }: { items: Project[] }) {
  if (items.length === 0) return null;

  return (
    <section id="projects" className="mx-auto w-full lg:w-[70%] px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
        Projects
      </h2>
      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        {items.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
    </section>
  );
}
