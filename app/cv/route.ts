import { getProfile } from "@/lib/queries";
import { isBlobCvUrl, readCv } from "@/lib/cv-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { resume_url: url } = await getProfile();
  if (!url || url === "/Zyad_Yhia_CV.pdf") {
    return new Response(null, {
      status: 307,
      headers: { Location: new URL("/Zyad_Yhia_CV.pdf", request.url).href, "Cache-Control": "no-store" },
    });
  }

  let body: BodyInit;
  if (isBlobCvUrl(url)) {
    const response = await fetch(url, { cache: "no-store", redirect: "error" });
    if (!response.ok || !response.body) return new Response("CV unavailable", { status: 502 });
    body = response.body;
  } else if (url.startsWith("/cv/")) {
    const pdf = await readCv(url.slice("/cv/".length));
    if (!pdf) return new Response("CV not found", { status: 404 });
    body = new Uint8Array(pdf);
  } else {
    return new Response("CV unavailable", { status: 404 });
  }

  return new Response(body, {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="Zyad_Yhia_CV.pdf"',
      "X-Content-Type-Options": "nosniff",
      "Cache-Control": "no-store",
    },
  });
}
