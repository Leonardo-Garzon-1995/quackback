// gemini.ts
// Handles communication with the Gemini AI API

export async function askGemini(prompt: string): Promise<string[]> {
  const res = await fetch("/api/gemini", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ prompt }),
  });

  if (!res.ok) {
    throw new Error(`Gemini API error: ${res.status}`);
  }

  const data = await res.json();
  return data.questions || [];
}
