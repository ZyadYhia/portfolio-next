import type { Profile } from "@/lib/queries";

export default function Hero({ profile }: { readonly profile: Profile }) {
  return (
    <section id="top" className="mx-auto w-full lg:w-[70%] px-6 pb-16 pt-20 sm:pt-28">
      <p className="mb-4 font-mono text-xs uppercase tracking-[0.2em] text-(--color-teal)">
        {profile.location || "Software Engineer"}
      </p>
      <h1 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight text-foreground sm:text-6xl">
        {profile.name}
      </h1>
      <p className="mt-4 max-w-2xl text-lg text-(--color-muted) sm:text-xl">
        {profile.title}
        {profile.tagline ? (
          <span className="text-foreground"> — {profile.tagline}</span>
        ) : null}
      </p>
      <p className="mt-6 max-w-2xl text-sm leading-relaxed text-(--color-muted) sm:text-base">
        {profile.bio}
      </p>
      <div className="mt-8 flex flex-wrap gap-3">
        <a
          href="#contact"
          className="rounded-md bg-(--color-amber) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Get in touch
        </a>
        <a
          href="/cv"
          download="Zyad_Yhia_CV.pdf"
          className="inline-flex items-center gap-2 rounded-md border border-(--color-border) px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-(--color-teal) hover:text-(--color-teal) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-teal)"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-5 shrink-0"
            aria-hidden="true"
            focusable="false"
          >
            <path d="M12 3v12m-5-5 5 5 5-5M5 16v4a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-4" />
          </svg>
          Download CV
        </a>
        {profile.github_url ? (
          <a
            href={profile.github_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-(--color-border) px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-(--color-teal) hover:text-(--color-teal)"
          >
            GitHub
          </a>
        ) : null}
        {profile.linkedin_url ? (
          <a
            href={profile.linkedin_url}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md border border-(--color-border) px-5 py-2.5 text-sm font-medium text-foreground transition hover:border-(--color-teal) hover:text-(--color-teal)"
          >
            LinkedIn
          </a>
        ) : null}
      </div>
    </section>
  );
}
