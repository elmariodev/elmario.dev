import { ArrowUpRightIcon, GithubIcon, LinkedinIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

const profileLinks = [
  {
    href: "https://github.com/elmariodev",
    label: "GitHub",
    icon: GithubIcon,
  },
  {
    href: "https://linkedin.com/in/mariomondev",
    label: "LinkedIn",
    icon: LinkedinIcon,
  },
];

export function ContactSection() {
  return (
    <section id="contact" className="section-container border-t">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
        <div>
          <h2 className="section-heading max-w-3xl">
            Have a hard system problem?
          </h2>
          <p className="body-copy mt-7 max-w-2xl">
            Send me context if you want to compare notes on product systems,
            automation, or high-stakes operational workflows.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <a href="mailto:hola@elmario.dev">
              <MailIcon className="size-5" />
              Start a conversation
            </a>
          </Button>

          <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3">
            {profileLinks.map((link) => {
              const Icon = link.icon;

              return (
                <a
                  key={link.href}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="focus-ring inline-flex h-11 items-center gap-2 rounded-md font-semibold text-muted-foreground transition-colors hover:text-foreground"
                >
                  <Icon className="size-4" />
                  {link.label}
                  <ArrowUpRightIcon className="size-4 text-primary" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
