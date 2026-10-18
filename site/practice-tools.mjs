const agents = new Set(["codex", "claude-code", "cursor"]);
export function installCommand(installation, agent = "codex") {
  if (
    !installation ||
    !/^https:\/\/github\.com\/[A-Za-z0-9_.-]+\/[A-Za-z0-9_.-]+$/.test(
      installation.repository,
    ) ||
    !/^[a-f0-9]{40}$/.test(installation.ref) ||
    !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(installation.name)
  )
    throw Error("Invalid pinned skill installation");
  if (!agents.has(agent)) return null;
  return `npx --yes skills@1.7.2 add ${installation.repository}/tree/${installation.ref} --skill ${installation.name} --agent ${agent} -y --copy`;
}
export function executionEvidence(id, tool, records) {
  return (
    records.find(
      (x) =>
        x.id === id &&
        x.tool === tool &&
        x.scope === "synthetic-execution" &&
        x.status === "passed",
    ) || null
  );
}
export function validateGuides(guides, practices) {
  const known = new Set(practices.map((x) => x.id)),
    seen = new Set(),
    guideIds = new Set();
  for (const g of guides) {
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(g.id) || guideIds.has(g.id))
      throw Error("Invalid guide id");
    guideIds.add(g.id);
    for (const id of g.members) {
      if (!known.has(id) || seen.has(id))
        throw Error("Invalid guide membership " + id);
      seen.add(id);
    }
    for (const id of g.recommended)
      if (!g.members.includes(id))
        throw Error("Recommendation outside guide " + id);
  }
  if (seen.size !== known.size) throw Error("Methods missing from task guides");
  return guides;
}
