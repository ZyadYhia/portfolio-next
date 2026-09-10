const LINKS = [
  { href: "#top", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#contact", label: "Contact" },
];

export default function Nav({ name }: { readonly name: string }) {
  return (
    <header className="sticky top-0 z-40 border-b border-(--color-border) bg-background/90 backdrop-blur">
      <nav className="mx-auto flex w-full lg:w-[70%] items-center justify-between px-6 py-4">
        <a
          href="#top"
          className="font-display text-sm font-bold tracking-tight text-foreground"
        >
          {name || "Portfolio"}
        </a>
        <ul className="hidden gap-6 text-sm text-(--color-muted) sm:flex">
          {LINKS.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                className="transition-colors hover:text-(--color-amber)"
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
