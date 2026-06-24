import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, lstatSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { PACKAGE_ROOT } from "../bin/lib/agents.mjs";

const INSTALL_BIN = join(PACKAGE_ROOT, "bin/velnex-install.mjs");

function runInstall(args, cwd) {
  return spawnSync("node", [INSTALL_BIN, ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("project-scoped codex agents install and uninstall", () => {
  const dir = mkdtempSync(join(tmpdir(), "velnex-codex-"));
  try {
    const install = runInstall(["agents", "-p", "--codex-only"], dir);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const tomlPath = join(dir, ".codex/agents/test-writer.toml");
    assert.ok(existsSync(tomlPath));
    const content = readFileSync(tomlPath, "utf8");
    assert.match(content, /# velnex-managed: test-writer/);
    assert.match(content, /name = "test-writer"/);

    const uninstall = runInstall(["uninstall", "-p", "--codex-only"], dir);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
    assert.equal(existsSync(tomlPath), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});

test("project-scoped cursor agents install symlink", () => {
  const dir = mkdtempSync(join(tmpdir(), "velnex-cursor-"));
  try {
    const install = runInstall(["agents", "-p", "--cursor-only"], dir);
    assert.equal(install.status, 0, install.stderr || install.stdout);

    const linkPath = join(dir, ".cursor/agents/test-writer.md");
    assert.ok(existsSync(linkPath));
    assert.ok(lstatSync(linkPath).isSymbolicLink());

    const uninstall = runInstall(["uninstall", "-p", "--cursor-only"], dir);
    assert.equal(uninstall.status, 0, uninstall.stderr || uninstall.stdout);
    assert.equal(existsSync(linkPath), false);
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
});
