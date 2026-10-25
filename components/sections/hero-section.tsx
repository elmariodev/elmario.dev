import { ArrowDownRightIcon, MailIcon } from "lucide-react";
import { AutomationWorkflowLoop } from "@/components/hero/automation-workflow-loop";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="top" className="border-b">
      <div className="site-container grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-6 text-lg font-semibold text-primary">
            Mario Montano, full-stack engineer
          </p>

          <h1 className="text-[clamp(3rem,5.4vw,4.5rem)] font-semibold leading-[0.96] tracking-[-0.04em]">
            Systems that keep complex work moving.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8">
            I build product software and automation for workflows where
            context, reliability, and the next action matter.
          </p>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Currently building internal automation at Ventura Travel.
            Previously, I built healthcare systems from the ground up at
            Omniwound.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <a href="#experience">
                See current experience
                <ArrowDownRightIcon className="size-5" />
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="h-12 border-border bg-transparent px-6 text-base"
            >
              <a href="mailto:hola@elmario.dev">
                <MailIcon className="size-5" />
                Email Mario
              </a>
            </Button>
          </div>
        </div>

        <AutomationWorkflowLoop />
      </div>
    </section>
  );
}
