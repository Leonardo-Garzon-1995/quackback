"use client";
import React, { useState } from "react";
import Image from "next/image";

const mockDuckAI = (input: string): string[] => {
  // This mock AI only responds with questions for clarity, insight, risks, or assumptions
  return [
    "Can you clarify what outcome you're hoping for?",
    "What assumptions are you making about this situation?",
    "Are there any risks you foresee if you proceed?",
    "How might you approach this differently?",
  ];
};

export default function Home() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ user: string; ai: string[] }[]>(
    []
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const aiResponse = mockDuckAI(input);
    setMessages([...messages, { user: input, ai: aiResponse }]);
    setInput("");
  };

  return (
    <main
      style={{ background: "var(--color-bg)", minHeight: "100vh", padding: 24 }}
    >
      <div
        style={{
          maxWidth: 600,
          margin: "0 auto",
          background: "var(--color-surface)",
          borderRadius: 16,
          padding: 32,
          boxShadow: "0 4px 32px #0002",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Image
          src="/DuckTypeLogo.png"
          alt="DuckType Logo"
          width={500}
          height={500}
          style={{ marginBottom: 12 }}
          priority
        />
        
        <p style={{ color: "var(--color-secondary-text)", marginBottom: 24 }}>
          Ask a question or post a comment. The Duck will only respond with
          questions to help you think deeper!
        </p>
        <form
          onSubmit={handleSubmit}
          style={{ display: "flex", gap: 8, marginBottom: 24 }}
        >
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your question or comment..."
            style={{
              flex: 1,
              padding: 12,
              borderRadius: 8,
              border: "none",
              background: "var(--color-bg)",
              color: "var(--color-primary-text)",
            }}
          />
          <button
            type="submit"
            style={{
              background: "var(--color-primary-yellow)",
              color: "#151C2F",
              border: "none",
              borderRadius: 8,
              padding: "0 20px",
              fontWeight: 700,
            }}
          >
            Ask
          </button>
        </form>
        <div>
          {messages.map((msg, idx) => (
            <div key={idx} style={{ marginBottom: 24 }}>
              <div
                style={{
                  color: "var(--color-primary-yellow)",
                  fontWeight: 600,
                  marginBottom: 4,
                }}
              >
                You:
              </div>
              <div
                style={{ color: "var(--color-primary-text)", marginBottom: 8 }}
              >
                {msg.user}
              </div>
              <div
                style={{
                  color: "var(--color-insight-accent)",
                  fontWeight: 500,
                  marginBottom: 4,
                }}
              >
                Duck:
              </div>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                {msg.ai.map((q, i) => (
                  <li
                    key={i}
                    style={{
                      color:
                        i === 2
                          ? "var(--color-warning)"
                          : "var(--color-insight-accent)",
                      marginBottom: 2,
                    }}
                  >
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
