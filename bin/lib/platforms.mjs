import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  listAgentMarkdownFiles,
  parseAgentMarkdown,
  toCodexToml,
  VELNEX_AGENT_PATH_RE,
  PACKAGE_ROOT,
} from "./agents.mjs";

export const PLATFORMS = ["cursor", "codex"];

export function resolveCursorAgentsDir(global, project) {
  if (global) {
    return path.join(os.homedir(), ".cursor", "agents");
  }
  return path.join(process.cwd(), ".cursor", "agents");
}

export function resolveCodexAgentsDir(global, project) {
  if (global) {
    return path.join(os.homedir(), ".codex", "agents");
  }
  return path.join(process.cwd(), ".codex", "agents");
}

function writeMarker(targetDir, scope, platforms) {
  const marker = path.join(targetDir, ".velnex-agents");
  fs.writeFileSync(
    marker,
    [
      `package_root=${PACKAGE_ROOT}`,
      `scope=${scope}`,
      `platforms=${platforms.join(",")}`,
      `installed_at=${new Date().toISOString()}`,
      "",
    ].join("\n"),
  );
}

export function installCursorAgents(options) {
  const targetDir = resolveCursorAgentsDir(options.global, options.project);
  fs.mkdirSync(targetDir, { recursive: true });

  let processed = 0;
  for (const agentFile of listAgentMarkdownFiles()) {
    const agentName = path.basename(agentFile);
    const linkPath = path.join(targetDir, agentName);

    if (fs.existsSync(linkPath) && !fs.lstatSync(linkPath).isSymbolicLink()) {
      console.warn(`skip (not a symlink): ${linkPath}`);
      continue;
    }

    if (fs.existsSync(linkPath)) {
      const current = fs.readlinkSync(linkPath);
      if (path.resolve(current) === path.resolve(agentFile)) {
        console.log(`already linked: ${agentName}`);
        processed += 1;
        continue;
      }
      fs.unlinkSync(linkPath);
    }

    fs.symlinkSync(agentFile, linkPath);
    console.log(`cursor: linked ${agentName}`);
    processed += 1;
  }

  writeMarker(
    targetDir,
    options.global ? "global" : "project",
    ["cursor"],
  );

  console.log(`\nCursor: ${processed} agent(s) in ${targetDir}`);
}

export function installCodexAgents(options) {
  const targetDir = resolveCodexAgentsDir(options.global, options.project);
  fs.mkdirSync(targetDir, { recursive: true });

  let processed = 0;
  for (const agentFile of listAgentMarkdownFiles()) {
    const agent = parseAgentMarkdown(agentFile);
    const tomlPath = path.join(targetDir, `${agent.name}.toml`);
    const toml = toCodexToml(agent);
    fs.writeFileSync(tomlPath, toml, "utf8");
    console.log(`codex: wrote ${agent.name}.toml`);
    processed += 1;
  }

  writeMarker(
    targetDir,
    options.global ? "global" : "project",
    ["codex"],
  );

  console.log(`\nCodex: ${processed} agent(s) in ${targetDir}`);
}

export function installPlatformAgents(platforms, options) {
  if (platforms.includes("cursor")) {
    console.log("==> Installing Cursor subagents (.md symlinks)");
    installCursorAgents(options);
  }
  if (platforms.includes("codex")) {
    console.log("\n==> Installing Codex subagents (.toml)");
    installCodexAgents(options);
  }
}

function removeCursorAgents(targetDir) {
  let removed = 0;
  for (const name of fs.readdirSync(targetDir)) {
    if (!name.endsWith(".md")) {
      continue;
    }
    const linkPath = path.join(targetDir, name);
    if (!fs.lstatSync(linkPath).isSymbolicLink()) {
      continue;
    }
    const target = fs.readlinkSync(linkPath);
    const resolved = path.resolve(path.dirname(linkPath), target);
    if (
      VELNEX_AGENT_PATH_RE.test(resolved) ||
      resolved.startsWith(path.join(PACKAGE_ROOT, "plugins"))
    ) {
      fs.unlinkSync(linkPath);
      console.log(`cursor: removed ${name}`);
      removed += 1;
    }
  }
  return removed;
}

function removeCodexAgents(targetDir) {
  let removed = 0;
  for (const name of fs.readdirSync(targetDir)) {
    if (!name.endsWith(".toml")) {
      continue;
    }
    const filePath = path.join(targetDir, name);
    const content = fs.readFileSync(filePath, "utf8");
    if (content.startsWith("# velnex-managed:")) {
      fs.unlinkSync(filePath);
      console.log(`codex: removed ${name}`);
      removed += 1;
    }
  }
  return removed;
}

export function uninstallPlatformAgents(platforms, options) {
  let total = 0;

  if (platforms.includes("cursor")) {
    const targetDir = resolveCursorAgentsDir(options.global, options.project);
    if (fs.existsSync(targetDir)) {
      total += removeCursorAgents(targetDir);
      const marker = path.join(targetDir, ".velnex-agents");
      if (fs.existsSync(marker)) {
        fs.unlinkSync(marker);
      }
    }
  }

  if (platforms.includes("codex")) {
    const targetDir = resolveCodexAgentsDir(options.global, options.project);
    if (fs.existsSync(targetDir)) {
      total += removeCodexAgents(targetDir);
      const marker = path.join(targetDir, ".velnex-agents");
      if (fs.existsSync(marker)) {
        fs.unlinkSync(marker);
      }
    }
  }

  console.log(`\nDone. ${total} velnex agent file(s) removed.`);
}
