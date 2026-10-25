const capabilityGroups = [
  {
    title: "Product",
    tools: [
      "TypeScript",
      "React",
      "Next.js",
      "Node.js",
      "PostgreSQL",
      "Drizzle",
    ],
  },
  {
    title: "Automation and AI",
    tools: [
      "Hono",
      "Trigger.dev",
      "Hasura",
      "GraphQL",
      "BigQuery",
      "OpenRouter",
      "MCP",
      "Claude Code",
      "Codex",
    ],
  },
  {
    title: "Infrastructure and more",
    tools: [
      "Docker",
      "GitLab CI/CD",
      "Google Cloud",
      "Vercel",
      "Swift",
      "SwiftUI",
      "PHP",
    ],
  },
];

export function TechStackSection() {
  return (
    <section id="capabilities" className="section-container border-t">
      <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 className="section-heading max-w-lg">Stack</h2>
          <p className="body-copy mt-6 max-w-lg">
            Most of my work is TypeScript: React and Next.js on the front end,
            Node.js and PostgreSQL on the back end. I have also shipped a
            native iPad app in Swift and maintained PHP systems.
          </p>
        </div>

        <div className="border-t">
          {capabilityGroups.map((group) => (
            <div
              key={group.title}
              className="grid gap-5 border-b py-8 sm:grid-cols-[12rem_1fr] sm:gap-8"
            >
              <h3 className="text-lg font-semibold">{group.title}</h3>
              <ul className="flex flex-wrap gap-x-6 gap-y-3 text-base text-muted-foreground">
                {group.tools.map((tool) => (
                  <li key={tool} className="inline-flex items-center gap-2">
                    <span className="size-1.5 bg-primary" aria-hidden="true" />
                    {tool}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
