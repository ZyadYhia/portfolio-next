import { randomUUID } from "node:crypto";
import { mkdir, readFile, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { put, del } from "@vercel/blob";

export const MAX_CV_BYTES = 3 * 1024 * 1024;
const filenamePattern = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}\.pdf$/;

function storageDirectory() {
  return process.env.CV_STORAGE_DIR || path.join(process.cwd(), "data", "cv");
}

export function validateCv(file: File, bytes: Uint8Array): string | undefined {
  if (!file.name.toLowerCase().endsWith(".pdf")) return "Please choose a PDF file.";
  if (file.size === 0) return "The PDF is empty.";
  if (file.size > MAX_CV_BYTES) return "The PDF must be 3 MB or smaller.";
  if (Buffer.from(bytes.subarray(0, 5)).toString("ascii") !== "%PDF-") {
    return "The selected file is not a PDF.";
  }
}

export async function saveCv(bytes: Uint8Array): Promise<string> {
  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(`cv/${randomUUID()}.pdf`, Buffer.from(bytes), {
      access: "public",
      contentType: "application/pdf",
    });
    return blob.url;
  }
  if (process.env.VERCEL) {
    throw new Error("CV uploads require persistent storage; configure object storage before using Vercel.");
  }
  await mkdir(storageDirectory(), { recursive: true });
  const filename = `${randomUUID()}.pdf`;
  await writeFile(path.join(storageDirectory(), filename), bytes, { flag: "wx" });
  return `/cv/${filename}`;
}

export async function readCv(filename: string): Promise<Buffer | null> {
  if (!filenamePattern.test(filename)) return null;
  try {
    return await readFile(path.join(storageDirectory(), filename));
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw error;
  }
}

export async function discardCv(url: string): Promise<void> {
  if (isBlobCvUrl(url)) {
    await del(url);
    return;
  }
  const filename = url.slice("/cv/".length);
  if (!url.startsWith("/cv/") || !filenamePattern.test(filename)) return;
  await unlink(path.join(storageDirectory(), filename));
}

export function isBlobCvUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && url.hostname.endsWith(".public.blob.vercel-storage.com")
      && !url.username && !url.password && !url.port && url.pathname.startsWith("/cv/");
  } catch {
    return false;
  }
}
