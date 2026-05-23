interface DeepSeekConfig {
  apiKey: string;
  baseUrl: string;
  model: string;
}

function getConfig(): DeepSeekConfig | null {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey || apiKey === "sk-your-key-here") return null;
  return {
    apiKey,
    baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
    model: process.env.DEEPSEEK_MODEL || "deepseek-chat",
  };
}

export async function callDeepSeek(systemPrompt: string, userMessage: string): Promise<string> {
  const config = getConfig();
  if (!config) {
    throw new Error("NO_API_KEY");
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(`${config.baseUrl}/v1/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.model,
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        temperature: 0.7,
        max_tokens: 4096,
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const err = await res.text();
      throw new Error(`DeepSeek API error ${res.status}: ${err}`);
    }

    const json = await res.json();
    return json.choices[0].message.content;
  } catch (e) {
    if (e instanceof Error) {
      if (e.message === "NO_API_KEY") throw e;
      if (e.name === "AbortError") throw new Error("TIMEOUT");
    }
    throw new Error("AI_ERROR");
  } finally {
    clearTimeout(timeout);
  }
}
