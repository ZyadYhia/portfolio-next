export default function Footer({ name }: { name: string }) {
  return (
    <footer className="mt-auto border-t border-(--color-border) px-6 py-8">
      <p className="mx-auto w-full lg:w-[70%] font-mono text-xs text-(--color-muted)">
        © {new Date().getFullYear()} {name}. Built with Next.js.
      </p>
    </footer>
  );
}
