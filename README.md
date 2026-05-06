# opencode-sumopod

[OpenCode](https://opencode.ai) plugin that adds **Sumopod** as an AI provider.
Uses `@ai-sdk/openai-compatible` since Sumopod exposes an OpenAI-compatible API.

---

## Installation

### 1. Add the plugin to `opencode.json`

```json
{
  "$schema": "https://opencode.ai/config.json",
  "plugin": ["opencode-sumopod"]
}
```

OpenCode automatically installs the plugin via Bun on startup.

### 2. Register the Sumopod provider

Add the `provider` block to your `opencode.json`:

```json
{
  "$schema": "https://opencode.ai/config.json",

  "plugin": ["opencode-sumopod"],

  "provider": {
    "sumopod": {
      "npm": "@ai-sdk/openai-compatible",
      "name": "Sumopod",
      "options": {
        "baseURL": "https://api.sumopod.com/v1",
        "apiKey": "{env:SUMOPOD_API_KEY}"
      },
      "models": {
        "claude-sonnet-4-6": {
          "name": "Claude Sonnet 4.6",
          "limit": { "context": 1000000, "output": 65536 }
        }
      }
    }
  }
}
```

See the full model list below and pick the ones you want to use.

### 3. Set your API key

**Option A — via `/connect` (recommended)**

Run the following command inside the OpenCode TUI:

```
/connect
```

Select **Other** → enter provider ID `sumopod` → paste your API key.

The key is saved automatically to `~/.local/share/opencode/auth.json`.

**Option B — environment variable**

```bash
export SUMOPOD_API_KEY=sk-xxxxxxxxxx
```

Or add it permanently to your shell profile:

```bash
echo 'export SUMOPOD_API_KEY=sk-xxxxxxxxxx' >> ~/.zshrc
```

### 4. Select a model

```
/models
```

The **Sumopod** provider and all configured models will appear in the list.

---

## Available Models

| Model ID | Display Name | Context | Provider |
|---|---|---|---|
| `qwen3.6-flash` | Qwen 3.6 Flash | 991K | Alibaba |
| `qwen3.6-plus` | Qwen 3.6 Plus | 991K | Alibaba |
| `claude-haiku-4-5` | Claude Haiku 4.5 | 200K | Anthropic |
| `claude-sonnet-4-6` | Claude Sonnet 4.6 | 1M | Anthropic |
| `claude-opus-4-6` | Claude Opus 4.6 | 1M | Anthropic |
| `deepseek-v3-2` | DeepSeek V3.2 | 96K | BytePlus |
| `glm-4-7` | GLM 4.7 | 200K | BytePlus |
| `kimi-k2-5-260127` | Kimi K2.5 | 256K | BytePlus |
| `seed-2-0-code` | Seed 2.0 Code | 256K | BytePlus |
| `seed-2-0-lite` | Seed 2.0 Lite | 256K | BytePlus |
| `seed-2-0-mini` | Seed 2.0 Mini | 256K | BytePlus |
| `seed-2-0-pro` | Seed 2.0 Pro | 256K | BytePlus |
| `nvidia/nemotron-3-nano-30b` | NVIDIA Nemotron 3 Nano 30B | 128K | Cloudeka |
| `openai/gpt-oss-20b` | OpenAI GPT OSS 20B | 128K | Cloudeka |
| `qwen/qwen3-30b-a3b-instruct-2507` | Qwen3 30B A3B Instruct | 262K | Cloudeka |
| `zai/glm-4.7-fp8` | GLM 4.7 FP8 | 200K | Cloudeka |
| `deepseek-v4-flash` | DeepSeek V4 Flash | 1M | DeepSeek |
| `deepseek-v4-pro` | DeepSeek V4 Pro | 1M | DeepSeek |
| `gemini/gemini-2.0-flash` | Gemini 2.0 Flash | 1M | Google |
| `gemini/gemini-2.0-flash-lite` | Gemini 2.0 Flash Lite | 1M | Google |
| `gemini/gemini-2.5-flash` | Gemini 2.5 Flash | 1M | Google |
| `gemini/gemini-2.5-flash-lite` | Gemini 2.5 Flash Lite | 1M | Google |
| `gemini/gemini-2.5-pro` | Gemini 2.5 Pro | 1M | Google |
| `gemini/gemini-3-flash-preview` | Gemini 3 Flash (Preview) | 1M | Google |
| `gemini/gemini-3-pro-preview` | Gemini 3 Pro (Preview) | 1M | Google |
| `gemini/gemini-3.1-flash-lite-preview` | Gemini 3.1 Flash Lite (Preview) | 1M | Google |
| `gemini/gemini-3.1-pro-preview` | Gemini 3.1 Pro (Preview) | 1M | Google |
| `mimo-v2-flash` | Mimo V2 Flash | 262K | Mimo |
| `mimo-v2-omni` | Mimo V2 Omni | 262K | Mimo |
| `mimo-v2-pro` | Mimo V2 Pro | 1M | Mimo |
| `mimo-v2.5` | Mimo V2.5 | 1M | Mimo |
| `mimo-v2.5-pro` | Mimo V2.5 Pro | 1M | Mimo |
| `MiniMax-M2.7-highspeed` | MiniMax M2.7 Highspeed | 200K | MiniMax |
| `kimi-k2.6` | Kimi K2.6 | 262K | Moonshot |
| `gpt-4.1` | GPT-4.1 | 1M | OpenAI |
| `gpt-4.1-mini` | GPT-4.1 Mini | 1M | OpenAI |
| `gpt-4.1-nano` | GPT-4.1 Nano | 1M | OpenAI |
| `gpt-4o` | GPT-4o | 128K | OpenAI |
| `gpt-4o-mini` | GPT-4o Mini | 128K | OpenAI |
| `gpt-5` | GPT-5 | 272K | OpenAI |
| `gpt-5-mini` | GPT-5 Mini | 272K | OpenAI |
| `gpt-5-nano` | GPT-5 Nano | 272K | OpenAI |
| `gpt-5.1` | GPT-5.1 | 272K | OpenAI |
| `gpt-5.1-codex` | GPT-5.1 Codex | 272K | OpenAI |
| `gpt-5.1-codex-mini` | GPT-5.1 Codex Mini | 272K | OpenAI |
| `gpt-5.2` | GPT-5.2 | 272K | OpenAI |
| `gpt-5.2-codex` | GPT-5.2 Codex | 272K | OpenAI |
| `text-embedding-3-large` | Text Embedding 3 Large | 8K | OpenAI |
| `text-embedding-3-small` | Text Embedding 3 Small | 8K | OpenAI |
| `glm-5` | GLM-5 | 200K | Z.AI |
| `glm-5-turbo` | GLM-5 Turbo | 200K | Z.AI |
| `glm-5.1` | GLM-5.1 | 200K | Z.AI |

The full `opencode.example.json` in this repo has all models pre-configured with correct context limits.

---

## Configuration Options

| Field | Description |
|---|---|
| `baseURL` | Sumopod API endpoint (`/v1/chat/completions`) |
| `apiKey` | API key — use `{env:SUMOPOD_API_KEY}` to read from env |
| `headers` | Additional headers sent with every request |
| `models.<id>.name` | Display name shown in the model picker |
| `models.<id>.limit.context` | Maximum input tokens |
| `models.<id>.limit.output` | Maximum output tokens |

---

## What this plugin does

1. **Env injection** — Ensures `SUMOPOD_API_KEY` is available in every shell OpenCode spawns via the `shell.env` hook, so the `{env:SUMOPOD_API_KEY}` reference in your config always resolves.

2. **Status logging** — Logs an info message when the plugin loads successfully, or a warning if the API key is missing.

3. **TUI toasts** — Shows a notification when a Sumopod session starts or if a connection error occurs.

---

## Troubleshooting

**Sumopod models don't appear in `/models`**
- Make sure the `provider.sumopod` block exists in `opencode.json`
- Run `opencode auth list` to verify the credentials are stored

**401 Unauthorized**
- Re-run `/connect` and enter the correct API key
- Or re-export the `SUMOPOD_API_KEY` environment variable

**Connection error**
- Verify the `baseURL` matches the Sumopod API documentation
- Check your internet connection and firewall rules

---

## License

MIT