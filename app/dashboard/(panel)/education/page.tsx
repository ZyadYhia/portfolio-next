import { getEducation, getCertifications } from "@/lib/queries";
import {
  upsertEducation,
  deleteEducation,
  upsertCertification,
  deleteCertification,
} from "../../actions";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-[var(--color-border)] bg-black/30 px-3 py-2 text-sm text-[var(--color-fg)] outline-none focus:border-[var(--color-amber)]";
const labelClass = "text-xs uppercase tracking-wide text-[var(--color-muted)]";

export default function EducationPage() {
  const education = getEducation();
  const certifications = getCertifications();

  return (
    <div className="max-w-3xl space-y-14">
      <div>
        <h1 className="font-display text-2xl font-bold">Education</h1>
        <div className="mt-6 space-y-4">
          {education.map((item) => (
            <form
              key={item.id}
              action={upsertEducation}
              className="grid gap-4 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5 sm:grid-cols-2"
            >
              <input type="hidden" name="id" value={item.id} />
              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Degree</label>
                <input name="degree" defaultValue={item.degree} className={inputClass} required />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className={labelClass}>Institution</label>
                <input name="institution" defaultValue={item.institution} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Start year</label>
                <input name="start_year" defaultValue={item.start_year} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>End year</label>
                <input name="end_year" defaultValue={item.end_year} className={inputClass} />
              </div>
              <div className="flex items-end gap-3 sm:col-span-2">
                <button
                  type="submit"
                  className="rounded-md bg-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
                >
                  Save
                </button>
                <button
                  type="submit"
                  formAction={deleteEducation}
                  className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm text-red-400 transition hover:border-red-400"
                >
                  Delete
                </button>
              </div>
            </form>
          ))}
        </div>

        <form
          action={upsertEducation}
          className="mt-4 grid gap-4 rounded-lg border border-dashed border-[var(--color-border)] p-5 sm:grid-cols-2"
        >
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelClass}>Degree</label>
            <input name="degree" className={inputClass} required />
          </div>
          <div className="space-y-1.5 sm:col-span-2">
            <label className={labelClass}>Institution</label>
            <input name="institution" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Start year</label>
            <input name="start_year" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>End year</label>
            <input name="end_year" className={inputClass} />
          </div>
          <button
            type="submit"
            className="w-fit rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90 sm:col-span-2"
          >
            Add education
          </button>
        </form>
      </div>

      <div>
        <h2 className="font-display text-2xl font-bold">Training &amp; Certifications</h2>
        <div className="mt-6 space-y-3">
          {certifications.map((cert) => (
            <form
              key={cert.id}
              action={upsertCertification}
              className="flex flex-wrap items-end gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-4"
            >
              <input type="hidden" name="id" value={cert.id} />
              <div className="min-w-[180px] flex-1 space-y-1.5">
                <label className={labelClass}>Name</label>
                <input name="name" defaultValue={cert.name} className={inputClass} required />
              </div>
              <div className="min-w-[160px] flex-1 space-y-1.5">
                <label className={labelClass}>Provider</label>
                <input name="provider" defaultValue={cert.provider} className={inputClass} />
              </div>
              <div className="space-y-1.5">
                <label className={labelClass}>Period</label>
                <input name="period" defaultValue={cert.period} className={`${inputClass} w-36`} />
              </div>
              <button
                type="submit"
                className="rounded-md bg-[var(--color-amber)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
              >
                Save
              </button>
              <button
                type="submit"
                formAction={deleteCertification}
                className="rounded-md border border-[var(--color-border)] px-4 py-2 text-sm text-red-400 transition hover:border-red-400"
              >
                Delete
              </button>
            </form>
          ))}
        </div>

        <form
          action={upsertCertification}
          className="mt-4 flex flex-wrap items-end gap-3 rounded-lg border border-dashed border-[var(--color-border)] p-4"
        >
          <div className="min-w-[180px] flex-1 space-y-1.5">
            <label className={labelClass}>Name</label>
            <input name="name" className={inputClass} required />
          </div>
          <div className="min-w-[160px] flex-1 space-y-1.5">
            <label className={labelClass}>Provider</label>
            <input name="provider" className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass}>Period</label>
            <input name="period" className={`${inputClass} w-36`} />
          </div>
          <button
            type="submit"
            className="rounded-md bg-[var(--color-teal)] px-4 py-2 text-sm font-semibold text-black transition hover:opacity-90"
          >
            Add certification
          </button>
        </form>
      </div>
    </div>
  );
}
