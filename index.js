/**
 * opencode-sumopod
 * OpenCode plugin for the Sumopod AI provider.
 * Uses @ai-sdk/openai-compatible since Sumopod exposes an OpenAI-compatible API.
 *
 * OpenCode v1.3.8+ requires:
 *   - "oc-plugin": ["server"] in package.json
 *   - export const server = Plugin (instead of bare export)
 */

const PROVIDER_ID = "sumopod";
const BASE_URL = "https://api.sumopod.com/v1";

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

/** @type {import("@opencode-ai/plugin").Plugin} */
const SumopodPlugin = async ({ client }) => {
  const apiKey = process.env.SUMOPOD_API_KEY;

  if (apiKey) {
    await client.app.log({
      body: { service: "opencode-sumopod", level: "info", message: "Sumopod provider ready" },
    });
  } else {
    await client.app.log({
      body: {
        service: "opencode-sumopod",
        level: "warn",
        message: "SUMOPOD_API_KEY not set. Run /connect and search for Sumopod.",
      },
    });
  }

  return {
    auth: {
      provider: PROVIDER_ID,
      methods: [{ type: "api", label: "API Key" }],
    },

    config: async (config) => {
      if (!config.provider) config.provider = {};
      if (!config.provider[PROVIDER_ID]) {
        config.provider[PROVIDER_ID] = {
          npm: "@ai-sdk/openai-compatible",
          name: "Sumopod",
          options: {
            baseURL: BASE_URL,
            apiKey: "{env:SUMOPOD_API_KEY}",
          },
          models: MODELS,
        };
      }
    },

    "shell.env": async (input, output) => {
      if (apiKey) {
        output.env.SUMOPOD_API_KEY = apiKey;
      }
    },

    event: async ({ event }) => {
      if (event.type === "session.created") {
        const modelId = event.properties?.modelId ?? "";
        if (modelId.startsWith(`${PROVIDER_ID}/`)) {
          await client.tui.toast({
            body: { message: `✅ Connected to Sumopod — model: ${modelId}` },
          });
        }
      }
      if (event.type === "session.error") {
        const err = String(event.properties?.error ?? "");
        if (err.toLowerCase().includes(PROVIDER_ID)) {
          await client.tui.toast({
            body: { message: "❌ Sumopod error — check your API key and network connection." },
          });
        }
      }
    },
  };
};

// OpenCode v1.3.8+ requires named export "server" instead of bare default export
export const server = SumopodPlugin;

// Backward compatibility for older OpenCode versions
export default SumopodPlugin;