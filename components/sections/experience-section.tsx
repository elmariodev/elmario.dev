import { AutomationRelay } from "@/components/experience/automation-relay";

const experience = [
  {
    company: "Ventura Travel",
    role: "Full Stack Developer, Ventura AI",
    start: "2026-10",
    dates: "Oct 2026 - Present",
    current: true,
    summary:
      "I'm in charge of Ventura AI, an internal app where 100+ employees each have a private AI agent with chat, files, skills, scheduled tasks, and connectors to the company's tools. I maintain the platform, ship new connectors and features, and review the skills people propose.",
  },
  {
    company: "Ventura Travel",
    role: "Full Stack Developer, Automations",
    start: "2026-02",
    end: "2026-10",
    dates: "Feb 2026 - Oct 2026",
    current: false,
    summary:
      "I moved all of the company's automations from legacy services and no-code tools into a TypeScript monorepo, built new automations for the operations and finance teams, and set up documentation for 500+ automations that regenerates itself whenever the code changes.",
  },
  {
    company: "Omniwound",
    role: "Full Stack Developer, then Senior Software Engineer",
    start: "2019-07",
    end: "2026-01",
    dates: "Jul 2019 - Jan 2026",
    current: false,
    summary:
      "I joined as one of the first engineers and helped build the company's healthcare platform from scratch. Later I led its architecture and the delivery work with other developers.",
  },
];

export function ExperienceSection() {
  return (
    <section id="experience" className="section-container">
      <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
        <div>
          <h2 className="section-heading max-w-xl">Experience</h2>
        </div>
        <p className="body-copy max-w-2xl lg:pt-10">
          More than six years building healthcare software at a startup, and
          since 2026, automation and AI tools at a travel company.
        </p>
      </div>

      <ol className="mt-14 border-t sm:mt-18">
        {experience.map((item) => (
          <li
            key={`${item.company}-${item.start}`}
            className="grid gap-5 border-b py-8 lg:grid-cols-[11rem_1fr_1.2fr] lg:gap-10 lg:py-10"
          >
            <p className="font-mono text-sm leading-6 text-muted-foreground">
              <time dateTime={item.start}>{item.dates.split(" - ")[0]}</time>
              {" - "}
              {item.end ? (
                <time dateTime={item.end}>{item.dates.split(" - ")[1]}</time>
              ) : (
                "Present"
              )}
            </p>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-2xl font-semibold tracking-[-0.025em]">
                  {item.company}
                </h3>
                {item.current ? (
                  <span className="border border-primary/60 px-2 py-1 font-mono text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-primary">
                    Current
                  </span>
                ) : null}
              </div>
              <p className="mt-2 font-medium text-foreground">{item.role}</p>
            </div>
            <p className="max-w-2xl leading-7 text-muted-foreground">
              {item.summary}
            </p>
          </li>
        ))}
      </ol>

      <div className="mt-20 border-t pt-12 lg:mt-28 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          <div>
            <p className="font-mono text-xs font-semibold uppercase tracking-[0.18em] text-primary">
              Ventura Travel / automations
            </p>
            <h3 className="mt-5 font-display text-4xl tracking-[-0.02em] sm:text-5xl lg:text-6xl">
              Automations in one codebase
            </h3>
          </div>
          <div className="space-y-5 lg:pt-8">
            <p className="body-copy text-foreground">
              Ventura runs hundreds of automations: booking changes, payment
              reminders, provider emails, and tasks for the operations team.
              When I joined, they were spread across old services and a no-code
              platform.
            </p>
            <p className="body-copy">
              I moved all of them into a TypeScript monorepo, and the no-code
              platform is now turned off. I also built an automation that
              documents the others: whenever one changes, its entry in the
              catalog is regenerated. The catalog covers 500+ automations, what
              each one does and when it runs. The animation below shows the kind of flow I build, without
              real data.
            </p>
            <p className="text-sm leading-6 text-muted-foreground">
              Stack: TypeScript, Node.js, Hono, Trigger.dev, Hasura GraphQL,
              PostgreSQL, BigQuery, and GitLab CI.
            </p>
          </div>
        </div>

        <AutomationRelay />
      </div>
    </section>
  );
}
