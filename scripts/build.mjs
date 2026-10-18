import {
  readdir,
  readFile,
  writeFile,
  mkdir,
  cp,
  rm,
  lstat,
} from "node:fs/promises";
import { parseDocument, validate, safePath, escape } from "./content.mjs";
import { createHash } from "node:crypto";
import { installCommand, validateGuides } from "../site/practice-tools.mjs";
const skillEditorial = JSON.parse(
  await readFile("editorial/skills.json", "utf8"),
);
const evidence = JSON.parse(await readFile("editorial/evidence.json", "utf8"));
const guides = JSON.parse(await readFile("editorial/paths.json", "utf8"));
const root = process.cwd(),
  entries = [],
  seen = new Set(),
  licenseCache = new Map();
async function sourceLicense(repo, ref) {
  const key = repo + "@" + ref;
  if (!licenseCache.has(key)) {
    const r = await fetch(
      `https://raw.githubusercontent.com${repo}/${ref}/LICENSE`,
      { signal: AbortSignal.timeout(10000), redirect: "error" },
    );
    if (!r.ok) throw Error("Source license unavailable " + key);
    const reader = r.body.getReader();
    let size = 0,
      chunks = [];
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      size += value.length;
      if (size > 100_000) {
        await reader.cancel();
        throw Error("License too large");
      }
      chunks.push(value);
    }
    licenseCache.set(key, Buffer.concat(chunks).toString("utf8"));
  }
  return licenseCache.get(key);
}
async function walk(dir) {
  let out = [];
  let names;
  try {
    names = await readdir(dir);
  } catch (e) {
    if (e.code === "ENOENT" && dir === "registry") return [];
    throw e;
  }
  for (const name of names) {
    if (name === ".gitkeep") continue;
    const path = `${dir}/${name}`;
    const info = await lstat(path);
    if (info.isSymbolicLink()) throw Error("Symlinks not allowed");
    if (info.isDirectory()) out.push(...(await walk(path)));
    else out.push(path);
  }
  return out;
}
function add(meta, body, raw, file, source) {
  validate(meta, body);
  if (seen.has(meta.id)) throw Error("Duplicate id " + meta.id);
  seen.add(meta.id);
  entries.push({ meta, body, raw, file, source });
}
for (const dir of ["content", "skills"])
  for (const file of await walk(dir)) {
    if (file === "content/LICENSE.md") continue;
    if (!file.endsWith(".md"))
      throw Error("Content directories accept Markdown only");
    const raw = await readFile(file, "utf8");
    const { meta, body } = parseDocument(raw);
    add(
      meta,
      body,
      raw,
      file,
      `https://github.com/zhanglunet/context-bank/blob/main/${file}`,
    );
  }
for (const file of await walk("registry")) {
  if (!file.endsWith(".json")) throw Error("Registry accepts JSON only");
  const r = JSON.parse(await readFile(file, "utf8"));
  if (
    r.schema_version !== 1 ||
    !["skill", "note", "workflow"].includes(r.type) ||
    !/^[a-f0-9]{40}$/.test(r.ref) ||
    !r.license ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(r.id)
  )
    throw Error("Invalid registry " + file);
  const u = new URL(r.repository);
  if (
    u.protocol !== "https:" ||
    u.hostname !== "github.com" ||
    u.username ||
    u.password ||
    u.search ||
    u.hash ||
    !/^\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+\/?$/.test(u.pathname)
  )
    throw Error("GitHub public source only");
  safePath(r.path);
  const repo = u.pathname.replace(/\/$/, "");
  const rawUrl = `https://raw.githubusercontent.com${repo}/${r.ref}/${r.path.split("/").map(encodeURIComponent).join("/")}`;
  const response = await fetch(rawUrl, {
    signal: AbortSignal.timeout(10000),
    redirect: "error",
  });
  if (!response.ok)
    throw Error("Source unavailable " + file + " " + response.status);
  const reader = response.body.getReader();
  let size = 0,
    chunks = [];
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 100_000) {
      await reader.cancel();
      throw Error("Source too large");
    }
    chunks.push(value);
  }
  const raw = Buffer.concat(chunks).toString("utf8");
  const parsed = parseDocument(raw);
  const m = parsed.meta;
  const meta = {
    ...m,
    schema_version: 1,
    id: r.id,
    type: r.type,
    title: r.title ?? m.title ?? m.name,
    summary: r.summary ?? m.summary ?? m.description,
    scenarios: r.scenarios ?? m.scenarios ?? ["其他"],
    author: m.author || repo.split("/")[1],
    license: r.license,
    compatibility: r.compatibility ??
      m.compatibility ?? [{ tool: "见来源文档", verification: "unverified" }],
    usage_notes: r.usage_notes ?? "",
  };
  if (typeof meta.usage_notes !== "string") throw Error("Invalid usage notes");
  const source = `${u.origin}${repo}/blob/${r.ref}/${r.path}`;
  const license = await sourceLicense(repo, r.ref);
  const download =
    raw +
    "\n\n---\n\n## 上下文银行收录信息\n\n来源：" +
    source +
    "\n\n许可：" +
    r.license +
    "；原文以上方来源为准。收录仅做静态索引，未执行技能。\n\n" +
    (meta.usage_notes || "使用前检查来源仓库的依赖与权限。") +
    "\n\n### 原始许可证全文\n\n" +
    license;
  add(meta, parsed.body, download, file, source);
}
console.log(
  `Validated ${entries.length} methods (${entries.filter((x) => x.meta.type === "skill").length} skills)`,
);
if (process.argv.includes("--validate")) process.exit(0);
await rm("dist", { recursive: true, force: true });
await mkdir("dist", { recursive: true });
await cp("site", "dist", { recursive: true });
const section = (body, name) =>
  body
    .match(new RegExp("## " + name + "\\n([\\s\\S]*?)(?=\\n## |$)"))?.[1]
    .trim() || "";
const catalog = [];
for (const e of entries) {
  const { meta: m, body, raw, source } = e;
  const p = {
    id: m.id,
    type: { skill: "Skill", note: "经验", workflow: "工作流" }[m.type],
    title: m.title,
    summary: m.summary,
    tag: m.scenarios[0],
    author: m.author,
    license: m.license,
    date: m.updated_at || "未声明",
    tools: m.compatibility.map((x) => x.tool).join("；"),
    goal: section(body, "适用任务") || m.summary,
    input: section(body, "输入"),
    body: section(body, "步骤") || body,
    sample:
      section(body, "合成示例") || "请在合成或获准使用的材料上试用并检查结果。",
    copy:
      m.type === "skill"
        ? `npx skills add zhanglunet/context-bank --skill ${m.id}`
        : section(body, "提示词") || body,
    limit: [section(body, "限制") || section(body, "边界"), m.usage_notes]
      .filter(Boolean)
      .join("\n\n"),
    sourceUrl: source,
  };
  if (m.type === "skill") {
    p.installation = skillEditorial[m.id] || null;
    if (p.installation) {
      if (p.installation.name !== m.name)
        throw Error("Installation name mismatch " + m.id);
      if (
        e.file.startsWith("registry/") &&
        !source.startsWith(
          p.installation.repository + "/blob/" + p.installation.ref + "/",
        )
      )
        throw Error("Installation source mismatch " + m.id);
      p.copy = installCommand(p.installation, "codex");
      p.input = p.input || p.installation.dependencies.join("\n");
      p.startPrompt = p.installation.startPrompt;
    } else p.copy = "尚未提供经核对的安装命令，请查看来源说明。";
  }
  p.evidence = evidence.filter((x) => x.id === m.id);
  p.topicId = guides.find((g) => g.members.includes(m.id))?.id;
  catalog.push(p);
  await mkdir(`dist/downloads`, { recursive: true });
  await writeFile(
    `dist/downloads/${m.id}.md`,
    raw +
      (p.installation
        ? "\n\n## 上下文银行安装与使用\n\n项目内安装（Codex；其他工具在网页切换）：\n\n```sh\n" +
          p.copy +
          "\n```\n\n依赖：\n" +
          p.installation.dependencies.map((v) => "- " + v).join("\n") +
          "\n\n装好后交给AI的任务：\n" +
          p.startPrompt +
          "\n\n验证范围：" +
          (p.evidence.length
            ? p.evidence.map((e) => e.tool + "：" + e.detail).join("；")
            : "尚未做执行验证。") +
          "\n测试记录：https://context.zhanglu.net/evidence/2026-10-18/report.html\n"
        : ""),
  );
  await mkdir(`dist/practice/${m.id}`, { recursive: true });
  await writeFile(
    `dist/practice/${m.id}/index.html`,
    `<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${escape(m.title)} · 上下文银行</title><link rel="stylesheet" href="../../style.css"><main class="wrap"><p><a href="../../index.html#practice/${m.id}">打开交互详情</a> · <a href="../../">返回目录</a></p><h1>${escape(m.title)}</h1><p>${escape(m.summary)}</p><p>作者：${escape(m.author)} · 许可：${escape(m.license)} · ${p.evidence.length ? "合成用例通过，范围见测试记录" : "尚未做执行验证"}</p>${p.installation ? `<h2>安装到Codex项目</h2><pre>${escape(p.copy)}</pre><h2>依赖与使用</h2><ul>${p.installation.dependencies.map((x) => `<li>${escape(x)}</li>`).join("")}</ul><pre>${escape(p.startPrompt)}</pre>` : ""}${p.evidence.map((e) => `<p>${escape(e.tool)}：${escape(e.detail)} <a href="../../evidence/2026-10-18/report.html">查看测试证据</a></p>`).join("")}<details><summary>查看完整原文</summary><pre>${escape(body)}</pre></details><p><a href="../../downloads/${m.id}.md" download>下载原文</a> · <a href="${escape(source)}" rel="noopener noreferrer">查看来源</a></p></main></html>`,
  );
}
validateGuides(guides, catalog);
await writeFile(
  "dist/paths.mjs",
  "export const paths=" + JSON.stringify(guides) + ";",
);
await writeFile("dist/paths.json", JSON.stringify(guides, null, 2));
for (const g of guides) {
  const md =
    "# " +
    g.title +
    "\n\n" +
    g.intro +
    "\n\n## 适合谁\n" +
    g.audience +
    "\n\n## 要交付什么\n" +
    g.outcome +
    "\n\n" +
    g.steps
      .map((step, i) => "## " + (i + 1) + ". " + step[0] + "\n" + step[1])
      .join("\n\n") +
    "\n\n## 合成示例\n" +
    g.example +
    "\n\n## 检查清单\n" +
    g.checks.map((x) => "- " + x).join("\n") +
    "\n\n## 给AI的任务\n" +
    g.prompt +
    "\n\n## 推荐与边界\n" +
    g.reason +
    "\n\n## 相关方法\n" +
    g.members
      .map((id) => {
        const p = catalog.find((x) => x.id === id);
        return (
          "- [" +
          p.title +
          "](https://context.zhanglu.net/#practice/" +
          id +
          ") · 来源：" +
          p.sourceUrl +
          " · 许可：" +
          p.license
        );
      })
      .join("\n") +
    "\n\n原创任务指南：zhanglunet；CC-BY-4.0。示例为合成，不代表真实业务成果。个人上下文由自己管理。\n";
  await writeFile("dist/downloads/guide-" + g.id + ".md", md);
  await mkdir("dist/path/" + g.id, { recursive: true });
  await writeFile(
    "dist/path/" + g.id + "/index.html",
    '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' +
      escape(g.title) +
      ' · 上下文银行</title><link rel="stylesheet" href="../../style.css"><main class="wrap"><a href="../../#path/' +
      g.id +
      '">打开交互指南</a><h1>' +
      escape(g.title) +
      "</h1><p>" +
      escape(g.intro) +
      "</p>" +
      g.steps
        .map(
          (x) =>
            '<section class="section"><h2>' +
            escape(x[0]) +
            "</h2><p>" +
            escape(x[1]) +
            "</p></section>",
        )
        .join("") +
      "<h2>检查清单</h2><ul>" +
      g.checks.map((x) => "<li>" + escape(x) + "</li>").join("") +
      '</ul><p><a href="../../downloads/guide-' +
      g.id +
      '.md" download>下载完整指南与方法来源</a></p></main>',
  );
}
await writeFile(
  "dist/evidence/2026-10-18/report.html",
  '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>典型技能实测</title><link rel="stylesheet" href="../../style.css"><main class="wrap"><a href="../../">返回上下文银行</a><pre>' +
    escape(await readFile("site/evidence/2026-10-18/report.md", "utf8")) +
    "</pre><p>" +
    [
      "work-log.md",
      "orders.csv",
      "weekly-report.md",
      "table-check.md",
      "context.md",
      "outcome-report.md",
    ]
      .map((f) => '<a href="./' + f + '">' + f + "</a>")
      .join(" · ") +
    "</p></main>",
);
await writeFile(
  "dist/catalog.mjs",
  "export const practices=" + JSON.stringify(catalog) + ";",
);
await writeFile("dist/catalog.json", JSON.stringify(catalog, null, 2));
for (const name of [
  "CONTRIBUTING.md",
  "AGENTS.md",
  "README.md",
  "schemas/practice.schema.json",
]) {
  await mkdir("dist/" + name.split("/").slice(0, -1).join("/"), {
    recursive: true,
  });
  await cp(name, "dist/" + name);
}
await cp("docs/PRD.md", "dist/context-bank-prd.md");
await writeFile(
  "dist/prd.html",
  '<!doctype html><html lang="zh-CN"><meta charset="utf-8"><title>上下文银行 PRD</title><link rel="stylesheet" href="./style.css"><main class="wrap"><a href="./">返回首页</a><pre>' +
    escape(await readFile("docs/PRD.md", "utf8")) +
    "</pre></main></html>",
);
const hash = createHash("sha256").update(JSON.stringify(catalog)).digest("hex");
await writeFile(
  "dist/release.json",
  JSON.stringify(
    { version: "1.1.0", contentSha256: hash, methods: entries.length, taskGuides: guides.length, guidesSha256: createHash("sha256").update(JSON.stringify(guides)).digest("hex"), syntheticVerifiedMethods: evidence.filter(e=>e.status==="passed"&&e.scope==="synthetic-execution").length },
    null,
    2,
  ),
);
await writeFile("dist/.nojekyll", "");
console.log("Built dist; content SHA256 " + hash);
