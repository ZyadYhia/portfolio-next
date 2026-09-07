import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Skills from "@/components/Skills";
import Experience from "@/components/Experience";
import Projects from "@/components/Projects";
import Education from "@/components/Education";
import Contact from "@/components/Contact";
import Footer from "@/components/Footer";
import {
  getProfile,
  getExperience,
  getProjects,
  getSkillsByCategory,
  getEducation,
  getCertifications,
} from "@/lib/queries";

// The database can be edited at any time from /dashboard, so this page
// always reads fresh data instead of being statically cached.
export const dynamic = "force-dynamic";

export default async function Home() {
  const [profile, experience, projects, skillsByCategory, education, certifications] =
    await Promise.all([
      getProfile(),
      getExperience(),
      getProjects(),
      getSkillsByCategory(),
      getEducation(),
      getCertifications(),
    ]);

  return (
    <>
      <Nav name={profile.name} />
      <main className="flex-1">
        <Hero profile={profile} />
        <Experience items={experience} />
        <Projects items={projects} />
        <Skills skillsByCategory={skillsByCategory} />
        <Education education={education} certifications={certifications} />
        <Contact profile={profile} />
      </main>
      <Footer name={profile.name} />
    </>
  );
}
