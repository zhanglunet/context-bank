import test from "node:test";
import assert from "node:assert/strict";
const api = await import("../site/practice-tools.mjs").catch(() => ({}));
const install = {
  repository: "https://github.com/zhanglunet/livepowers",
  ref: "454fd2a0f882ada65f97392709872a71582596da",
  name: "outcome-ledger",
};
test("external install uses original skill name and pinned repository rather than bank id", () => {
  assert.equal(typeof api.installCommand, "function");
  assert.equal(
    api.installCommand(install, "codex"),
    "npx --yes skills@1.7.2 add https://github.com/zhanglunet/livepowers/tree/454fd2a0f882ada65f97392709872a71582596da --skill outcome-ledger --agent codex -y --copy",
  );
});
test("client selection changes only the supported installation target", () => {
  assert.equal(typeof api.installCommand, "function");
  assert.match(
    api.installCommand(install, "claude-code"),
    /--agent claude-code -y --copy$/,
  );
  assert.match(
    api.installCommand(install, "cursor"),
    /--agent cursor -y --copy$/,
  );
  assert.equal(api.installCommand(install, "workbuddy"), null);
});
test("installation rejects shell syntax and unpinned sources", () => {
  assert.equal(typeof api.installCommand, "function");
  for (const bad of [
    { ...install, name: "x;echo bad" },
    { ...install, ref: "main" },
    { ...install, repository: "https://github.com/zhanglunet/livepowers?x=1" },
  ])
    assert.throws(() => api.installCommand(bad, "codex"));
});
test("a passed synthetic execution is not promoted to another tool or installation scope", () => {
  assert.equal(typeof api.executionEvidence, "function");
  const records = [
    {
      id: "source-ledger",
      tool: "Codex CLI",
      scope: "synthetic-execution",
      status: "passed",
      report: "./evidence/2026-10-18/report.md",
    },
  ];
  assert.equal(
    api.executionEvidence("source-ledger", "Codex CLI", records).status,
    "passed",
  );
  assert.equal(api.executionEvidence("source-ledger", "Cursor", records), null);
  assert.equal(api.executionEvidence("other", "Codex CLI", records), null);
  assert.equal(
    api.executionEvidence("source-ledger", "Codex CLI", [
      { ...records[0], scope: "installation" },
    ]),
    null,
  );
});
test("task guides reject dangling and duplicate primary membership", () => {
  assert.equal(typeof api.validateGuides, "function");
  assert.doesNotThrow(() =>
    api.validateGuides(
      [{ id: "weekly", members: ["a"], recommended: ["a"] }],
      [{ id: "a" }],
    ),
  );
  assert.throws(() =>
    api.validateGuides(
      [{ id: "weekly", members: ["missing"], recommended: [] }],
      [{ id: "a" }],
    ),
  );
  assert.throws(() =>
    api.validateGuides(
      [
        { id: "one", members: ["a"], recommended: [] },
        { id: "two", members: ["a"], recommended: [] },
      ],
      [{ id: "a" }],
    ),
  );
});
