import { ArrowDownRightIcon, MailIcon } from "lucide-react";
import { AgentOrchestration } from "@/components/hero/agent-orchestration";
import { Button } from "@/components/ui/button";

export function HeroSection() {
  return (
    <section id="top" className="border-b">
      <div className="site-container grid min-h-[calc(100svh-4.5rem)] items-center gap-14 py-16 lg:grid-cols-[0.78fr_1.22fr] lg:gap-8 lg:py-24">
        <div className="max-w-3xl">
          <p className="mb-6 text-lg font-semibold text-primary">
            Mario Montano, full-stack engineer
          </p>

          <h1 className="text-[clamp(2.75rem,5vw,4.25rem)] leading-[1] tracking-[-0.02em]">
            I build AI agents, automation, and the apps around them.
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-7 text-muted-foreground sm:text-xl sm:leading-8">
            I&apos;m in charge of Ventura AI, an internal platform that gives
            100+ employees at Ventura Travel their own AI agent.
          </p>

          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Before that, I spent more than six years at Omniwound, a
            healthcare startup, where I helped build its EMR from scratch.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg" className="h-12 px-6 text-base">
              <a href="#experience">
                See my experience
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

        <AgentOrchestration />
      </div>
    </section>
  );
}
