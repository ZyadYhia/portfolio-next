export default function Footer({ name }: { name: string }) {
  return (
    <footer className="mt-auto border-t border-[var(--color-border)] px-6 py-8">
      <p className="mx-auto max-w-5xl font-mono text-xs text-[var(--color-muted)]">
        © {new Date().getFullYear()} {name}. Built with Next.js.
      </p>
    </footer>
  );
}
