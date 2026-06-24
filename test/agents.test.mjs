import assert from "node:assert/strict";
import { test } from "node:test";
import path from "node:path";
import {
  PACKAGE_ROOT,
  listAgentMarkdownFiles,
  parseAgentMarkdown,
  toolsToSandboxMode,
  toCodexToml,
} from "../bin/lib/agents.mjs";

test("listAgentMarkdownFiles finds seven velnex agents", () => {
  const files = listAgentMarkdownFiles();
  assert.equal(files.length, 7);
  assert.ok(files.some((f) => f.endsWith("test-writer.md")));
  assert.ok(files.some((f) => f.endsWith("git-commit.md")));
});

test("parseAgentMarkdown reads frontmatter", () => {
  const filePath = path.join(
    PACKAGE_ROOT,
    "plugins/vif/agents/spec-auditor.md",
  );
  const agent = parseAgentMarkdown(filePath);
  assert.equal(agent.name, "spec-auditor");
  assert.match(agent.description, /auditor/i);
  assert.equal(agent.tools, "Read, Grep, Glob");
  assert.match(agent.body, /Spec Auditor/);
});

test("toolsToSandboxMode maps tool sets", () => {
  assert.equal(toolsToSandboxMode("*"), "workspace-write");
  assert.equal(toolsToSandboxMode("Read, Bash"), "workspace-write");
  assert.equal(toolsToSandboxMode("Read, Grep, Glob"), "read-only");
});

test("toCodexToml includes velnex-managed marker and sandbox_mode", () => {
  const filePath = path.join(
    PACKAGE_ROOT,
    "plugins/vif/agents/security-reviewer.md",
  );
  const agent = parseAgentMarkdown(filePath);
  const toml = toCodexToml(agent);
  assert.match(toml, /^# velnex-managed: security-reviewer/m);
  assert.match(toml, /sandbox_mode = "read-only"/);
  assert.match(toml, /developer_instructions = """/);
});
