import { getProfile } from "@/lib/queries";
import { updateProfile } from "../../actions";
import CvUpload from "@/components/dashboard/CvUpload";

export const dynamic = "force-dynamic";

const inputClass =
  "w-full rounded-md border border-(--color-border) bg-black/30 px-3 py-2 text-sm text-foreground outline-none focus:border-(--color-amber)";
const labelClass = "text-xs uppercase tracking-wide text-(--color-muted)";

export default async function ProfilePage() {
  const profile = await getProfile();

  return (
    <div className="max-w-2xl">
      <h1 className="font-display text-2xl font-bold">Profile</h1>
      <p className="mt-1 text-sm text-(--color-muted)">
        This information powers the hero section and contact links.
      </p>

      <form action={updateProfile} className="mt-8 space-y-5">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="name">Name</label>
            <input id="name" name="name" defaultValue={profile.name} className={inputClass} required />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="title">Title</label>
            <input id="title" name="title" defaultValue={profile.title} className={inputClass} required />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="tagline">Tagline</label>
          <input id="tagline" name="tagline" defaultValue={profile.tagline} className={inputClass} />
        </div>

        <div className="space-y-1.5">
          <label className={labelClass} htmlFor="bio">Bio</label>
          <textarea id="bio" name="bio" defaultValue={profile.bio} rows={5} className={inputClass} />
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="location">Location</label>
            <input id="location" name="location" defaultValue={profile.location} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="email">Email</label>
            <input id="email" name="email" type="email" defaultValue={profile.email} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="phone">Phone</label>
            <input id="phone" name="phone" defaultValue={profile.phone} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="linkedin_url">LinkedIn URL</label>
            <input id="linkedin_url" name="linkedin_url" defaultValue={profile.linkedin_url} className={inputClass} />
          </div>
          <div className="space-y-1.5">
            <label className={labelClass} htmlFor="github_url">GitHub URL</label>
            <input id="github_url" name="github_url" defaultValue={profile.github_url} className={inputClass} />
          </div>
        </div>

        <button
          type="submit"
          className="rounded-md bg-(--color-amber) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90"
        >
          Save changes
        </button>
      </form>
      <CvUpload />
    </div>
  );
}
