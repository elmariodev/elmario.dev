import { ArrowUpRightIcon, MailIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { socialHandle, socialLinks } from "@/lib/social-links";

export function ContactSection() {
  return (
    <section id="contact" className="section-container border-t">
      <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end lg:gap-20">
        <div>
          <h2 className="section-heading max-w-3xl">Contact</h2>
          <p className="body-copy mt-7 max-w-2xl">
            If you are hiring or want to talk about a project, email me. I
            usually reply within a day.
          </p>
        </div>

        <div className="lg:justify-self-end">
          <Button asChild size="lg" className="h-12 px-6 text-base">
            <a href="mailto:hola@elmario.dev">
              <MailIcon className="size-5" />
              Email me
            </a>
          </Button>

          <p className="mt-8 text-sm text-muted-foreground">
            <span className="font-mono font-semibold text-foreground">
              {socialHandle}
            </span>{" "}
            on every network
          </p>

          <div className="mt-3 flex max-w-md flex-wrap gap-x-6 gap-y-1">
            {socialLinks.map((link) => {
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
