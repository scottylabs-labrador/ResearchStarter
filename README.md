# CMU Research

Research opportunities at Carnegie Mellon University, maintained by ScottyLabs Labrador.

## Apps

| Directory | Purpose |
| --- | --- |
| `apps/web` | React, Vite, Tailwind, and Storybook frontend |
| `apps/api` | Express, authentication, MongoDB routes, and `dbschemas/` |
| `apps/scrapers` | Python collectors, CSV transforms, and database writers |

Web and API use npm workspaces with one root `package-lock.json`. Python uses a separate virtual environment. No task runner or CI service is required.

## Development

Use Node.js 22.12 or newer and Python 3.11 or newer. From the repository root:

```sh
npm ci
npm run dev
```

The web app runs at http://localhost:3000. In a second terminal, copy `apps/api/config.env.example` to `apps/api/config.env`, fill in your separately supplied database and authentication settings, and run:

```sh
npm run server
```

The API runs on port 5050. Vite forwards `/api/auth/*` unchanged and strips `/api` for the other API routes. Existing API endpoints and data schemas are unchanged.

Other root commands:

```sh
npm run build           # output: apps/web/dist
npm run preview
npm run lint
npm run test_server     # JSON fixture server on port 8000
npm run storybook       # port 6006
npm run build-storybook # output: apps/web/storybook-static
```

See [scraper setup and writer commands](apps/scrapers/README.md). Scrapers do not run during npm installation, frontend builds, or API startup.

Known inherited tooling issues: Storybook's `src/pages/Profile.stories.tsx` imports a removed `./Profile` module, so `build-storybook` currently fails. ESLint's existing Storybook rules have no TypeScript parser and report parsing errors on TypeScript stories/configuration. These are not required merge checks; the production Vite build is independent of them.

## PostgreSQL development tooling

To start PostgreSQL schema or writer work, follow the [local database and SQL migration setup](apps/api/db/README.md).
Use `npm run db:check` to verify your local connection and `npm run db:migrate -- up` to apply pending migrations.
The shared migration history lives in `apps/api/db/migrations/`. The API and existing scrapers still use MongoDB until their follow-up migrations are implemented.

## Migrating an existing checkout or deployment

- Frontend source, assets, and tool configuration now live in `apps/web`. Move local frontend `.env` files there.
- Move the old `server/config.env` to `apps/api/config.env`; never commit its contents.
- Deployment build commands can remain `npm ci` and `npm run build` at the repository root. Change the static output directory from `dist` to `apps/web/dist`.
- API processes can keep using root `npm run server`; direct launch commands must use the new API directory.
- External scraper schedules must be updated separately to the paths documented in the scraper README. The old backend repo is retained as historical reference; no schedules or deployments are changed by this migration.

## Reviews

Every PR to `main` requires one approval and resolved conversations, with no required CI/status checks. API, scraper, schema, GitHub configuration, and workspace dependency changes require approval from **one of** `@nicholascui225`, `@jahuang24`, or `@JennyPenguin`. Frontend-only changes can be approved by any eligible reviewer. Authors cannot approve their own PRs, and the latest push must be approved by someone else.

See [protection settings and verification](.github/PROTECTION.md). Repository access does not grant database access; credentials are distributed separately.

## Attribution

Original project leads: Rishi Prabhu, Jarrett Huang, Jennifer Zhu, Lily Qin, and Bryan Huang, with CMU ScottyLabs Labrador contributors. Scraper source and attribution are recorded in [apps/scrapers/UPSTREAM.md](apps/scrapers/UPSTREAM.md).
