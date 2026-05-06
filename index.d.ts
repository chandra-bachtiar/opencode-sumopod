import type { Plugin } from "@opencode-ai/plugin";

/**
 * Sumopod provider plugin for OpenCode.
 *
 * Usage:
 * 1. Add the plugin to opencode.json:
 *    { "plugin": ["opencode-sumopod"] }
 *
 * 2. Add the provider config to opencode.json (see README).
 *
 * 3. Set your API key:
 *    - Via /connect → Other → ID: sumopod  (recommended)
 *    - Or set the env var: SUMOPOD_API_KEY=sk-...
 */
export declare const SumopodPlugin: Plugin;
export default SumopodPlugin;