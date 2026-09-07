"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { timingSafeEqual } from "node:crypto";
import { getDb } from "@/lib/db";
import { COOKIE_NAME, createSessionToken } from "@/lib/session";

function safeEqual(a: string, b: string): boolean {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

function str(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function linesToArray(value: string): string[] {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function tagsToArray(value: string): string[] {
  return value
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

// ---------- Auth ----------

export async function login(_prevState: { error?: string } | undefined, formData: FormData) {
  const password = str(formData, "password");
  const expected = process.env.ADMIN_PASSWORD ?? "";

  if (!expected || !safeEqual(password, expected)) {
    return { error: "Incorrect password." };
  }

  const token = await createSessionToken();
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  redirect("/dashboard");
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAME);
  redirect("/dashboard/login");
}

// ---------- Profile ----------

export async function updateProfile(formData: FormData) {
  const db = getDb();
  db.prepare(
    `UPDATE profile SET name=@name, title=@title, tagline=@tagline, bio=@bio,
     location=@location, email=@email, phone=@phone,
     linkedin_url=@linkedin_url, github_url=@github_url, resume_url=@resume_url
     WHERE id = 1`
  ).run({
    name: str(formData, "name"),
    title: str(formData, "title"),
    tagline: str(formData, "tagline"),
    bio: str(formData, "bio"),
    location: str(formData, "location"),
    email: str(formData, "email"),
    phone: str(formData, "phone"),
    linkedin_url: str(formData, "linkedin_url"),
    github_url: str(formData, "github_url"),
    resume_url: str(formData, "resume_url"),
  });
  revalidatePath("/");
  revalidatePath("/dashboard/profile");
}

// ---------- Experience ----------

export async function upsertExperience(formData: FormData) {
  const db = getDb();
  const id = str(formData, "id");
  const data = {
    company: str(formData, "company"),
    role: str(formData, "role"),
    start_date: str(formData, "start_date"),
    end_date: str(formData, "end_date"),
    tech_tags: JSON.stringify(tagsToArray(str(formData, "tech_tags"))),
    bullets: JSON.stringify(linesToArray(str(formData, "bullets"))),
    sort_order: Number(str(formData, "sort_order")) || 0,
  };

  if (id) {
    db.prepare(
      `UPDATE experience SET company=@company, role=@role, start_date=@start_date,
       end_date=@end_date, tech_tags=@tech_tags, bullets=@bullets, sort_order=@sort_order
       WHERE id = @id`
    ).run({ ...data, id });
  } else if (data.company) {
    db.prepare(
      `INSERT INTO experience (company, role, start_date, end_date, tech_tags, bullets, sort_order)
       VALUES (@company, @role, @start_date, @end_date, @tech_tags, @bullets, @sort_order)`
    ).run(data);
  }
  revalidatePath("/");
  revalidatePath("/dashboard/experience");
}

export async function deleteExperience(formData: FormData) {
  const db = getDb();
  db.prepare("DELETE FROM experience WHERE id = ?").run(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/dashboard/experience");
}

// ---------- Projects ----------

export async function upsertProject(formData: FormData) {
  const db = getDb();
  const id = str(formData, "id");
  const data = {
    title: str(formData, "title"),
    subtitle: str(formData, "subtitle"),
    category: str(formData, "category"),
    tech_tags: JSON.stringify(tagsToArray(str(formData, "tech_tags"))),
    bullets: JSON.stringify(linesToArray(str(formData, "bullets"))),
    link_url: str(formData, "link_url"),
    featured: formData.get("featured") ? 1 : 0,
    sort_order: Number(str(formData, "sort_order")) || 0,
  };

  if (id) {
    db.prepare(
      `UPDATE projects SET title=@title, subtitle=@subtitle, category=@category,
       tech_tags=@tech_tags, bullets=@bullets, link_url=@link_url,
       featured=@featured, sort_order=@sort_order WHERE id = @id`
    ).run({ ...data, id });
  } else if (data.title) {
    db.prepare(
      `INSERT INTO projects (title, subtitle, category, tech_tags, bullets, link_url, featured, sort_order)
       VALUES (@title, @subtitle, @category, @tech_tags, @bullets, @link_url, @featured, @sort_order)`
    ).run(data);
  }
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

export async function deleteProject(formData: FormData) {
  const db = getDb();
  db.prepare("DELETE FROM projects WHERE id = ?").run(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/dashboard/projects");
}

// ---------- Skills ----------

export async function upsertSkill(formData: FormData) {
  const db = getDb();
  const id = str(formData, "id");
  const data = {
    category: str(formData, "category"),
    name: str(formData, "name"),
    sort_order: Number(str(formData, "sort_order")) || 0,
  };

  if (id) {
    db.prepare(
      `UPDATE skills SET category=@category, name=@name, sort_order=@sort_order WHERE id = @id`
    ).run({ ...data, id });
  } else if (data.name && data.category) {
    db.prepare(
      `INSERT INTO skills (category, name, sort_order) VALUES (@category, @name, @sort_order)`
    ).run(data);
  }
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

export async function deleteSkill(formData: FormData) {
  const db = getDb();
  db.prepare("DELETE FROM skills WHERE id = ?").run(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/dashboard/skills");
}

// ---------- Education ----------

export async function upsertEducation(formData: FormData) {
  const db = getDb();
  const id = str(formData, "id");
  const data = {
    degree: str(formData, "degree"),
    institution: str(formData, "institution"),
    start_year: str(formData, "start_year"),
    end_year: str(formData, "end_year"),
    sort_order: Number(str(formData, "sort_order")) || 0,
  };

  if (id) {
    db.prepare(
      `UPDATE education SET degree=@degree, institution=@institution,
       start_year=@start_year, end_year=@end_year, sort_order=@sort_order WHERE id = @id`
    ).run({ ...data, id });
  } else if (data.degree) {
    db.prepare(
      `INSERT INTO education (degree, institution, start_year, end_year, sort_order)
       VALUES (@degree, @institution, @start_year, @end_year, @sort_order)`
    ).run(data);
  }
  revalidatePath("/");
  revalidatePath("/dashboard/education");
}

export async function deleteEducation(formData: FormData) {
  const db = getDb();
  db.prepare("DELETE FROM education WHERE id = ?").run(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/dashboard/education");
}

// ---------- Certifications ----------

export async function upsertCertification(formData: FormData) {
  const db = getDb();
  const id = str(formData, "id");
  const data = {
    name: str(formData, "name"),
    provider: str(formData, "provider"),
    period: str(formData, "period"),
    sort_order: Number(str(formData, "sort_order")) || 0,
  };

  if (id) {
    db.prepare(
      `UPDATE certifications SET name=@name, provider=@provider,
       period=@period, sort_order=@sort_order WHERE id = @id`
    ).run({ ...data, id });
  } else if (data.name) {
    db.prepare(
      `INSERT INTO certifications (name, provider, period, sort_order)
       VALUES (@name, @provider, @period, @sort_order)`
    ).run(data);
  }
  revalidatePath("/");
  revalidatePath("/dashboard/education");
}

export async function deleteCertification(formData: FormData) {
  const db = getDb();
  db.prepare("DELETE FROM certifications WHERE id = ?").run(str(formData, "id"));
  revalidatePath("/");
  revalidatePath("/dashboard/education");
}
