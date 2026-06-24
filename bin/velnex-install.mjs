#!/usr/bin/env node
/**
 * Install Velnex skills (npx skills add) and platform subagents (Cursor + Codex).
 * Run: npx github:poirotw66/velnex-skils -g
 */
import { spawnSync } from "node:child_process";
import { PACKAGE_ROOT } from "./lib/agents.mjs";
import { PLATFORMS, installPlatformAgents, uninstallPlatformAgents } from "./lib/platforms.mjs";

const SKILLS_SOURCE = process.env.VELNEX_SKILLS_SOURCE ?? "poirotw66/velnex-skils";

function usage() {
  console.log(`Usage: npx github:poirotw66/velnex-skils [command] [options] [-- extra skills add args]

Commands:
  install     Install skills + subagents (default)
  agents      Install subagents only
  uninstall   Remove velnex subagents
  help        Show this help

Options:
  -g, --global       Global scope
  -p, --project      Project scope (cwd)
  -l, --local        Use this repo as skills source (local clone)
  --cursor-only      Cursor only (skills + .md agents)
  --codex-only       Codex only (skills + .toml agents)
  -h, --help         Show this help

By default, install targets both Cursor and Codex.

Examples:
  npx github:poirotw66/velnex-skils -g
  npx github:poirotw66/velnex-skils install -g --codex-only
  npx github:poirotw66/velnex-skils agents -g --cursor-only
  npx github:poirotw66/velnex-skils install -g -- --skill vif-develop
`);
}

function parseArgs(argv) {
  const result = {
    command: "install",
    global: false,
    project: false,
    cursorOnly: false,
    codexOnly: false,
    useLocal: false,
    skillsArgs: [],
  };

  let i = 0;
  const commands = new Set(["install", "agents", "uninstall", "help"]);
  if (argv[0] && !argv[0].startsWith("-") && commands.has(argv[0])) {
    result.command = argv[0];
    i = 1;
  }

  for (; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "-g" || arg === "--global") {
      result.global = true;
    } else if (arg === "-p" || arg === "--project") {
      result.project = true;
    } else if (arg === "--cursor-only") {
      result.cursorOnly = true;
    } else if (arg === "--codex-only") {
      result.codexOnly = true;
    } else if (arg === "-l" || arg === "--local") {
      result.useLocal = true;
    } else if (arg === "-h" || arg === "--help") {
      result.command = "help";
    } else if (arg === "--") {
      result.skillsArgs = argv.slice(i + 1);
      break;
    } else {
      result.skillsArgs.push(arg);
    }
  }

  if (result.cursorOnly && result.codexOnly) {
    console.error("error: use only one of --cursor-only or --codex-only");
    process.exit(1);
  }

  return result;
}

function resolvePlatforms(options) {
  if (options.cursorOnly) {
    return ["cursor"];
  }
  if (options.codexOnly) {
    return ["codex"];
  }
  return PLATFORMS;
}

function installSkills(platforms, options) {
  const skillsSource = options.useLocal
    || options.skillsArgs.includes("--local")
    || options.skillsArgs.includes("-l")
      ? PACKAGE_ROOT
      : SKILLS_SOURCE;

  const filteredArgs = options.skillsArgs.filter(
    (a) => a !== "--local" && a !== "-l",
  );

  const args = ["skills", "add", skillsSource, "-y"];
  for (const platform of platforms) {
    args.push("-a", platform);
  }
  if (options.global) {
    args.push("-g");
  }
  args.push(...filteredArgs);

  console.log(`==> npx ${args.join(" ")}`);
  const result = spawnSync("npx", args, { stdio: "inherit", shell: false });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

function restartHint(platforms) {
  const hints = [];
  if (platforms.includes("cursor")) {
    hints.push("Restart Cursor or start a new Agent chat");
  }
  if (platforms.includes("codex")) {
    hints.push("Restart Codex CLI to load new custom agents");
  }
  if (hints.length > 0) {
    console.log(hints.join(". ") + ".");
  }
}

function main() {
  const options = parseArgs(process.argv.slice(2));
  const platforms = resolvePlatforms(options);

  if (options.command === "help") {
    usage();
    return;
  }

  if (options.command === "uninstall") {
    uninstallPlatformAgents(platforms, options);
    return;
  }

  if (options.command === "agents") {
    installPlatformAgents(platforms, options);
    restartHint(platforms);
    return;
  }

  installSkills(platforms, options);
  console.log("\n==> Installing subagents");
  installPlatformAgents(platforms, options);
  console.log("\nVelnex install complete.");
  restartHint(platforms);
}

main();
