import type { Profile } from "@/lib/queries";

export default function Contact({ profile }: { profile: Profile }) {
  return (
    <section id="contact" className="mx-auto w-full lg:w-[70%] px-6 py-20">
      <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-10 text-center">
        <h2 className="font-display text-2xl font-bold text-[var(--color-fg)] sm:text-3xl">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-[var(--color-muted)]">
          Open to new opportunities and interesting projects. Reach out any time.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-[var(--color-amber)] px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              {profile.email}
            </a>
          ) : null}
          {profile.phone ? (
            <span className="rounded-md border border-[var(--color-border)] px-5 py-2.5 text-sm text-[var(--color-fg)]">
              {profile.phone}
            </span>
          ) : null}
        </div>
      </div>
    </section>
  );
}
