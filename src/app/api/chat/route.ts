import { NextResponse } from "next/server";

import { openai } from "@/lib/openai/client";
import { chatRequestSchema } from "@/server/validation/chat";

export async function POST(request: Request) {
  const body = await request.json();

  const result = chatRequestSchema.safeParse(body);

  if (!result.success) {
    return NextResponse.json(
      { error: "Invalid request body", details: result.error.errors },
      { status: 400 },
    );
  }

  const { document, question } = result.data;

  const completion = await openai.chat.completions.create({
    model: "gpt-4.1-mini",
    messages: [
      {
        role: "system",
        content:
          "You are an assistant that helps answer questions based on the provided document.",
      },
      {
        role: "user",
        content: `Project documentation:\n\n${document}\n\nQuestion:\n\n${question}`,
      },
    ],
  });

  const answer = completion.choices[0].message.content ?? "";

  return NextResponse.json({ answer });
}
