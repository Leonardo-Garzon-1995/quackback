import { NextResponse } from "next/server";

const endpoint =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    const body = {
      systemInstruction: {
        parts: [
          {
            text:
              "You are Rubber Duck AI. Provide a short list (3–6) of concise starter prompts (3–10 words each) that a user could ask to start a helpful conversation. Return ONLY valid JSON that matches the schema. No preamble, no markdown.",
          },
        ],
      },
      contents: [{ role: "user", parts: [{ text: "Provide starter prompts" }] }],
      generationConfig: {
        max_output_tokens: 128,
        temperature: 0.2,
        response_mime_type: "application/json",
        response_json_schema: {
          type: "object",
          properties: {
            prompts: {
              type: "array",
              items: { type: "string" },
              minItems: 1,
              maxItems: 6,
            },
          },
          required: ["prompts"],
        },
      },
    };

    const res = await fetch(`${endpoint}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errText = await res.text().catch(() => "");
      return NextResponse.json({ error: `Gemini API error: ${res.status}`, details: errText }, { status: res.status });
    }

    const data = await res.json();
    const text = data?.candidates?.[0]?.content?.parts?.[0]?.text ?? "";

    // Try extracting JSON defensively
    let parsed: any = null;
    try {
      const start = text.indexOf("{");
      const end = text.lastIndexOf("}");
      if (start !== -1 && end !== -1 && end > start) {
        parsed = JSON.parse(text.slice(start, end + 1));
      }
    } catch (e) {
      // ignore
    }

    const prompts = Array.isArray(parsed?.prompts) ? parsed.prompts : [];

    if (prompts.length) return NextResponse.json({ prompts });

    // Fallback suggestions
    const fallback = [
      "What's the main challenge I'm facing?",
      "How can I improve this idea?",
      "What am I missing in my approach?",
    ];

    return NextResponse.json({ prompts: fallback });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message ?? "Unknown error" }, { status: 500 });
  }
}
