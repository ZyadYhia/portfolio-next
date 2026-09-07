import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";

// Uses Node's built-in `node:sqlite` (stable since Node 22) instead of a
// native npm package like better-sqlite3. That avoids shipping a
// platform-specific compiled binary — which matters here because this repo
// is edited from a sandboxed Linux environment but runs on macOS: an
// npm-installed native module would be built for the wrong OS/architecture
// and crash the process the moment it's loaded. node:sqlite ships inside
// the Node binary itself, so it always matches the platform it runs on.

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "portfolio.db");

declare global {
  // eslint-disable-next-line no-var
  var __portfolioDb: DatabaseSync | undefined;
}

function createConnection() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA foreign_keys = ON");
  migrate(db);
  seedIfEmpty(db);
  return db;
}

function migrate(db: DatabaseSync) {
  db.exec(`
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

function seedIfEmpty(db: DatabaseSync) {
  const row = db.prepare("SELECT COUNT(*) as n FROM profile").get() as {
    n: number;
  };
  if (row.n > 0) return;

  const insertProfile = db.prepare(`
    INSERT INTO profile (id, name, title, tagline, bio, location, email, phone, linkedin_url, github_url, resume_url)
    VALUES (1, @name, @title, @tagline, @bio, @location, @email, @phone, @linkedin_url, @github_url, @resume_url)
  `);
  insertProfile.run({
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
  });

  const insertExperience = db.prepare(`
    INSERT INTO experience (company, role, start_date, end_date, tech_tags, bullets, sort_order)
    VALUES (@company, @role, @start_date, @end_date, @tech_tags, @bullets, @sort_order)
  `);
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
  experience.forEach((e, i) =>
    insertExperience.run({
      ...e,
      tech_tags: JSON.stringify(e.tech_tags),
      bullets: JSON.stringify(e.bullets),
      sort_order: i,
    })
  );

  const insertProject = db.prepare(`
    INSERT INTO projects (title, subtitle, category, tech_tags, bullets, link_url, featured, sort_order)
    VALUES (@title, @subtitle, @category, @tech_tags, @bullets, @link_url, @featured, @sort_order)
  `);
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
  projects.forEach((p, i) =>
    insertProject.run({
      ...p,
      tech_tags: JSON.stringify(p.tech_tags),
      bullets: JSON.stringify(p.bullets),
      link_url: "",
      sort_order: i,
    })
  );

  const insertSkill = db.prepare(`
    INSERT INTO skills (category, name, sort_order) VALUES (@category, @name, @sort_order)
  `);
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
  skills.forEach(([category, name], i) =>
    insertSkill.run({ category, name, sort_order: i })
  );

  const insertEducation = db.prepare(`
    INSERT INTO education (degree, institution, start_year, end_year, sort_order)
    VALUES (@degree, @institution, @start_year, @end_year, @sort_order)
  `);
  insertEducation.run({
    degree: "B.Sc. Electrical & Communications Engineering",
    institution: "Higher Institute of Engineering and Technology, New Damietta",
    start_year: "2014",
    end_year: "2019",
    sort_order: 0,
  });

  const insertCert = db.prepare(`
    INSERT INTO certifications (name, provider, period, sort_order)
    VALUES (@name, @provider, @period, @sort_order)
  `);
  const certs: [string, string, string][] = [
    ["C# / ASP.NET Core", "Route Academy", "Sept – Dec 2024"],
    ["React", "Udemy (Maximilian Schwarzmüller)", "Jan – Feb 2025"],
    ["Vue.js", "Udemy", "Jun – Jul 2024"],
    ["Angular", "Route Academy", "2020"],
    ["PHP / Laravel", "Route Academy", "2020"],
    ["Go, Docker & Kubernetes", "Udemy", ""],
    ["Project Management & Risk Analysis", "Coursera / Google", ""],
  ];
  certs.forEach(([name, provider, period], i) =>
    insertCert.run({ name, provider, period, sort_order: i })
  );
}

export function getDb() {
  if (!global.__portfolioDb) {
    global.__portfolioDb = createConnection();
  }
  return global.__portfolioDb;
}
