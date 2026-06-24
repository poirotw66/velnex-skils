import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PACKAGE_ROOT = path.resolve(__dirname, "../..");

export const AGENT_DIRS = [
  path.join(PACKAGE_ROOT, "plugins", "vif", "agents"),
  path.join(PACKAGE_ROOT, "plugins", "vex", "agents"),
];

export const VELNEX_AGENT_PATH_RE =
  /\/velnex(?:-skils)?\/plugins\/(?:vif|vex)\/agents\//;

export function listAgentMarkdownFiles() {
  const files = [];
  for (const dir of AGENT_DIRS) {
    if (!fs.existsSync(dir)) {
      console.warn(`warning: missing agent dir ${dir}`);
      continue;
    }
    for (const name of fs.readdirSync(dir)) {
      if (name.endsWith(".md")) {
        files.push(path.join(dir, name));
      }
    }
  }
  return files;
}

export function parseAgentMarkdown(filePath) {
  const content = fs.readFileSync(filePath, "utf8");
  const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) {
    throw new Error(`Invalid agent frontmatter: ${filePath}`);
  }

  const frontmatter = match[1];
  const body = match[2].trim();
  const readField = (key) => {
    const fieldMatch = frontmatter.match(
      new RegExp(`^${key}:\\s*(.+)$`, "m"),
    );
    return fieldMatch ? fieldMatch[1].trim() : "";
  };

  const name = readField("name");
  const description = readField("description");
  const tools = readField("tools");

  if (!name || !description) {
    throw new Error(`Agent missing name or description: ${filePath}`);
  }

  return { name, description, tools, body, sourcePath: filePath };
}

export function toolsToSandboxMode(tools) {
  if (!tools || tools === "*" || tools === '"*"') {
    return "workspace-write";
  }
  const normalized = tools.toLowerCase();
  if (
    normalized.includes("bash") ||
    normalized.includes("edit") ||
    normalized.includes("write")
  ) {
    return "workspace-write";
  }
  return "read-only";
}

export function escapeTomlString(value) {
  return `"${value.replace(/\\/g, "\\\\").replace(/"/g, '\\"')}"`;
}

export function toCodexToml(agent) {
  const relativeSource = path.relative(PACKAGE_ROOT, agent.sourcePath);
  const instructions = agent.body.replace(/"""/g, '\\"\\"\\"');
  const sandboxMode = toolsToSandboxMode(agent.tools);

  return [
    `# velnex-managed: ${agent.name}`,
    `# velnex-source: ${relativeSource}`,
    "",
    `name = ${escapeTomlString(agent.name)}`,
    `description = ${escapeTomlString(agent.description)}`,
    `sandbox_mode = ${escapeTomlString(sandboxMode)}`,
    "",
    "developer_instructions = \"\"\"",
    instructions,
    "\"\"\"",
    "",
  ].join("\n");
}
