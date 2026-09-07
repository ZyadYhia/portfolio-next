import type { Education as EducationType, Certification } from "@/lib/queries";

export default function Education({
  education,
  certifications,
}: {
  education: EducationType[];
  certifications: Certification[];
}) {
  if (education.length === 0 && certifications.length === 0) return null;

  return (
    <section id="education" className="mx-auto max-w-5xl px-6 py-16">
      <h2 className="font-display text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
        Education &amp; Training
      </h2>
      <div className="mt-8 grid gap-10 sm:grid-cols-2">
        {education.length > 0 ? (
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-teal)]">
              Education
            </h3>
            <ul className="space-y-4">
              {education.map((item) => (
                <li key={item.id}>
                  <p className="font-medium text-[var(--color-fg)]">{item.degree}</p>
                  <p className="text-sm text-[var(--color-muted)]">
                    {item.institution}
                  </p>
                  <p className="font-mono text-xs text-[var(--color-muted)]">
                    {item.start_year} – {item.end_year}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
        {certifications.length > 0 ? (
          <div>
            <h3 className="mb-3 font-mono text-xs uppercase tracking-[0.15em] text-[var(--color-teal)]">
              Training &amp; Certifications
            </h3>
            <ul className="space-y-3">
              {certifications.map((cert) => (
                <li key={cert.id} className="text-sm">
                  <span className="font-medium text-[var(--color-fg)]">{cert.name}</span>
                  {cert.provider ? (
                    <span className="text-[var(--color-muted)]"> — {cert.provider}</span>
                  ) : null}
                  {cert.period ? (
                    <span className="block font-mono text-xs text-[var(--color-muted)]">
                      {cert.period}
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
