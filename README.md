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

#### CV uploads

In **Dashboard → Profile → Your CV**, upload a PDF (maximum 3 MB).
The PDF is stored in Vercel Blob and its URL is saved in `profile.resume_url`.
The public Download CV button uses `/cv`, which reads the current URL on every
request and serves it as a download. The bundled CV remains the default until
the first upload. Saving other profile fields preserves the uploaded CV.

Before deploying uploads, create a **public Blob store** in your Vercel
project's Storage tab and connect it to the deployment environments you use.
This adds `BLOB_READ_WRITE_TOKEN`; redeploy after connecting the store.
Keep the token server-side (never prefix it with `NEXT_PUBLIC_`). See
[Vercel's setup guide](https://vercel.com/docs/vercel-blob/server-upload).

Local development without a Blob token stores PDFs in the gitignored
`data/cv` directory. Set `CV_STORAGE_DIR` to use another persistent directory.
Local files are not deployed: upload again after connecting the production
Blob store. Use separate development and production databases when testing
local uploads. Vercel uploads require Blob and never fall back to temporary disk.
Previous CV files are retained; a failed upload leaves the active CV unchanged.

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
