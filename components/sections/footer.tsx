import { socialLinks } from "@/lib/social-links";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t py-8">
      <div className="site-container flex flex-col gap-4 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
        <p>(c) {currentYear} Mario Montano</p>

        <ul className="-mx-2 flex flex-wrap items-center">
          {socialLinks.map((link) => {
            const Icon = link.icon;

            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={link.label}
                  title={link.label}
                  className="focus-ring inline-flex size-10 items-center justify-center rounded-md transition-colors hover:text-foreground"
                >
                  <Icon className="size-[1.125rem]" />
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </footer>
  );
}
