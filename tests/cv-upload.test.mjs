import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { createRequire } from "node:module";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const require = createRequire(import.meta.url);
const source = ts.transpileModule(readFileSync(new URL("../app/dashboard/actions.ts", import.meta.url), "utf8"), {
  compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
}).outputText;

function actionHarness({ authenticated = true, databaseFailure = false } = {}) {
  const events = [];
  const exports = {};
  const mocks = {
    "next/headers": { cookies: async () => ({ get: () => ({ value: "session" }) }) },
    "next/navigation": { redirect: () => { throw new Error("redirect"); } },
    "next/cache": { revalidatePath: (path) => events.push(["revalidate", path]) },
    "@/lib/session": { COOKIE_NAME: "session", verifySessionToken: async () => authenticated },
    "@/lib/db": { getDb: async () => ({ execute: async (query) => {
      events.push(["database", query]);
      if (databaseFailure) throw new Error("database offline");
      return { rowsAffected: 1 };
    } }) },
    "@/lib/cv-storage": {
      MAX_CV_BYTES: 3 * 1024 * 1024,
      validateCv: () => undefined,
      saveCv: async () => { events.push(["save"]); return "/cv/new.pdf"; },
      discardCv: async (url) => events.push(["discard", url]),
    },
  };
  vm.runInNewContext(source, {
    exports, require: (id) => mocks[id] || require(id),
    File, Buffer, Uint8Array, process: { env: {} }, console: { error() {} },
  });
  return { upload: exports.uploadCv, events };
}

function form() {
  const data = new FormData();
  data.set("cv", new File(["%PDF-1.7\nexample"], "cv.pdf"));
  return data;
}

test("upload rejects unauthenticated callers before touching storage", async () => {
  const { upload, events } = actionHarness({ authenticated: false });
  assert.match((await upload({}, form())).error, /session/);
  assert.equal(events.length, 0);
});

test("successful upload saves the file before updating only the CV pointer", async () => {
  const { upload, events } = actionHarness();
  assert.match((await upload({}, form())).success, /uploaded/);
  assert.equal(events[0][0], "save");
  assert.equal(events[1][0], "database");
  assert.match(events[1][1].sql, /UPDATE profile SET resume_url/);
  assert.equal(events[1][1].args[0], "/cv/new.pdf");
  assert.deepEqual(events.slice(2).map((e) => e[1]), ["/", "/dashboard/profile"]);
});

test("database failure cleans up only the newly uploaded file", async () => {
  const { upload, events } = actionHarness({ databaseFailure: true });
  assert.match((await upload({}, form())).error, /Could not save/);
  assert.deepEqual(events.at(-1), ["discard", "/cv/new.pdf"]);
  assert.equal(events.some((e) => e[0] === "revalidate"), false);
});
