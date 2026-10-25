# elmario.dev

Mario Montano's portfolio, built with Next.js 16, React 19, TypeScript, Tailwind CSS v4, and shadcn/ui source components.

## Local development

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## Checks

```bash
pnpm lint
pnpm exec tsc --noEmit
pnpm build
pnpm audit
```

## shadcn/ui

The project is already configured in `components.json` with the New York style, neutral tokens, CSS variables, React Server Components, and Lucide icons. Components are local source files under `components/ui`, so review registry changes before applying them.

```bash
pnpm dlx shadcn@latest info
pnpm dlx shadcn@latest add button --diff
pnpm dlx shadcn@latest add accordion --dry-run
pnpm dlx shadcn@latest add accordion
```

Do not run `shadcn init` again. The current individual Radix packages support React 19. A later migration to the unified `radix-ui` package should be handled as a separate change.

## Deployment

Vercel does not require a local CLI when this GitHub repository is connected to a Vercel project. A push to the configured production branch, normally `main`, creates the production deployment.

The CLI is optional for linking, previews, logs, and manual deployments:

```bash
pnpm dlx vercel@latest --version
pnpm dlx vercel@latest link
pnpm dlx vercel@latest
pnpm dlx vercel@latest --prod
```

See the [Vercel Git deployment guide](https://vercel.com/docs/git) and [Vercel CLI reference](https://vercel.com/docs/cli).
