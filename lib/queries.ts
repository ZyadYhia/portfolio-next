import { getDb } from "./db";

export type Profile = {
  id: number;
  name: string;
  title: string;
  tagline: string;
  bio: string;
  location: string;
  email: string;
  phone: string;
  linkedin_url: string;
  github_url: string;
  resume_url: string;
};

export type Experience = {
  id: number;
  company: string;
  role: string;
  start_date: string;
  end_date: string;
  tech_tags: string[];
  bullets: string[];
  sort_order: number;
};

export type Project = {
  id: number;
  title: string;
  subtitle: string;
  category: string;
  tech_tags: string[];
  bullets: string[];
  link_url: string;
  featured: boolean;
  sort_order: number;
};

export type Skill = {
  id: number;
  category: string;
  name: string;
  sort_order: number;
};

export type Education = {
  id: number;
  degree: string;
  institution: string;
  start_year: string;
  end_year: string;
  sort_order: number;
};

export type Certification = {
  id: number;
  name: string;
  provider: string;
  period: string;
  sort_order: number;
};

function parseJsonArray(value: string): string[] {
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function getProfile(): Profile {
  const db = getDb();
  const row = db.prepare("SELECT * FROM profile WHERE id = 1").get() as
    | Profile
    | undefined;
  return (
    row ?? {
      id: 1,
      name: "",
      title: "",
      tagline: "",
      bio: "",
      location: "",
      email: "",
      phone: "",
      linkedin_url: "",
      github_url: "",
      resume_url: "",
    }
  );
}

export function getExperience(): Experience[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM experience ORDER BY sort_order ASC, id ASC")
    .all() as Array<Omit<Experience, "tech_tags" | "bullets"> & {
    tech_tags: string;
    bullets: string;
  }>;
  return rows.map((r) => ({
    ...r,
    tech_tags: parseJsonArray(r.tech_tags),
    bullets: parseJsonArray(r.bullets),
  }));
}

export function getProjects(): Project[] {
  const db = getDb();
  const rows = db
    .prepare("SELECT * FROM projects ORDER BY sort_order ASC, id ASC")
    .all() as Array<
    Omit<Project, "tech_tags" | "bullets" | "featured"> & {
      tech_tags: string;
      bullets: string;
      featured: number;
    }
  >;
  return rows.map((r) => ({
    ...r,
    tech_tags: parseJsonArray(r.tech_tags),
    bullets: parseJsonArray(r.bullets),
    featured: !!r.featured,
  }));
}

export function getSkills(): Skill[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM skills ORDER BY category ASC, sort_order ASC, id ASC")
    .all() as Skill[];
}

export function getSkillsByCategory(): Record<string, Skill[]> {
  const skills = getSkills();
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});
}

export function getEducation(): Education[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM education ORDER BY sort_order ASC, id ASC")
    .all() as Education[];
}

export function getCertifications(): Certification[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM certifications ORDER BY sort_order ASC, id ASC")
    .all() as Certification[];
}
