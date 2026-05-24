"use client";

import { useState } from "react";

import type { ChatResponse } from "@/types/chat";

export function ChatPanel() {
  const [document, setDocument] = useState("");
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setIsLoading(true);
    setError("");
    setAnswer("");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ document, question }),
      });
      const data = (await response.json()) as ChatResponse;

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong");
      }

      setAnswer(data.answer);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error";
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <section className="mx-auto flex max-w-3xl flex-col gap-6 p-8">
      <div>
        <h1 className="text-3xl font-bold">
          AI Client Documentation Assistant
        </h1>
        <p className="mt-2 text-gray-600">
          Paste project context, ask a question, and get an AI-generated answer.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label className="flex flex-col gap-2">
          <span className="font-medium">Project Documentation</span>
          <textarea
            value={document}
            onChange={(event) => setDocument(event.target.value)}
            className="min-h-40 rounded border p-3"
            placeholder="Paste client/project documentation here..."
          />
        </label>

        <label className="flex flex-col gap-2">
          <span className="font-medium">Question</span>
          <input
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            className="rounded border p-3"
            placeholder="What does this project need?"
          />
        </label>

        <button
          type="submit"
          disabled={isLoading || !document.trim() || !question.trim()}
          className="rounded bg-black px-4 py-3 text-white disabled:opacity-50"
        >
          {isLoading ? "Thinking..." : "Ask AI"}
        </button>
      </form>

      {answer && (
        <div className="rounded border p-4">
          <h2 className="font-semibold">Answer</h2>
          <p className="mt-2 whitespace-pre-wrap">{answer}</p>
        </div>
      )}
      {error && (
        <div className="rounded border border-red-300 p-4">
          <p>{error}</p>
        </div>
      )}
    </section>
  );
}
