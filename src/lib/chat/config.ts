export type ChatProvider = "openai" | "deepseek";

export interface ChatProviderConfig {
  provider: ChatProvider;
  apiKey: string;
  baseUrl: string;
  model: string;
}

const PROVIDER_DEFAULTS: Record<
  ChatProvider,
  { baseUrl: string; model: string }
> = {
  openai: {
    baseUrl: "https://api.openai.com/v1",
    model: "gpt-4o-mini",
  },
  deepseek: {
    baseUrl: "https://api.deepseek.com",
    model: "deepseek-chat",
  },
};

export function resolveChatProviderConfig(): ChatProviderConfig | null {
  const explicitProvider = process.env.CHATBOT_PROVIDER?.toLowerCase();
  const openaiKey = process.env.OPENAI_API_KEY;
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const genericKey = process.env.CHATBOT_API_KEY;

  let provider: ChatProvider | null = null;
  let apiKey: string | undefined;

  if (explicitProvider === "openai" || explicitProvider === "deepseek") {
    provider = explicitProvider;
    apiKey =
      provider === "openai"
        ? openaiKey ?? genericKey
        : deepseekKey ?? genericKey;
  } else if (deepseekKey) {
    provider = "deepseek";
    apiKey = deepseekKey;
  } else if (openaiKey) {
    provider = "openai";
    apiKey = openaiKey;
  } else if (genericKey) {
    provider = "openai";
    apiKey = genericKey;
  }

  if (!provider || !apiKey) return null;

  const defaults = PROVIDER_DEFAULTS[provider];

  return {
    provider,
    apiKey,
    baseUrl: process.env.CHATBOT_BASE_URL ?? defaults.baseUrl,
    model: process.env.CHATBOT_MODEL ?? defaults.model,
  };
}
