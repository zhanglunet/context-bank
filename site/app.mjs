import { practices } from "./catalog.mjs";
import { paths } from "./paths.mjs";
import { installCommand } from "./practice-tools.mjs";
const $ = (s) => document.querySelector(s);
const esc = (s) =>
  String(s).replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ],
  );
let activeType = "all",
  activeTag = "全部场景",
  current = practices[0],
  timer;
function toast(t) {
  $("#toast").textContent = t;
  $("#toast").style.display = "block";
  clearTimeout(timer);
  timer = setTimeout(() => ($("#toast").style.display = "none"), 4200);
}
function show(page) {
  document
    .querySelectorAll(".page")
    .forEach((x) => x.classList.toggle("active", x.id === page));
  document
    .querySelectorAll("nav [data-page]")
    .forEach((x) => x.classList.toggle("active", x.dataset.page === page));
  window.scrollTo({ top: 0, behavior: "smooth" });
}
function navigate(page) {
  location.hash = page === "discover" ? "discover" : page;
}
function route() {
  let hash;
  try {
    hash = decodeURIComponent(location.hash.slice(1));
  } catch {
    hash = "discover";
  }
  if (hash.startsWith("path/")) {
    const g = paths.find((x) => x.id === hash.slice(5));
    if (g) {
      pathDetail(g);
      show("path");
      return;
    }
  }
  if (hash.startsWith("practice/")) {
    let item = practices.find((x) => x.id === hash.slice(9));
    if (item) {
      current = item;
      detail();
      show("detail");
      return;
    }
    toast("该实践不存在，已返回目录");
  }
  show(["share", "guide", "about"].includes(hash) ? hash : "discover");
}
document
  .querySelectorAll("[data-page]")
  .forEach((x) => (x.onclick = () => navigate(x.dataset.page)));
$("#home").onclick = () => navigate("discover");
$("#back").onclick = () => navigate("discover");
window.addEventListener("hashchange", route);
function render() {
  let q = $("#search").value.trim().toLowerCase();
  let rows = practices.filter(
    (x) =>
      (activeType === "all" || x.type === activeType) &&
      (activeTag === "全部场景" || x.tag === activeTag) &&
      [x.title, x.summary, x.tag, x.type, x.id, x.author, x.sourceUrl]
        .join(" ")
        .toLowerCase()
        .includes(q),
  );
  if ($("#sort").value === "new")
    rows.sort((a, b) => b.date.localeCompare(a.date));
  $("#count").textContent = rows.length + " 条方法";
  $("#results").innerHTML = rows.length
    ? rows
        .map(
          (x, i) =>
            `<div class="row"><span class="num">${String(i + 1).padStart(2, "0")}</span><button class="entry" data-id="${x.id}"><div class="titleline"><h3>${esc(x.title)}</h3><span class="pill ${x.type === "经验" ? "exp" : x.type === "工作流" ? "flow" : ""}">${x.type}</span></div><p>${esc(x.summary)}</p><span class="mini">${esc(x.author)} / ${esc(x.tag)} / ${esc(evidenceLabel(x))}</span></button><div class="right">更新于 ${esc(x.date)}<br>查看详情 ↗</div></div>`,
        )
        .join("")
    : '<div class="card" style="margin-top:20px"><h3>还没有匹配的方法</h3><p>换一个任务关键词，或分享你自己的做法。</p><button id="clear">清除筛选</button> <button id="emptyShare">分享方法</button></div>';
  document
    .querySelectorAll("[data-id]")
    .forEach(
      (x) => (x.onclick = () => (location.hash = "practice/" + x.dataset.id)),
    );
  if ($("#clear")) {
    $("#clear").onclick = () => {
      $("#search").value = "";
      activeType = "all";
      activeTag = "全部场景";
      sync();
      render();
    };
    $("#emptyShare").onclick = () => navigate("share");
  }
}
function sync() {
  document
    .querySelectorAll("[data-type]")
    .forEach((x) =>
      x.classList.toggle("active", x.dataset.type === activeType),
    );
  document
    .querySelectorAll("[data-tag]")
    .forEach((x) => x.classList.toggle("active", x.dataset.tag === activeTag));
}
document.querySelectorAll("[data-type]").forEach(
  (x) =>
    (x.onclick = () => {
      activeType = x.dataset.type;
      sync();
      render();
    }),
);
document.querySelectorAll("[data-tag]").forEach(
  (x) =>
    (x.onclick = () => {
      activeTag = x.dataset.tag;
      sync();
      render();
    }),
);
$("#search").oninput = render;
$("#sort").onchange = render;
function text(x) {
  return `# ${x.title}\n\n${x.type} · 方法模板 · ${esc(x.date)}\n\n## 适用任务\n${x.goal}\n\n## 需要什么\n${x.input}\n\n## 具体做法\n${x.body}\n\n## 可复制方法\n${x.copy}\n\n## 示例\n${x.sample}\n\n## 限制\n${x.limit}\n\n个人上下文由本人管理，本网站不读取工作目录。`;
}
function evidenceLabel(x) {
  const e = x.evidence?.find(
    (e) => e.scope === "synthetic-execution" && e.status === "passed",
  );
  return e ? "合成用例通过 · " + e.tool : "尚未做执行验证";
}
function pathDetail(g) {
  const recommended = g.recommended.map((id) =>
    practices.find((x) => x.id === id),
  );
  $("#pathContent").innerHTML =
    `<div class="hero"><div class="eyebrow">WORK GUIDE / ${esc(g.id.toUpperCase())}</div><h1>${esc(g.title)}</h1><p class="subtitle">${esc(g.subtitle)}</p><p>${esc(g.intro)}</p><div class="guide-facts"><p><b>适合谁</b><br>${esc(g.audience)}</p><p><b>要交付什么</b><br>${esc(g.outcome)}</p></div></div><div class="guide-body">${g.steps.map((step, i) => `<section class="section"><span class="step-number">0${i + 1}</span><h2>${esc(step[0])}</h2><p>${esc(step[1])}</p></section>`).join("")}<section class="section"><h2>看一个合成例子</h2><p>${esc(g.example)}</p></section><section class="section"><h2>做完之后，检查这几件事</h2><ul>${g.checks.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section><section class="section"><h2>把这个任务交给你的 AI</h2><pre id="guidePrompt">${esc(g.prompt)}</pre><div class="actions"><button class="primary" id="copyGuide">复制完整任务</button><a href="./downloads/guide-${g.id}.md" download>下载指南 · MD</a></div></section><section class="section"><h2>推荐从这些方法开始</h2><p>${esc(g.reason)}</p><div class="recommendations">${recommended.map((x) => `<button class="recommendation" data-practice="${x.id}"><span class="pill">${esc(x.type)}</span><h3>${esc(x.title)}</h3><p>${esc(x.summary)}</p><small>${esc(evidenceLabel(x))} · 查看使用入口 →</small></button>`).join("")}</div></section><details class="section"><summary>这个方向的全部 ${g.members.length} 条方法</summary><div class="related-list">${g.members
      .map((id) => {
        const x = practices.find((p) => p.id === id);
        return `<button data-practice="${x.id}">${esc(x.title)} →</button>`;
      })
      .join(
        "",
      )}</div></details><p class="mini">原创指南：zhanglunet · CC BY 4.0。各技能和来源保留各自许可；个人上下文由自己管理。</p></div>`;
  $("#copyGuide").onclick = () => copy(g.prompt, "#guidePrompt");
}
function detail() {
  const x = current,
    skill = x.type === "Skill",
    install = x.installation,
    g = paths.find((g) => g.id === x.topicId),
    e = x.evidence?.find(
      (e) => e.status === "passed" && e.scope === "synthetic-execution",
    );
  $("#detailContent").innerHTML =
    `<div class="detail"><article><div class="eyebrow">${esc(x.type)} / ${esc(x.tag)}</div><h1>${esc(x.title)}</h1><p class="subtitle">${esc(x.summary)}</p>${g ? `<p><a href="#path/${g.id}">先读完整指南：${esc(g.title)} →</a></p>` : ""}<p class="mini">${esc(x.author)} · 来源日期：${esc(x.date)}</p>${skill ? `<section class="section install-panel"><h2>安装这个 Skill</h2><p>先在自己选定的项目目录打开终端。命令固定来源版本，只安装技能定义，依赖另列。</p><label for="installTool">你的工具</label><select id="installTool"><option value="codex">Codex</option><option value="claude-code">Claude Code</option><option value="cursor">Cursor</option><option value="workbuddy">WorkBuddy / 其他 AI（手动使用）</option></select><pre id="method" tabindex="0"></pre><button class="primary" id="copyMethod">复制安装命令</button><p class="mini" id="installHint"></p></section><section class="section"><h2>需要准备什么</h2><ul>${(install?.dependencies || [x.input || "请先查看来源仓库的完整依赖。"]).map((v) => `<li>${esc(v)}</li>`).join("")}</ul></section><section class="section"><h2>装好后，怎样使用</h2><p>在支持技能的 AI 中打开同一项目，提供你选定且获准使用的材料。复制下面的任务开始，缺少权限或材料时先补齐。</p><pre id="usePrompt">${esc(x.startPrompt || x.goal)}</pre><button id="copyUse">复制使用任务</button></section>` : `<section class="section"><h2>适合什么任务</h2><p>${esc(x.goal)}</p></section><section class="section"><h2>需要准备什么</h2><p>${esc(x.input)}</p></section><section class="section"><h2>具体怎么做</h2><p>${esc(x.body)}</p></section><section class="section"><h2>合成示例</h2><p>${esc(x.sample)}</p></section><section class="section"><h2>可复制的方法</h2><pre id="method">${esc(x.copy)}</pre><button id="copyMethod">复制方法</button></section>`}<section class="section"><h2>验证到了哪一步</h2>${e ? `<p><span class="pill">${esc(evidenceLabel(x))}</span></p><p>${esc(e.detail)}</p><a href="${esc(e.report)}">查看测试环境、输入与产物 ↗</a>` : "<p>尚未做执行验证。可安装或说明完整，不等于已在你的工具与真实业务中跑通。</p>"}<p class="mini">Codex、Claude Code、Cursor 是命令安装目标；只有证据明确列出的工具与输入算已测。WorkBuddy / 豆包工作尚未验证自动导入与执行。</p></section><section class="section"><h2>使用边界</h2><p>${esc(x.limit || "请先确认材料权限、业务口径和验收条件。")}</p></section>${skill ? `<details class="section"><summary>查看原版技能全文</summary><pre>${esc(x.body)}</pre></details>` : ""}</article><aside class="sidecard"><h3>带到你的 AI 里</h3><p class="mini">${skill ? "技能定义与运行依赖分开准备；先跑一个获准的合成任务。" : "复制完整做法，并按自己的材料调整。"}</p><div class="actions"><button class="primary" id="downloadMethod">下载实践 · MD</button><button id="shareLink">复制详情链接</button></div><label>工具与验证</label><p class="mini">${esc(evidenceLabel(x))}</p><label>来源与许可</label><p class="mini">${esc(x.license)} · 下载文件与来源保留许可。<br><a href="${esc(x.sourceUrl)}" target="_blank" rel="noopener noreferrer">查看版本来源 ↗</a></p><div class="callout">个人背景、资料和进展留在自己的目录。安装不代表授权读取资料、发送消息或发布成果。</div></aside></div>`;
  if (skill) {
    const update = () => {
      const agent = $("#installTool").value,
        cmd = install ? installCommand(install, agent) : null;
      $("#method").textContent =
        cmd ||
        "此工具的自动安装尚未验证。可下载MD并复制下方使用任务，让当前AI按方法处理你选定的材料。";
      $("#copyMethod").hidden = !cmd;
      $("#installHint").textContent = cmd
        ? "默认安装到当前项目；不写全局配置。命令安装不会自动补齐CLI、模板或账号。"
        : "手动使用不是自动安装；是否支持Skill加载以该工具当前能力为准。";
    };
    $("#installTool").onchange = update;
    update();
    $("#copyMethod").onclick = () => copy($("#method").textContent, "#method");
    $("#copyUse").onclick = () => copy(x.startPrompt || x.goal, "#usePrompt");
  } else $("#copyMethod").onclick = () => copy(x.copy, "#method");
  $("#downloadMethod").onclick = async () => {
    try {
      const r = await fetch("./downloads/" + x.id + ".md");
      if (!r.ok) throw Error("Download unavailable");
      download(x.id + ".md", await r.text());
    } catch {
      toast("下载暂不可用，请从来源仓库获取原文");
    }
  };
  $("#shareLink").onclick = () => copy(location.href);
}
document.addEventListener("click", (event) => {
  const p = event.target.closest("[data-practice]");
  if (p) location.hash = "practice/" + p.dataset.practice;
  const g = event.target.closest("[data-path]");
  if (g) location.hash = "path/" + g.dataset.path;
});
async function copy(value, selector) {
  try {
    await navigator.clipboard.writeText(value);
    toast("已复制");
  } catch {
    if (selector && $(selector)) {
      const range = document.createRange();
      range.selectNodeContents($(selector));
      const s = getSelection();
      s.removeAllRanges();
      s.addRange(range);
      toast("未获剪贴板权限，已选中文本，请手动复制");
    } else {
      toast("未获剪贴板权限，请复制浏览器地址栏中的链接");
    }
  }
}
function download(name, content) {
  const url = URL.createObjectURL(
    new Blob([content], {
      type: name.endsWith(".json")
        ? "application/json"
        : "text/markdown;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  toast("已下载 " + name);
}
$("#template").onclick = () =>
  download(
    "我的工作目录-说明模板.md",
    "# 我的工作目录\n\n请在自己选择的位置建立以下目录，平台不会创建或读取它们。\n\n```text\n我的工作/\n├── 工作说明.md\n├── 项目A/\n│   ├── 背景.md\n│   ├── 当前进展.md\n│   ├── 资料/\n│   └── 产出/\n└── 可分享的方法/\n```\n\n## 工作说明\n填写自己的偏好、约束和工具使用方式。\n\n## 背景\n填写项目目标、依据与边界。\n\n## 当前进展\n填写已确认进展、未决事项、下一步和更新时间。\n\n## 分享\n仅将本人确认有权公开且已经脱敏的方法主动投稿。",
  );
$("#kind").onchange = () => {
  let skill = $("#kind").value === "Skill";
  $("#skillFields").classList.toggle("hidden", !skill);
  $("#source").required = skill;
  $("#skillPath").required = skill;
  $("#sourceHint").textContent = skill ? "（必填公开仓库）" : "（可选）";
};
function submission() {
  return {
    type: $("#kind").value,
    title: $("#title").value,
    summary: $("#summary").value,
    scenario: $("#scenario").value,
    body: $("#body").value,
    source: $("#source").value,
    tools: $("#tools").value,
    license: $("#license").value,
  };
}
const REPO = "https://github.com/zhanglunet/context-bank";
const agentInstruction = `请把我明确选定且授权公开的方法贡献到 ${REPO}。先读取 ${REPO}/blob/main/CONTRIBUTING.md 和Schema。只处理选定内容，不扫描或上传个人工作目录。经验放content/notes，工作流放content/workflows，外部索引放registry。核对来源、许可和脱敏示例，在本地运行npm ci、npm test、npm run build。使用我已授权的GitHub身份fork仓库、创建分支并发起PR，回报真实PR链接，不直接写main。未获得公开授权或GitHub身份时只保留本地草稿并说明缺失条件。`;
$("#agentPrompt").textContent = agentInstruction;
$("#copyAgent").onclick = () => copy(agentInstruction, "#agentPrompt");
document.querySelectorAll("[data-contribute]").forEach(
  (el) =>
    (el.onclick = () => {
      let target = el.dataset.contribute;
      document
        .querySelectorAll(".contrib")
        .forEach((x) => x.classList.add("hidden"));
      $("#" + target + "Pane").classList.remove("hidden");
    }),
);
$("#githubSteps").onclick = () => $("#steps").classList.toggle("hidden");
function validSource(x) {
  return !x || /^https?:\/\//i.test(x);
}
function markdown(x) {
  const meta = {
    schema_version: 1,
    id: $("#slug").value.trim(),
    type: { 经验: "note", 工作流: "workflow", Skill: "skill" }[x.type],
    title: x.title,
    summary: x.summary,
    scenarios: [x.scenario],
    author: $("#author").value.trim(),
    license: x.license,
    compatibility: [{ tool: x.tools, verification: "unverified" }],
    source_url: x.source || null,
  };
  if (x.type === "Skill") {
    meta.skill_path = $("#skillPath").value;
    meta.name = meta.id;
    meta.description = x.summary;
  }
  return (
    "---\n" +
    JSON.stringify(meta, null, 2) +
    "\n---\n\n# " +
    x.title +
    "\n\n" +
    x.body +
    "\n\n## 使用限制\n请核对适用工具、输入授权与输出结果。\n"
  );
}
$("#previewSubmission").onclick = () => {
  if (!$("#submitForm").reportValidity()) return;
  let x = submission();
  if (!validSource(x.source)) {
    toast("来源仅接受http或https链接");
    return;
  }
  $("#submissionPreview").classList.remove("hidden");
  $("#submissionPreview").innerHTML =
    "<h3>将生成的投稿文件</h3><pre>" + esc(markdown(x)) + "</pre>";
};
$("#submitForm").onsubmit = (e) => {
  e.preventDefault();
  let x = submission();
  if (!validSource(x.source)) {
    toast("来源仅接受http或https链接");
    return;
  }
  download($("#slug").value.trim() + ".md", markdown(x));
  $("#receipt").classList.remove("hidden");
  $("#receipt").innerHTML =
    '<div class="receipt"><h2>投稿文件已生成，尚未提交</h2><p>' +
    esc(x.title) +
    '</p><p>请先核对下载文件，再打开GitHub新文件页粘贴正文并发起PR。</p><p class="mini">仅生成文件不等于已投稿；提交成功以GitHub返回的PR链接为准。</p></div>';
  const path =
    x.type === "Skill"
      ? "skills/" + $("#slug").value.trim() + "/SKILL.md"
      : "content/" +
        (x.type === "经验" ? "notes" : "workflows") +
        "/" +
        $("#slug").value.trim() +
        ".md";
  const gh = document.createElement("a");
  gh.href =
    REPO +
    "/new/main?filename=" +
    encodeURIComponent(path) +
    (markdown(x).length <= 4000
      ? "&value=" + encodeURIComponent(markdown(x))
      : "");
  gh.target = "_blank";
  gh.rel = "noopener noreferrer";
  gh.textContent = "前往GitHub投稿 →";
  const cb = document.createElement("button");
  cb.type = "button";
  cb.textContent = "复制投稿文件";
  cb.onclick = () => {
    $("#submissionPreview").classList.remove("hidden");
    $("#submissionPreview").innerHTML = "<pre>" + esc(markdown(x)) + "</pre>";
    copy(markdown(x), "#submissionPreview pre");
  };
  $("#receipt").append(cb, document.createTextNode(" "), gh);
  $("#receipt").scrollIntoView({ behavior: "smooth" });
};
$("#repoForm").onsubmit = (e) => {
  e.preventDefault();
  let url;
  try {
    url = new URL($("#repoUrl").value);
  } catch {
    toast("请填写有效仓库URL");
    return;
  }
  if (
    url.protocol !== "https:" ||
    url.hostname !== "github.com" ||
    !/^\/[^/]+\/[^/]+\/?$/.test(url.pathname)
  ) {
    toast("请填写https://github.com/OWNER/REPO形式的仓库URL");
    return;
  }
  let path = $("#repoPath").value;
  if (path.startsWith("/") || path.split("/").includes("..")) {
    toast("请填写仓库内相对路径");
    return;
  }
  if (!/^[a-f0-9]{40}$/.test($("#repoRef").value)) {
    toast("请使用40位commit SHA固定来源版本");
    return;
  }
  let data = {
    schema_version: 1,
    id: $("#registryId").value.trim(),
    type: $("#repoType").value,
    repository: url.href,
    path,
    ref: $("#repoRef").value,
    license: $("#repoLicense").value,
  };
  let out = JSON.stringify(data, null, 2);
  $("#repoOutput").classList.remove("hidden");
  $("#repoOutput").innerHTML =
    "<h3>索引申请预览</h3><pre>" +
    esc(out) +
    '</pre><p class="mini">索引申请已生成；在GitHub提交后检查来源，合并构建成功才会收录。</p>';
  download(data.id + ".json", out);
  const a = document.createElement("a");
  a.href =
    REPO +
    "/new/main?filename=" +
    encodeURIComponent("registry/" + data.id + ".json") +
    "&value=" +
    encodeURIComponent(out);
  a.target = "_blank";
  a.rel = "noopener noreferrer";
  a.textContent = "前往GitHub提交索引申请 →";
  $("#repoOutput").append(a);
};
$("#libraryCount").textContent = practices.length;
$("#taskPaths").innerHTML = paths
  .map(
    (g, i) =>
      `<button class="path-card" data-path="${g.id}"><span class="eyebrow">0${i + 1} / WORK GUIDE</span><h2>${esc(g.title)}</h2><p>${esc(g.subtitle)}</p><span class="mini">${g.members.length} 条相关方法 · 阅读完整做法 →</span></button>`,
  )
  .join("");
render();
route();
