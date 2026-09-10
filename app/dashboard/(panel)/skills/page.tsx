import { getSkills } from "@/lib/queries";
import { upsertSkill, deleteSkill } from "../../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-(--color-border) bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-(--color-amber)";
const labelClass = "text-xs uppercase tracking-wide text-(--color-muted)";

export default async function SkillsPage() {
  const items = await getSkills();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Skills</h1>
      <p className="mt-1 text-sm text-(--color-muted)">
        Skills are grouped by category on the live site (e.g. Frontend, Backend, Database, Tools).
      </p>

      <div className="mt-8 space-y-3">
        {items.map((item) => (
          <form
            key={item.id}
            action={upsertSkill}
            className="flex flex-wrap items-end gap-3 rounded-lg border border-(--color-border) bg-(--color-surface) p-4"
          >
            <input type="hidden" name="id" value={item.id} />
            <div className="space-y-1.5">
              <label className={labelClass}>Category</label>
              <input name="category" defaultValue={item.category} className={`${inputClass} w-40`} required />
            </div>
            <div className="min-w-45 flex-1 space-y-1.5">
              <label className={labelClass}>Name</label>
              <input name="name" defaultValue={item.name} className={inputClass} required />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Order</label>
              <input name="sort_order" type="number" defaultValue={item.sort_order} className={`${inputClass} w-20`} />
            </div>
            <button
              type="submit"
              className="rounded-md bg-(--color-amber) px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
            >
              Save
            </button>
            <button
              type="submit"
              formAction={deleteSkill}
              className="rounded-md border border-(--color-border) px-4 py-2 text-sm text-red-400 transition hover:border-red-400"
            >
              Delete
            </button>
          </form>
        ))}
      </div>

      <div className="mt-10">
        <h2 className="font-display text-lg font-bold">Add new</h2>
        <form
          action={upsertSkill}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-(--color-border) p-4"
        >
          <div className="space-y-1.5">
            <label className={labelClass}>Category</label>
            <input name="category" placeholder="Frontend" className={`${inputClass} w-40`} required />
          </div>
          <div className="min-w-45 flex-1 space-y-1.5">
            <label className={labelClass}>Name</label>
            <input name="name" className={inputClass} required />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Order</label>
            <input name="sort_order" type="number" defaultValue={items.length} className={`${inputClass} w-20`} />
          </div>
          <button
            type="submit"
            className="rounded-md bg-(--color-teal) px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Add skill
          </button>
        </form>
      </div>
    </div>
  );
}
