/**
 * opencode-sumopod
 * OpenCode server plugin for the Sumopod AI provider.
 *
 * This file is the plugin runtime loaded by OpenCode at startup.
 * For installation, run: npx opencode-sumopod install
 */

/** @type {import("@opencode-ai/plugin").Plugin} */
const SumopodPlugin = async ({ client }) => {
  const apiKey = process.env.SUMOPOD_API_KEY;

  await client.app.log({
    body: {
      service: "opencode-sumopod",
      level: apiKey ? "info" : "warn",
      message: apiKey
        ? "Sumopod provider ready"
        : "SUMOPOD_API_KEY not set — run /connect and search for Sumopod",
    },
  });

  return {
    /**
     * Inject SUMOPOD_API_KEY into every shell so {env:SUMOPOD_API_KEY}
     * in the provider config resolves correctly.
     */
    "shell.env": async (input, output) => {
      if (apiKey) output.env.SUMOPOD_API_KEY = apiKey;
    },

    /**
     * Toast notifications for Sumopod sessions.
     */
    event: async ({ event }) => {
      if (event.type === "session.created") {
        const modelId = event.properties?.modelId ?? "";
        if (modelId.startsWith("sumopod/")) {
          await client.tui.toast({
            body: { message: `✅ Connected to Sumopod — ${modelId}` },
          });
        }
      }
      if (event.type === "session.error") {
        const err = String(event.properties?.error ?? "");
        if (err.toLowerCase().includes("sumopod")) {
          await client.tui.toast({
            body: { message: "❌ Sumopod error — check your API key." },
          });
        }
      }
    },
  };
};

// OpenCode v1.3.8+ requires named "server" export
export const server = SumopodPlugin;
export default SumopodPlugin;