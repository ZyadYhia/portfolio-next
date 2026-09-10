import { getProjects } from "@/lib/queries";
import { upsertProject, deleteProject } from "../../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-(--color-border) bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-(--color-amber)";
const labelClass = "text-xs uppercase tracking-wide text-(--color-muted)";

export default async function ProjectsPage() {
  const items = await getProjects();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Projects</h1>
      <p className="mt-1 text-sm text-(--color-muted)">
        Bullets: one per line. Tags: comma-separated. Link is optional.
      </p>

      <div className="mt-8 space-y-6">
        {items.map((item) => (
          <form
            key={item.id}
            action={upsertProject}
            className="space-y-4 rounded-lg border border-(--color-border) bg-(--color-surface) p-5"
          >
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={labelClass}>Title</label>
                <input name="title" defaultValue={item.title} className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Subtitle</label>
                <input name="subtitle" defaultValue={item.subtitle} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Category</label>
                <input name="category" defaultValue={item.category} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Link URL</label>
                <input name="link_url" defaultValue={item.link_url} className={inputClass} />
              </div>
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Tags (comma-separated)</label>
              <input name="tech_tags" defaultValue={item.tech_tags.join(", ")} className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Bullets (one per line)</label>
              <textarea name="bullets" defaultValue={item.bullets.join("\n")} rows={4} className={inputClass} />
            </div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="space-y-1.5">
                  <label className={labelClass}>Sort order</label>
                  <input
                    name="sort_order"
                    type="number"
                    defaultValue={item.sort_order}
                    className={`${inputClass} w-24`}
                  />
                </div>
                <label className="flex items-center gap-2 text-sm text-foreground">
                  <input type="checkbox" name="featured" defaultChecked={item.featured} />
                  Featured
                </label>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-(--color-amber) px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteProject}
                  className="rounded-md border border-(--color-border) px-4 py-2 text-sm text-red-400 transition hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </div>
          </form>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold">Add new</h2>
        <form
          action={upsertProject}
          className="mt-4 space-y-4 rounded-lg border border-dashed border-(--color-border) p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelClass}>Title</label>
              <input name="title" className={inputClass} required />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Subtitle</label>
              <input name="subtitle" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <input name="category" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Link URL</label>
              <input name="link_url" className={inputClass} />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Tags (comma-separated)</label>
            <input name="tech_tags" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Bullets (one per line)</label>
            <textarea name="bullets" rows={4} className={inputClass} />
          </div>
          <div className="flex items-center gap-4">
            <div className="space-y-1.5">
              <label className={labelClass}>Sort order</label>
              <input name="sort_order" type="number" defaultValue={items.length} className={`${inputClass} w-24`} />
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground">
              <input type="checkbox" name="featured" />
              Featured
            </label>
          </div>
          <button
            type="submit"
            className="rounded-md bg-(--color-teal) px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Add project
          </button>
        </form>
      </div>
    </div>
  );
}
