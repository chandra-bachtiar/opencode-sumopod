/**
 * opencode-sumopod
 * OpenCode server plugin for the Sumopod AI provider.
 *
 * This file is the plugin runtime loaded by OpenCode at startup.
 * For installation, run: npx opencode-sumopod install
 */

/** @type {import("@opencode-ai/plugin").Plugin} */
const SumopodPlugin = async ({ client }) => {
  await client.app.log({
    body: {
      service: "opencode-sumopod",
      level: "info",
      message: "Sumopod provider ready — use /connect to set your API key",
    },
  });

  return {
    auth: {
      provider: "sumopod",
      methods: [{ type: "api", label: "API Key" }],
    },

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

export const server = SumopodPlugin;
export default SumopodPlugin;