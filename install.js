#!/usr/bin/env node
/**
 * opencode-sumopod installer
 * Writes plugin + provider config to the global OpenCode config file.
 *
 * Usage:
 *   npx opencode-sumopod install
 *   npx opencode-sumopod uninstall
 */

import { readFileSync, writeFileSync, existsSync, mkdirSync } from "fs";
import { homedir } from "os";
import { join } from "path";

// ─── Models ────────────────────────────────────────────────────────────────

const MODELS = {
  "qwen3.6-flash": { name: "Qwen 3.6 Flash", limit: { context: 991000, output: 32768 } },
  "qwen3.6-plus": { name: "Qwen 3.6 Plus", limit: { context: 991000, output: 32768 } },
  "claude-haiku-4-5": { name: "Claude Haiku 4.5", limit: { context: 200000, output: 32768 } },
  "claude-sonnet-4-6": { name: "Claude Sonnet 4.6", limit: { context: 1000000, output: 65536 } },
  "claude-opus-4-6": { name: "Claude Opus 4.6", limit: { context: 1000000, output: 65536 } },
  "deepseek-v3-2": { name: "DeepSeek V3.2", limit: { context: 96000, output: 32768 } },
  "glm-4-7": { name: "GLM 4.7", limit: { context: 200000, output: 32768 } },
  "kimi-k2-5-260127": { name: "Kimi K2.5", limit: { context: 256000, output: 65536 } },
  "seed-2-0-code": { name: "Seed 2.0 Code", limit: { context: 256000, output: 65536 } },
  "seed-2-0-lite": { name: "Seed 2.0 Lite", limit: { context: 256000, output: 65536 } },
  "seed-2-0-mini": { name: "Seed 2.0 Mini", limit: { context: 256000, output: 32768 } },
  "seed-2-0-pro": { name: "Seed 2.0 Pro", limit: { context: 256000, output: 65536 } },
  "nvidia/nemotron-3-nano-30b": { name: "NVIDIA Nemotron 3 Nano 30B", limit: { context: 128000, output: 32768 } },
  "openai/gpt-oss-20b": { name: "OpenAI GPT OSS 20B", limit: { context: 131072, output: 32768 } },
  "qwen/qwen3-30b-a3b-instruct-2507": { name: "Qwen3 30B A3B Instruct", limit: { context: 262144, output: 65536 } },
  "zai/glm-4.7-fp8": { name: "GLM 4.7 FP8", limit: { context: 200000, output: 32768 } },
  "deepseek-v4-flash": { name: "DeepSeek V4 Flash", limit: { context: 1000000, output: 65536 } },
  "deepseek-v4-pro": { name: "DeepSeek V4 Pro", limit: { context: 1000000, output: 65536 } },
  "gemini/gemini-2.5-flash": { name: "Gemini 2.5 Flash", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-2.5-flash-lite": { name: "Gemini 2.5 Flash Lite", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-2.0-flash": { name: "Gemini 2.0 Flash", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-2.0-flash-lite": { name: "Gemini 2.0 Flash Lite", limit: { context: 1048576, output: 32768 } },
  "gemini/gemini-2.5-pro": { name: "Gemini 2.5 Pro", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-3-flash-preview": { name: "Gemini 3 Flash (Preview)", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-3-pro-preview": { name: "Gemini 3 Pro (Preview)", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-3.1-flash-lite-preview": { name: "Gemini 3.1 Flash Lite (Preview)", limit: { context: 1048576, output: 65536 } },
  "gemini/gemini-3.1-pro-preview": { name: "Gemini 3.1 Pro (Preview)", limit: { context: 1048576, output: 65536 } },
  "mimo-v2-flash": { name: "Mimo V2 Flash", limit: { context: 262100, output: 32768 } },
  "mimo-v2-omni": { name: "Mimo V2 Omni", limit: { context: 262100, output: 32768 } },
  "mimo-v2-pro": { name: "Mimo V2 Pro", limit: { context: 1050000, output: 65536 } },
  "mimo-v2.5": { name: "Mimo V2.5", limit: { context: 1050000, output: 65536 } },
  "mimo-v2.5-pro": { name: "Mimo V2.5 Pro", limit: { context: 1050000, output: 65536 } },
  "MiniMax-M2.7-highspeed": { name: "MiniMax M2.7 Highspeed", limit: { context: 204800, output: 65536 } },
  "kimi-k2.6": { name: "Kimi K2.6", limit: { context: 262144, output: 65536 } },
  "gpt-4.1": { name: "GPT-4.1", limit: { context: 1047576, output: 65536 } },
  "gpt-4.1-mini": { name: "GPT-4.1 Mini", limit: { context: 1047576, output: 65536 } },
  "gpt-4.1-nano": { name: "GPT-4.1 Nano", limit: { context: 1047576, output: 32768 } },
  "gpt-4o": { name: "GPT-4o", limit: { context: 128000, output: 32768 } },
  "gpt-4o-mini": { name: "GPT-4o Mini", limit: { context: 128000, output: 16384 } },
  "gpt-5": { name: "GPT-5", limit: { context: 272000, output: 65536 } },
  "gpt-5-mini": { name: "GPT-5 Mini", limit: { context: 272000, output: 32768 } },
  "gpt-5-nano": { name: "GPT-5 Nano", limit: { context: 272000, output: 16384 } },
  "gpt-5.1": { name: "GPT-5.1", limit: { context: 272000, output: 65536 } },
  "gpt-5.1-codex": { name: "GPT-5.1 Codex", limit: { context: 272000, output: 65536 } },
  "gpt-5.1-codex-mini": { name: "GPT-5.1 Codex Mini", limit: { context: 272000, output: 32768 } },
  "gpt-5.2": { name: "GPT-5.2", limit: { context: 272000, output: 65536 } },
  "gpt-5.2-codex": { name: "GPT-5.2 Codex", limit: { context: 272000, output: 65536 } },
  "glm-5": { name: "GLM-5", limit: { context: 200000, output: 32768 } },
  "glm-5-turbo": { name: "GLM-5 Turbo", limit: { context: 200000, output: 32768 } },
  "glm-5.1": { name: "GLM-5.1", limit: { context: 200000, output: 32768 } },
};

// ─── Helpers ────────────────────────────────────────────────────────────────

const PLUGIN_NAME = "opencode-sumopod";
const CONFIG_DIR = join(homedir(), ".config", "opencode");
const CONFIG_FILE = join(CONFIG_DIR, "opencode.json");

function readConfig() {
  if (!existsSync(CONFIG_FILE)) return {};
  try {
    return JSON.parse(readFileSync(CONFIG_FILE, "utf8"));
  } catch {
    console.error(`⚠  Could not parse ${CONFIG_FILE}. Backing up and starting fresh.`);
    writeFileSync(CONFIG_FILE + ".bak", readFileSync(CONFIG_FILE));
    return {};
  }
}

function writeConfig(config) {
  if (!existsSync(CONFIG_DIR)) mkdirSync(CONFIG_DIR, { recursive: true });
  writeFileSync(CONFIG_FILE, JSON.stringify(config, null, 2) + "\n", "utf8");
}

// ─── Install ─────────────────────────────────────────────────────────────────

function install() {
  console.log("\n🚀 Installing opencode-sumopod...\n");

  const config = readConfig();

  // 1. Add plugin entry
  if (!Array.isArray(config.plugin)) config.plugin = [];
  if (!config.plugin.includes(PLUGIN_NAME)) {
    config.plugin.push(PLUGIN_NAME);
    console.log(`  ✅ Added "${PLUGIN_NAME}" to plugin list`);
  } else {
    console.log(`  ✓  Plugin "${PLUGIN_NAME}" already in plugin list`);
  }

  // 2. Add provider config
  if (!config.provider) config.provider = {};
  if (config.provider.sumopod) {
    console.log(`  ✓  Provider "sumopod" already configured — updating models`);
  } else {
    console.log(`  ✅ Registered Sumopod provider with ${Object.keys(MODELS).length} models`);
  }

  config.provider.sumopod = {
    npm: "@ai-sdk/openai-compatible",
    name: "Sumopod",
    options: {
      baseURL: "https://ai.sumopod.com/v1",
      apiKey: "{env:SUMOPOD_API_KEY}",
    },
    models: MODELS,
  };

  writeConfig(config);

  console.log(`\n  📁 Config written to: ${CONFIG_FILE}`);
  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ opencode-sumopod installed successfully!

  Next step — add your API key:

    1. Open opencode
    2. Run: /connect
    3. Search for: Sumopod
    4. Enter your Sumopod API key

  Then pick a model with /models and start coding!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

// ─── Uninstall ───────────────────────────────────────────────────────────────

function uninstall() {
  console.log("\n🗑  Uninstalling opencode-sumopod...\n");

  const config = readConfig();
  let changed = false;

  // Remove plugin entry
  if (Array.isArray(config.plugin) && config.plugin.includes(PLUGIN_NAME)) {
    config.plugin = config.plugin.filter((p) => p !== PLUGIN_NAME);
    console.log(`  ✅ Removed "${PLUGIN_NAME}" from plugin list`);
    changed = true;
  }

  // Remove provider config
  if (config.provider?.sumopod) {
    delete config.provider.sumopod;
    console.log(`  ✅ Removed Sumopod provider config`);
    changed = true;
  }

  if (changed) {
    writeConfig(config);
    console.log(`\n  📁 Config updated: ${CONFIG_FILE}`);
  } else {
    console.log(`  ✓  Nothing to remove`);
  }

  console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
  ✅ opencode-sumopod uninstalled.

  To also remove the cached API key:
    opencode auth remove sumopod
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

const cmd = process.argv[2];

if (cmd === "uninstall") {
  uninstall();
} else if (!cmd || cmd === "install") {
  install();
} else {
  console.log(`
Usage:
  npx opencode-sumopod install     Install and configure Sumopod provider
  npx opencode-sumopod uninstall   Remove Sumopod provider from config
`);
  process.exit(1);
}