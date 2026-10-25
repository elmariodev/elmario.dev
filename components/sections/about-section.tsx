const responsibilities = [
  {
    title: "Build",
    description:
      "Full-stack features in TypeScript, React, and Node.js, from the database to the UI.",
  },
  {
    title: "Automate",
    description:
      "Background jobs, integrations, and AI agents that take manual work off people's plates.",
  },
  {
    title: "Lead",
    description:
      "Architecture decisions, code reviews, and mentoring for small teams.",
  },
];

export function AboutSection() {
  return (
    <section id="about" className="section-container border-t">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="section-heading max-w-lg">About</h2>
        </div>

        <div>
          <div className="max-w-3xl space-y-6">
            <p className="body-copy text-foreground">
              I started writing software in 2017. In 2019 I joined Omniwound as
              one of its first engineers and helped build its EMR, an iPad app
              for patient visits, and an insurance verification system. In
              2026 I moved to Ventura Travel to work on automation, and since
              October 2026 I&apos;m in charge of Ventura AI.
            </p>
            <p className="body-copy">
              I like owning a feature from start to finish: talking with the
              people who will use it, designing the data model, writing the
              code, and supporting it in production. I use AI coding agents
              every day, with my own skills and review steps.
            </p>
          </div>

          <dl className="mt-12 border-t">
            {responsibilities.map((item) => (
              <div
                key={item.title}
                className="grid gap-3 border-b py-7 sm:grid-cols-[12rem_1fr] sm:gap-8"
              >
                <dt className="text-lg font-semibold text-foreground">
                  {item.title}
                </dt>
                <dd className="max-w-2xl leading-7 text-muted-foreground">
                  {item.description}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
