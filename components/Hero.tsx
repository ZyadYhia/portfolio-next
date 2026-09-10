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
