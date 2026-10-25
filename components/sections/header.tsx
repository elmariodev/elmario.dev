import { ThemeToggle } from "@/components/theme/theme-toggle";

const navigation = [
  { href: "#experience", label: "Experience" },
  { href: "#work", label: "Work" },
  { href: "#about", label: "About" },
  { href: "#contact", label: "Contact" },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b bg-background/95">
      <a
        href="#main-content"
        className="focus-ring fixed left-1/2 top-3 z-50 h-px w-px -translate-x-1/2 overflow-hidden whitespace-nowrap rounded-md bg-primary px-4 py-2 font-semibold text-primary-foreground opacity-0 [clip-path:inset(50%)] focus-visible:h-auto focus-visible:w-auto focus-visible:overflow-visible focus-visible:whitespace-normal focus-visible:opacity-100 focus-visible:[clip-path:none]"
      >
        Skip to content
      </a>

      <div className="site-container flex h-18 items-center justify-between">
        <a
          href="#top"
          className="focus-ring inline-flex h-11 items-center gap-2.5 rounded-md text-lg"
          aria-label="Mario Montano, back to top"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/icon.svg" alt="" className="size-8" aria-hidden="true" />
          <span className="flex items-baseline" aria-hidden="true">
            <span className="font-mono font-bold text-muted-foreground">el</span>
            <span className="font-black">mario</span>
            <span className="font-mono font-bold text-primary">dev</span>
          </span>
        </a>

        <nav
          className="flex items-center gap-1"
          aria-label="Primary navigation"
        >
          {navigation.map((item, index) => (
            <a
              key={item.href}
              href={item.href}
              className={`focus-ring inline-flex h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground ${
                index > 0 ? "max-sm:hidden" : ""
              }`}
            >
              {item.label}
            </a>
          ))}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
