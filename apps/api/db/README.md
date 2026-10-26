# PostgreSQL development

This directory owns PostgreSQL connection tooling and the shared SQL migration
history for the API and scrapers. The current API, Better Auth configuration,
and Python writers still use MongoDB. Application tables and writer changes
belong in follow-up PRs; there is no initial application schema yet.

## One-time local setup

Use Node.js 22.12 or newer and install PostgreSQL directly on your computer (no
Docker required). Use the same PostgreSQL major version as Railway when the
production PostgreSQL service is provisioned. PostgreSQL 18 is suitable for
starting locally. Include the PostgreSQL command-line tools in your PATH, or
use SQL Shell/pgAdmin supplied by the installer.

From an administrator's `psql` session (`psql -U postgres -d postgres`):

```sql
CREATE ROLE researchstarter LOGIN;
\password researchstarter
CREATE DATABASE researchstarter_dev OWNER researchstarter;
```

The password prompt avoids putting the password in SQL history. Each developer
has their own local database and credentials. These statements are one-time
setup, not migrations, and must not be run against production.

From the repository root, run `npm ci`. Copy `apps/api/config.env.example` to
`apps/api/config.env` if it does not exist. If it already exists, add only the
`DATABASE_URL` entry; preserve your existing authentication/MongoDB settings.
Replace `CHANGE_ME` with your local password, URL-encoding special characters.
The file is ignored by Git. Database-only commands do not need OAuth settings.

```sh
npm run db:check
npm run db:migrate -- up
```

The first command runs `SELECT 1` without changing data. The second applies
pending migrations and creates the runner's `pgmigrations` tracking table;
initially there are no application migrations. A second `up` has nothing to do.
Both commands accept an externally set `DATABASE_URL` in preference to the
local file. Never put this secret in a frontend `VITE_*` variable.

## Making a schema change

From the repository root:

```sh
npm run db:migrate -- create create-opportunities
```

This creates a timestamped `.sql` file in `apps/api/db/migrations/`. Fill in its
`-- Up Migration` and `-- Down Migration` sections. For example (illustration
only; this is not the agreed application schema):

```sql
-- Up Migration
CREATE TABLE example_items (
  id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  title text NOT NULL
);

-- Down Migration
DROP TABLE example_items;
```

Apply and test against your local development database:

```sh
npm run db:migrate -- up
npm run db:migrate -- down 1
npm run db:migrate -- up
```

`down` can delete data; use it only on disposable development data. Keep schema
changes and the code using them in the same PR. Commit migrations and the root
lockfile, but not credentials. Never edit a migration already applied in a
shared environment: add a follow-up migration instead. Leave transaction and
locking defaults enabled unless a reviewed PostgreSQL operation requires an
exception. A failed migration should block deployment.

When parallel branches add migrations, rebase before merging and test the full
history on a fresh development database. The runner checks timestamp order;
if an earlier migration lands after your local one, rebuild your disposable
database and replay the history. Do not disable order checks to hide the issue.

Future PRs should supply development seed data separately from migrations and
test both fresh installation and upgrades. There is intentionally no destructive
reset command in this bootstrap.

## API and scraper conventions

- API code can import `createPostgresPool` from `db/postgres.js`. Create one pool
  per process, reuse it, handle pool errors, and close it on shutdown. Use
  parameterized queries (`$1`, `$2`, etc.). A transaction must use one checked-out
  client, released in a `finally` block.
- Keep the PostgreSQL schema history here even when a Python scraper needs a
  new table. Run migrations with the Node tooling before running that writer;
  writers should not create or alter tables themselves.
- Future Python writers should use a PostgreSQL driver and the same
  `DATABASE_URL` convention. They must explicitly load their environment;
  Python does not automatically read the API's `config.env`. Add the driver and
  environment handling with the writer implementation. Existing MongoDB
  `private.json` credentials are not PostgreSQL connection settings.
- Generate Better Auth's required PostgreSQL schema with tooling compatible
  with the installed Better Auth version, then review and incorporate it into
  this migration history. Avoid a second independent schema migration process.

## Railway (when the PostgreSQL application is ready)

Provision PostgreSQL in the backend's Railway project/environment and set the
backend's `DATABASE_URL` to its private connection URL. With the repository root
as the service root, the pre-deploy command will be `npm run db:migrate -- up`;
with `apps/api` as the working directory, the same command uses the workspace's
script directly. Both `pg` and `node-pg-migrate` are runtime dependencies so the
command remains available when development dependencies are omitted.

Do not enable this deployment step until the PostgreSQL service and schema are
ready. Use compatible additive migrations while old API instances are running.
Production fixes should normally be new forward migrations rather than `down`.

References: [node-postgres queries](https://node-postgres.com/features/queries),
[node-pg-migrate](https://salsita.github.io/node-pg-migrate/), and
[Railway pre-deploy commands](https://docs.railway.com/deployments/pre-deploy-command).
