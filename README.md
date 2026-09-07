## Portfolio

Personal portfolio built with Next.js (App Router), Tailwind CSS, and a local
SQLite database. All content shown on the site (profile, experience,
projects, skills, education, certifications) lives in `data/portfolio.db`
and is edited through a password-protected dashboard at `/dashboard`.

### Getting started

```bash
npm install
cp .env.example .env.local   # then edit ADMIN_PASSWORD and SESSION_SECRET
npm run dev
```

Open http://localhost:3000 for the public site and
http://localhost:3000/dashboard to sign in and edit content.

The SQLite database is created automatically on first run at
`data/portfolio.db` and seeded with the content already in this repo. It is
gitignored, so it's local to each machine/deploy — back it up if you care
about not re-seeding.

### How content updates work

Every dashboard save runs a plain SQL statement against `data/portfolio.db`
and then calls `revalidatePath("/")`, so the public homepage always reflects
the latest saved data on the next request — no rebuild needed.

### Structure

- `lib/db.ts` — SQLite connection, schema, and one-time seed data.
- `lib/queries.ts` — typed read helpers used by the public site.
- `app/dashboard/actions.ts` — all Server Actions (auth + CRUD) used by the dashboard.
- `app/dashboard/(panel)/*` — the protected dashboard pages (profile, experience, projects, skills, education).
- `app/dashboard/login` — the sign-in page (outside the protected route group).
- `proxy.ts` — gates every `/dashboard/*` route except `/dashboard/login` behind a signed session cookie.
- `components/*` — the public site's sections (Hero, Experience, Projects, Skills, Education, Contact).

### Deploying

Because content is a local SQLite file, deploy this to a host with a
persistent filesystem (a VPS, Docker container, Fly.io, Railway, etc.) rather
than a stateless serverless platform — otherwise writes made through the
dashboard won't survive a redeploy/restart.
