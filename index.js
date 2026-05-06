/**
 * opencode-sumopod
 * OpenCode plugin for the Sumopod AI provider.
 * Uses @ai-sdk/openai-compatible since Sumopod exposes an OpenAI-compatible API.
 */

/** @type {import("@opencode-ai/plugin").Plugin} */
export const SumopodPlugin = async ({ client }) => {
    const apiKey =
        process.env.SUMOPOD_API_KEY ||
        process.env.OPENCODE_PROVIDER_SUMOPOD_API_KEY;

    // Log connection status when the plugin loads
    if (apiKey) {
        await client.app.log({
            body: {
                service: "opencode-sumopod",
                level: "info",
                message: "Sumopod provider ready",
            },
        });
    } else {
        await client.app.log({
            body: {
                service: "opencode-sumopod",
                level: "warn",
                message:
                    "SUMOPOD_API_KEY not found. Run /connect → Other → sumopod, or set the SUMOPOD_API_KEY environment variable.",
            },
        });
    }

    return {
        /**
         * Inject SUMOPOD_API_KEY into every shell environment so that
         * the {env:SUMOPOD_API_KEY} reference in opencode.json resolves correctly.
         */
        "shell.env": async (input, output) => {
            if (apiKey) {
                output.env.SUMOPOD_API_KEY = apiKey;
            }
        },

        /**
         * Show a TUI toast when a Sumopod-backed session starts or errors.
         */
        event: async ({ event }) => {
            if (event.type === "session.created") {
                const modelId = event.properties?.modelId ?? "";
                if (modelId.startsWith("sumopod/")) {
                    await client.tui.toast({
                        body: {
                            message: `✅ Connected to Sumopod — model: ${modelId}`,
                        },
                    });
                }
            }

            if (event.type === "session.error") {
                const err = String(event.properties?.error ?? "");
                if (err.toLowerCase().includes("sumopod")) {
                    await client.tui.toast({
                        body: {
                            message:
                                "❌ Sumopod error — check your API key and network connection.",
                        },
                    });
                }
            }
        },
    };
};

export default SumopodPlugin;