import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { test } from "node:test";
import { validateCv, MAX_CV_BYTES, saveCv, readCv, discardCv, isBlobCvUrl } from "../lib/cv-storage.ts";

test("CV validation rejects non-PDF content and oversized files", () => {
  const pdf = Buffer.from("%PDF-1.7\nexample");
  assert.equal(validateCv(new File([pdf], "cv.pdf"), pdf), undefined);
  assert.match(validateCv(new File([pdf], "cv.html"), pdf), /PDF/);
  assert.match(validateCv(new File(["<html>"], "cv.pdf"), Buffer.from("<html>")), /not a PDF/);
  assert.match(validateCv(new File([], "cv.pdf"), new Uint8Array()), /empty/);
  assert.match(validateCv(new File([new Uint8Array(MAX_CV_BYTES + 1)], "cv.pdf"), pdf), /3 MB/);
});

test("only public Blob CV URLs are eligible for remote download", () => {
  assert.equal(isBlobCvUrl("https://store.public.blob.vercel-storage.com/cv/file.pdf"), true);
  for (const url of ["http://store.public.blob.vercel-storage.com/cv/file.pdf", "https://example.com/cv/file.pdf", "https://store.public.blob.vercel-storage.com.evil.test/cv/file.pdf", "https://user:pass@store.public.blob.vercel-storage.com/cv/file.pdf", "file:///etc/passwd"]) {
    assert.equal(isBlobCvUrl(url), false);
  }
});

test("local uploads round-trip, remain distinct, and reject traversal", async () => {
  const directory = await mkdtemp(path.join(os.tmpdir(), "portfolio-cv-test-"));
  const previous = { dir: process.env.CV_STORAGE_DIR, token: process.env.BLOB_READ_WRITE_TOKEN, vercel: process.env.VERCEL };
  process.env.CV_STORAGE_DIR = directory;
  delete process.env.BLOB_READ_WRITE_TOKEN;
  delete process.env.VERCEL;
  try {
    const first = Buffer.from("%PDF-1.7\nfirst");
    const second = Buffer.from("%PDF-1.7\nsecond");
    const firstUrl = await saveCv(first);
    const secondUrl = await saveCv(second);
    assert.notEqual(firstUrl, secondUrl);
    assert.deepEqual(await readCv(firstUrl.slice(4)), first);
    assert.deepEqual(await readCv(secondUrl.slice(4)), second);
    assert.equal(await readCv("../../etc/passwd"), null);
    await discardCv(secondUrl);
    assert.equal(await readCv(secondUrl.slice(4)), null);
    assert.deepEqual(await readCv(firstUrl.slice(4)), first);
    process.env.VERCEL = "1";
    await assert.rejects(saveCv(second), /persistent storage/);
  } finally {
    for (const [key, value] of [["CV_STORAGE_DIR", previous.dir], ["BLOB_READ_WRITE_TOKEN", previous.token], ["VERCEL", previous.vercel]]) {
      if (value === undefined) delete process.env[key];
      else process.env[key] = value;
    }
    await rm(directory, { recursive: true, force: true });
  }
});
