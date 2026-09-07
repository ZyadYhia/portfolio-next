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

function parseJsonArray(value: unknown): string[] {
  if (typeof value !== "string") return [];
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export async function getProfile(): Promise<Profile> {
  const db = await getDb();
  const result = await db.execute("SELECT * FROM profile WHERE id = 1");
  const row = result.rows[0] as unknown as Profile | undefined;
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

export async function getExperience(): Promise<Experience[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM experience ORDER BY sort_order ASC, id ASC"
  );
  return result.rows.map((r) => ({
    ...(r as unknown as Omit<Experience, "tech_tags" | "bullets">),
    tech_tags: parseJsonArray(r.tech_tags),
    bullets: parseJsonArray(r.bullets),
  }));
}

export async function getProjects(): Promise<Project[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM projects ORDER BY sort_order ASC, id ASC"
  );
  return result.rows.map((r) => ({
    ...(r as unknown as Omit<Project, "tech_tags" | "bullets" | "featured">),
    tech_tags: parseJsonArray(r.tech_tags),
    bullets: parseJsonArray(r.bullets),
    featured: !!r.featured,
  }));
}

export async function getSkills(): Promise<Skill[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM skills ORDER BY category ASC, sort_order ASC, id ASC"
  );
  return result.rows as unknown as Skill[];
}

export async function getSkillsByCategory(): Promise<Record<string, Skill[]>> {
  const skills = await getSkills();
  return skills.reduce<Record<string, Skill[]>>((acc, skill) => {
    (acc[skill.category] ??= []).push(skill);
    return acc;
  }, {});
}

export async function getEducation(): Promise<Education[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM education ORDER BY sort_order ASC, id ASC"
  );
  return result.rows as unknown as Education[];
}

export async function getCertifications(): Promise<Certification[]> {
  const db = await getDb();
  const result = await db.execute(
    "SELECT * FROM certifications ORDER BY sort_order ASC, id ASC"
  );
  return result.rows as unknown as Certification[];
}
