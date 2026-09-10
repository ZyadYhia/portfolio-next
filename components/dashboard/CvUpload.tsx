"use client";

import { useActionState } from "react";
import { uploadCv } from "@/app/dashboard/actions";

export default function CvUpload() {
  const [state, action, pending] = useActionState(uploadCv, { error: "", success: "" });

  return (
    <section className="mt-10 border-t border-(--color-border) pt-8">
      <h2 className="font-display text-lg font-bold">Your CV</h2>
      <p id="cv-help" className="mt-2 text-sm text-(--color-muted)">
        Upload a PDF up to 3 MB. Visitors will download your latest uploaded CV.
      </p>
      <a
        href="/cv"
        download="Zyad_Yhia_CV.pdf"
        className="mt-3 inline-block text-sm text-(--color-teal) underline underline-offset-4"
      >
        Download current CV
      </a>
      <form action={action} className="mt-5 space-y-4" onSubmit={(event) => {
        const input = event.currentTarget.elements.namedItem("cv") as HTMLInputElement;
        const file = input.files?.[0];
        if (file && file.size > 3 * 1024 * 1024) {
          event.preventDefault();
          input.setCustomValidity("The PDF must be 3 MB or smaller.");
          input.reportValidity();
        }
      }}>
        <label htmlFor="cv" className="block text-sm">Choose a new CV</label>
        <input
          id="cv"
          name="cv"
          type="file"
          accept=".pdf,application/pdf"
          required
          disabled={pending}
          aria-describedby="cv-help"
          onChange={(event) => event.currentTarget.setCustomValidity("")}
          className="block w-full rounded-md border border-(--color-border) bg-black/30 p-3 text-sm file:mr-4 file:rounded file:border-0 file:bg-(--color-surface-2) file:px-3 file:py-2 file:text-foreground"
        />
        <button type="submit" disabled={pending} className="rounded-md bg-(--color-amber) px-5 py-2.5 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-wait disabled:opacity-50">
          {pending ? "Uploading…" : "Upload CV"}
        </button>
        {state.error ? <p role="alert" className="text-sm text-red-400">{state.error}</p> : null}
        {state.success ? <p role="status" className="text-sm text-(--color-teal)">{state.success}</p> : null}
      </form>
    </section>
  );
}
