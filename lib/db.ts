import { createClient, type Client } from "@libsql/client";
import path from "node:path";
import fs from "node:fs";

// Uses libSQL (the SQLite-compatible engine behind Turso) instead of a
// locally-compiled native module. Two reasons:
//
// 1. A native module like better-sqlite3 has to be compiled for a specific
//    OS/architecture. This repo is edited from a sandboxed Linux
//    environment but runs on macOS, so an npm-installed native binary would
//    be built for the wrong platform and crash the process on load.
// 2. Vercel's serverless functions have no persistent, writable disk, so a
//    local SQLite *file* can't be the source of truth in production —
//    dashboard edits would vanish on the next request.
//
// @libsql/client solves both: locally (no TURSO_DATABASE_URL set) it opens
// a plain SQLite file on disk with zero setup, identical to before. In
// production, pointing it at a Turso database (a hosted, persistent
// libSQL instance) makes dashboard writes durable across requests and
// deploys — same code path either way, just a different connection URL.

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_AUTH_TOKEN = process.env.TURSO_AUTH_TOKEN;

declare global {
  // eslint-disable-next-line no-var
  var __portfolioDb: Client | undefined;
  // eslint-disable-next-line no-var
  var __portfolioDbReady: Promise<Client> | undefined;
}

function createConnection(): Client {
  if (TURSO_URL) {
    return createClient({ url: TURSO_URL, authToken: TURSO_AUTH_TOKEN });
  }

  const DATA_DIR = path.join(process.cwd(), "data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const DB_PATH = path.join(DATA_DIR, "portfolio.db");
  return createClient({ url: `file:${DB_PATH}` });
}

async function migrate(db: Client) {
  await db.executeMultiple(`
    CREATE TABLE IF NOT EXISTS profile (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      name TEXT NOT NULL DEFAULT '',
      title TEXT NOT NULL DEFAULT '',
      tagline TEXT NOT NULL DEFAULT '',
      bio TEXT NOT NULL DEFAULT '',
      location TEXT NOT NULL DEFAULT '',
      email TEXT NOT NULL DEFAULT '',
      phone TEXT NOT NULL DEFAULT '',
      linkedin_url TEXT NOT NULL DEFAULT '',
      github_url TEXT NOT NULL DEFAULT '',
      resume_url TEXT NOT NULL DEFAULT ''
    );

    CREATE TABLE IF NOT EXISTS experience (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      company TEXT NOT NULL,
      role TEXT NOT NULL,
      start_date TEXT NOT NULL DEFAULT '',
      end_date TEXT NOT NULL DEFAULT '',
      tech_tags TEXT NOT NULL DEFAULT '[]',
      bullets TEXT NOT NULL DEFAULT '[]',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      subtitle TEXT NOT NULL DEFAULT '',
      category TEXT NOT NULL DEFAULT '',
      tech_tags TEXT NOT NULL DEFAULT '[]',
      bullets TEXT NOT NULL DEFAULT '[]',
      link_url TEXT NOT NULL DEFAULT '',
      featured INTEGER NOT NULL DEFAULT 0,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS skills (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      category TEXT NOT NULL,
      name TEXT NOT NULL,
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS education (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      degree TEXT NOT NULL,
      institution TEXT NOT NULL,
      start_year TEXT NOT NULL DEFAULT '',
      end_year TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      provider TEXT NOT NULL DEFAULT '',
      period TEXT NOT NULL DEFAULT '',
      sort_order INTEGER NOT NULL DEFAULT 0
    );
  `);
}

async function seedIfEmpty(db: Client) {
  const countResult = await db.execute("SELECT COUNT(*) as n FROM profile");
  const n = Number(countResult.rows[0]?.n ?? 0);
  if (n > 0) return;

  await db.execute({
    sql: `INSERT INTO profile (id, name, title, tagline, bio, location, email, phone, linkedin_url, github_url, resume_url)
          VALUES (1, :name, :title, :tagline, :bio, :location, :email, :phone, :linkedin_url, :github_url, :resume_url)`,
    args: {
      name: "Zyad Yhia Zakaria",
      title: "Full-Stack Software Engineer",
      tagline: "React · Laravel · ASP.NET Core",
      bio: "Full-stack software engineer with 6+ years across product companies, agencies, and embedded systems. Currently building HR products in React/TypeScript at JisrHR, with backend depth in PHP/Laravel and C#/ASP.NET Core (Web API, EF Core, Identity/JWT) gained through freelance and independent projects. Comfortable owning features end-to-end — from requirements and API design to UI, testing, and deployment.",
      location: "Cairo, Egypt",
      email: "zyad.yhia.sw@gmail.com",
      phone: "+2 (010) 0240 1163",
      linkedin_url: "https://linkedin.com/in/zyad-yhia",
      github_url: "https://github.com/ZyadYhia",
      resume_url: "",
    },
  });

  const experience = [
    {
      company: "JisrHR",
      role: "Software Engineer — React",
      start_date: "Jan 2025",
      end_date: "Present",
      tech_tags: ["React", "TypeScript"],
      bullets: [
        "Build and maintain the HR module front-end in React/TypeScript, driven by customer requirements and UI/UX designs.",
        "Integrate the front-end with backend services and contribute to API contract discussions.",
        "Assist in testing and quality assurance across the application.",
      ],
    },
    {
      company: "Coretech-x",
      role: "Full-Stack Developer — Vue.js / Quasar",
      start_date: "Jul 2024",
      end_date: "Jan 2025",
      tech_tags: ["Vue.js", "Quasar"],
      bullets: [
        "Built front-end applications with Quasar/Vue.js based on customer requirements.",
        "Handled customer communication, requirements gathering, and environment preparation.",
        "Assisted in software integration testing across modules.",
      ],
    },
    {
      company: "Methode Electronics",
      role: "Software Engineer — Embedded C / Testing",
      start_date: "Jul 2023",
      end_date: "Jul 2024",
      tech_tags: ["C", "Embedded", "Tessy"],
      bullets: [
        "Developed application-layer and ECU-layer modules to customer and project requirements.",
        "Wrote and executed unit and software-integration tests using Tessy.",
      ],
    },
    {
      company: "MilkDiamond",
      role: "Software Engineer — PHP / Laravel",
      start_date: "Feb 2022",
      end_date: "Jul 2023",
      tech_tags: ["PHP", "Laravel", "IoT"],
      bullets: [
        "Built an IoT platform ingesting and analysing livestock sensor data to support decision-making.",
        "Built a farm-management system for controlling animal and dairy production farms.",
      ],
    },
    {
      company: "Pintrue",
      role: "Full-Stack Developer — PHP / Laravel",
      start_date: "Jan 2021",
      end_date: "Feb 2022",
      tech_tags: ["PHP", "Laravel", "Symfony", "Fawry"],
      bullets: [
        "Developed ERP modules (accounting, inventory) and refactored legacy code in PHP/Symfony.",
        "Implemented in-app payments for a gaming product via the Fawry payment gateway.",
      ],
    },
    {
      company: "VTS",
      role: "Software Engineer — PHP / C",
      start_date: "Aug 2019",
      end_date: "Jan 2021",
      tech_tags: ["PHP", "C", "IoT"],
      bullets: [
        "Developed backend scripts and data-collection algorithms for IoT applications.",
        "Built interfaces for monitoring and controlling device data.",
      ],
    },
  ];
  for (const [i, e] of experience.entries()) {
    await db.execute({
      sql: `INSERT INTO experience (company, role, start_date, end_date, tech_tags, bullets, sort_order)
            VALUES (:company, :role, :start_date, :end_date, :tech_tags, :bullets, :sort_order)`,
      args: {
        company: e.company,
        role: e.role,
        start_date: e.start_date,
        end_date: e.end_date,
        tech_tags: JSON.stringify(e.tech_tags),
        bullets: JSON.stringify(e.bullets),
        sort_order: i,
      },
    });
  }

  const projects = [
    {
      title: "Automotive Services Platform",
      subtitle: "Freelance Full-Stack Developer",
      category: "ASP.NET Core",
      tech_tags: ["ASP.NET Core", "EF Core", "JWT", "Identity"],
      bullets: [
        "Multi-module platform serving car owners, built on ASP.NET Core Web API, EF Core, and role-based Identity/JWT auth across customer, vendor, and workshop-owner roles.",
        "Roadside assistance: real-time tracking of nearby tow trucks (winches) so drivers stranded on highways can locate and request the closest one.",
        "Multi-vendor e-commerce: marketplace specialised in car spare parts, with vendor storefronts, catalogues, and order management.",
        "Workshop management: customer-facing service booking plus owner tools for managing workshops and multiple branches.",
        "Inventory & invoicing: shared inventory linked to both workshops and the spare-parts marketplace, with an invoicing module for workshop services.",
      ],
      featured: 1,
    },
    {
      title: "Online Courses & Examination System",
      subtitle: "Independent Project",
      category: "ASP.NET Core",
      tech_tags: ["ASP.NET Core", "EF Core", "SQL", "JWT"],
      bullets: [
        "Course-categorisation and MCQ examination platform with strict exam integrity: single-attempt enforcement and active-session monitoring that invalidates the attempt if the candidate leaves the exam session.",
        "Data layer with EF Core + SQL; secured with Identity/JWT role-based access for admins, instructors, and students.",
      ],
      featured: 1,
    },
    {
      title: "Restaurant Management System",
      subtitle: "Independent Project",
      category: "ASP.NET Core",
      tech_tags: ["ASP.NET Core", "EF Core"],
      bullets: [
        "Order and delivery management system covering order lifecycle, kitchen workflow, and delivery assignment/tracking, on ASP.NET Core Web API + EF Core.",
      ],
      featured: 0,
    },
  ];
  for (const [i, p] of projects.entries()) {
    await db.execute({
      sql: `INSERT INTO projects (title, subtitle, category, tech_tags, bullets, link_url, featured, sort_order)
            VALUES (:title, :subtitle, :category, :tech_tags, :bullets, :link_url, :featured, :sort_order)`,
      args: {
        title: p.title,
        subtitle: p.subtitle,
        category: p.category,
        tech_tags: JSON.stringify(p.tech_tags),
        bullets: JSON.stringify(p.bullets),
        link_url: "",
        featured: p.featured,
        sort_order: i,
      },
    });
  }

  const skills: [string, string][] = [
    ["Frontend", "React / Next.js"],
    ["Frontend", "Vue.js / Quasar"],
    ["Frontend", "TypeScript"],
    ["Frontend", "JavaScript"],
    ["Frontend", "Redux / Zustand"],
    ["Frontend", "React Query"],
    ["Frontend", "Tailwind CSS"],
    ["Frontend", "Bootstrap"],
    ["Frontend", "ShadCN"],
    ["Frontend", "Sass/SCSS"],
    ["Backend", "PHP / Laravel"],
    ["Backend", "C# / ASP.NET Core"],
    ["Backend", "EF Core"],
    ["Backend", "Identity / JWT"],
    ["Backend", "Go / GORM"],
    ["Backend", "Inertia.js"],
    ["Backend", "WordPress"],
    ["Database", "MySQL"],
    ["Database", "SQL Server"],
    ["Database", "PostgreSQL"],
    ["Database", "SQLite"],
    ["Tools", "Git / GitHub"],
    ["Tools", "Docker"],
    ["Tools", "Jira"],
    ["Tools", "Mantis"],
  ];
  for (const [i, [category, name]] of skills.entries()) {
    await db.execute({
      sql: `INSERT INTO skills (category, name, sort_order) VALUES (:category, :name, :sort_order)`,
      args: { category, name, sort_order: i },
    });
  }

  await db.execute({
    sql: `INSERT INTO education (degree, institution, start_year, end_year, sort_order)
          VALUES (:degree, :institution, :start_year, :end_year, :sort_order)`,
    args: {
      degree: "B.Sc. Electrical & Communications Engineering",
      institution: "Higher Institute of Engineering and Technology, New Damietta",
      start_year: "2014",
      end_year: "2019",
      sort_order: 0,
    },
  });

  const certs: [string, string, string][] = [
    ["C# / ASP.NET Core", "Route Academy", "Sept – Dec 2024"],
    ["React", "Udemy (Maximilian Schwarzmüller)", "Jan – Feb 2025"],
    ["Vue.js", "Udemy", "Jun – Jul 2024"],
    ["Angular", "Route Academy", "2020"],
    ["PHP / Laravel", "Route Academy", "2020"],
    ["Go, Docker & Kubernetes", "Udemy", ""],
    ["Project Management & Risk Analysis", "Coursera / Google", ""],
  ];
  for (const [i, [name, provider, period]] of certs.entries()) {
    await db.execute({
      sql: `INSERT INTO certifications (name, provider, period, sort_order)
            VALUES (:name, :provider, :period, :sort_order)`,
      args: { name, provider, period, sort_order: i },
    });
  }
}

async function initConnection(): Promise<Client> {
  const db = createConnection();
  await migrate(db);
  await seedIfEmpty(db);
  return db;
}

export function getDb(): Promise<Client> {
  if (!global.__portfolioDbReady) {
    global.__portfolioDbReady = initConnection().then((db) => {
      global.__portfolioDb = db;
      return db;
    });
  }
  return global.__portfolioDbReady;
}
