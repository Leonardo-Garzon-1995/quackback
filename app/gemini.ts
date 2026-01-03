// gemini.ts
// Handles communication with the Gemini AI API

export interface GeminiMessage {
  role: "user" | "model";
  parts: { text: string }[];
}

export async function askGemini(
  conversation: GeminiMessage[]
): Promise<string[]> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ conversation }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.questions || [];
}

export async function generateTitle(text: string): Promise<string | null> {
  try {
    const res = await fetch("/api/gemini/title", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.title && typeof data.title === "string") return data.title;
    return null;
  } catch (e) {
    return null;
  }
}

export async function getStarterPrompts(context?: { recentConversations?: Array<{ title?: string; lastMessage?: string }> }): Promise<string[]> {
  try {
    const res = await fetch("/api/gemini/prompts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(context || {}),
    });
    if (!res.ok) return [];
    const data = await res.json();
    return Array.isArray(data?.prompts) ? data.prompts : [];
  } catch (e) {
    return [];
  }
}
