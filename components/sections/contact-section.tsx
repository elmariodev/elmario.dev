import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import { CopyEmailButton } from "@/components/contact/copy-email-button";
import { Button } from "@/components/ui/button";
import { socialHandle, socialLinks } from "@/lib/social-links";

const email = "hola@elmario.dev";
const primaryLabels = new Set(["GitHub", "LinkedIn"]);
const primaryLinks = socialLinks.filter((link) =>
  primaryLabels.has(link.label),
);
const otherLinks = socialLinks.filter((link) => !primaryLabels.has(link.label));

export function ContactSection() {
  return (
    <section id="contact" className="section-container border-t">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-20">
        <div>
          <h2 className="section-heading max-w-3xl">Contact</h2>
          <p className="body-copy mt-7 max-w-2xl">
            If you are hiring or want to talk about a project, email me. I
            usually reply within a day.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <a href={`mailto:${email}`}>
                <MailIcon className="size-5" />
                {email}
              </a>
            </Button>
            <CopyEmailButton email={email} />
          </div>
        </div>

        <div className="lg:pt-4">
          <ul className="space-y-1">
            {primaryLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="focus-ring group inline-flex h-12 items-center gap-3 rounded-md text-lg font-semibold text-foreground"
                  >
                    <Icon className="size-5" />
                    {link.label}
                    <ArrowUpRightIcon className="size-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                    <span className="sr-only">(opens in a new tab)</span>
                  </a>
                </li>
              );
            })}
          </ul>

          <p className="mt-8 text-sm text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">
              {socialHandle}
            </span>{" "}
            on every other network
          </p>

          <ul className="-mx-2.5 mt-2 flex flex-wrap">
            {otherLinks.map((link) => {
              const Icon = link.icon;

              return (
                <li key={link.href}>
                  <a
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${link.label} (opens in a new tab)`}
                    title={link.label}
                    className="focus-ring inline-flex size-11 items-center justify-center rounded-md text-muted-foreground transition-colors hover:text-foreground"
                  >
                    <Icon className="size-[1.125rem]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
