import { getExperience } from "@/lib/queries";
import { upsertExperience, deleteExperience } from "../../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-[var(--color-border)] bg-black/30 px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-amber)]";
const labelClass = "text-xs uppercase tracking-wide text-[var(--color-muted)]";

export default function ExperiencePage() {
  const items = getExperience();

  return (
    <div className="max-w-3xl">
      <h1 className="font-display text-2xl font-bold">Experience</h1>
      <p className="mt-1 text-sm text-[var(--color-muted)]">
        One entry per role. Bullets: one per line. Tags: comma-separated.
      </p>

      <div className="mt-8 space-y-6">
        {items.map((item) => (
          <form
            key={item.id}
            action={upsertExperience}
            className="space-y-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5"
          >
            <input type="hidden" name="id" value={item.id} />
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className={labelClass}>Company</label>
                <input name="company" defaultValue={item.company} className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Role</label>
                <input name="role" defaultValue={item.role} className={inputClass} required />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Start date</label>
                <input name="start_date" defaultValue={item.start_date} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>End date</label>
                <input name="end_date" defaultValue={item.end_date} placeholder="Present" className={inputClass} />
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
            <div className="flex items-center justify-between gap-4">
              <div className="space-y-1.5">
                <label className={labelClass}>Sort order</label>
                <input
                  name="sort_order"
                  type="number"
                  defaultValue={item.sort_order}
                  className={`${inputClass} w-24`}
                />
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  className="rounded-md bg-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteExperience}
                  className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm text-red-400 transition hover:border-red-400"
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
          action={upsertExperience}
          className="mt-4 space-y-4 rounded-lg border border-dashed border-[var(--color-border)] p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className={labelClass}>Company</label>
              <input name="company" className={inputClass} required />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Role</label>
              <input name="role" className={inputClass} required />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>Start date</label>
              <input name="start_date" className={inputClass} />
            </div>
            <div className="space-y-1.5">
              <label className={labelClass}>End date</label>
              <input name="end_date" placeholder="Present" className={inputClass} />
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
          <div className="space-y-1.5">
            <label className={labelClass}>Sort order</label>
            <input name="sort_order" type="number" defaultValue={items.length} className={`${inputClass} w-24`} />
          </div>
          <button
            type="submit"
            className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Add experience
          </button>
        </form>
      </div>
    </div>
  );
}
