import type { Profile } from "@/lib/queries";

export default function Contact({ profile }: { readonly profile: Profile }) {
  return (
    <section id="contact" className="mx-auto w-full lg:w-[70%] px-6 py-20">
      <div className="rounded-xl border border-(--color-border) bg-(--color-surface) p-10 text-center">
        <h2 className="font-display text-2xl font-bold text-foreground sm:text-3xl">
          Let&apos;s work together
        </h2>
        <p className="mx-auto mt-3 max-w-md text-sm text-(--color-muted)">
          Open to new opportunities and interesting projects. Reach out any
          time.
        </p>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          {profile.email ? (
            <a
              href={`mailto:${profile.email}`}
              className="rounded-md bg-(--color-amber) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
            >
              {profile.email}
            </a>
          ) : null}
          {profile.phone ? (
            <a
              href={`https://wa.me/${profile.phone.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Chat on WhatsApp at ${profile.phone}`}
              className="inline-flex items-center gap-2 rounded-md border border-(--color-border) px-5 py-2.5 text-sm text-foreground transition-colors hover:border-(--color-amber) hover:text-(--color-amber) focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--color-amber)"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="size-5 shrink-0"
                aria-hidden="true"
                focusable="false"
              >
                <path d="M20.52 3.48A11.9 11.9 0 0 0 12.05 0C5.46 0 .1 5.36.1 11.95c0 2.1.55 4.16 1.6 5.97L0 24l6.24-1.64a11.94 11.94 0 0 0 5.8 1.48h.01C18.64 23.84 24 18.48 24 11.9c0-3.19-1.24-6.18-3.48-8.42ZM12.05 21.82a9.9 9.9 0 0 1-5.05-1.38l-.36-.21-3.7.97.99-3.61-.24-.37a9.88 9.88 0 0 1-1.52-5.27c0-5.48 4.46-9.94 9.94-9.94a9.87 9.87 0 0 1 7.03 2.91 9.87 9.87 0 0 1 2.91 7.03c0 5.48-4.46 9.94-9.94 9.94Zm5.45-7.44c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.95 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.8-1.49-1.78-1.66-2.08-.18-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.37-.03-.52-.07-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.8.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.3 1.27.48 1.7.62.72.23 1.37.2 1.89.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.17-1.42-.07-.12-.27-.2-.57-.35Z" />
              </svg>
              {profile.phone}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
