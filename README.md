## Portfolio

Personal portfolio built with Next.js (App Router), Tailwind CSS, and a
libSQL database (Turso in production, a plain local SQLite file in
development). All content shown on the site (profile, experience, projects,
skills, education, certifications) is edited through a password-protected
dashboard at `/dashboard`.

### Local development

```bash
npm install
cp .env.example .env.local   # then edit ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open http://localhost:3000 for the public site and
http://localhost:3000/dashboard to sign in and edit content.

Locally, leave `TURSO_DATABASE_URL` unset — the app automatically falls back
to a plain SQLite file at `data/portfolio.db`, created and seeded on first
run. It's gitignored, so it's local to your machine.

### Deploying to Vercel

Vercel's serverless functions have no persistent, writable disk, so the
local-SQLite-file approach above only works for local dev. In production the
same code talks to [Turso](https://turso.tech) instead — a hosted,
SQLite-compatible database — via the same `@libsql/client` library, just
pointed at a remote URL. No other code changes needed.

1. **Create a Turso database** (free tier is enough for this):
   ```bash
   curl -sSfL https://get.tur.so/install.sh | bash   # installs the turso CLI
   turso auth login                                   # opens a browser to sign in
   turso db create portfolio
   turso db show portfolio --url                      # copy this -> TURSO_DATABASE_URL
   turso db tokens create portfolio                    # copy this -> TURSO_AUTH_TOKEN
   ```
2. **Import the repo into Vercel** at vercel.com/new (or `vercel` CLI), pointing at this GitHub repo. Next.js is auto-detected — no build settings to change.
3. **Set environment variables** in the Vercel project (Settings → Environment Variables), for Production (and Preview if you want previews to have data too):
   - `ADMIN_PASSWORD`
   - `SESSION_SECRET`
   - `TURSO_DATABASE_URL`
   - `TURSO_AUTH_TOKEN`
4. **Deploy.** The first request that touches the database creates the schema and seeds it automatically (same `migrate()`/`seedIfEmpty()` logic as local dev), so no separate migration step is required.

After that, every dashboard save writes straight to Turso and calls
`revalidatePath("/")`, so the live site reflects changes immediately —
no rebuild or redeploy needed for content edits.

### How content updates work

Every dashboard save runs a SQL statement against the database and then
calls `revalidatePath("/")`, so the public homepage always reflects the
latest saved data on the next request.

### Structure

- `lib/db.ts` — libSQL connection (Turso in production, local file in dev), schema, and one-time seed data.
- `lib/queries.ts` — typed async read helpers used by the public site.
- `app/dashboard/actions.ts` — all Server Actions (auth + CRUD) used by the dashboard.
- `app/dashboard/(panel)/*` — the protected dashboard pages (profile, experience, projects, skills, education).
- `app/dashboard/login` — the sign-in page (outside the protected route group).
- `proxy.ts` — gates every `/dashboard/*` route except `/dashboard/login` behind a signed session cookie.
- `components/*` — the public site's sections (Hero, Experience, Projects, Skills, Education, Contact).
