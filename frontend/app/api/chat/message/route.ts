import { NextRequest, NextResponse } from "next/server";
import { verifyToken } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const { session_id, role, content } = await req.json();

    if (!content) {
      return NextResponse.json({ detail: "Message content is required." }, { status: 400 });
    }

    // Generate intelligent AI coach response
    const words = content.toLowerCase();
    let reply = "That is a well-reasoned perspective. How would you explain that trade-off to a non-technical stakeholder or product manager?";
    if (words.includes("scale") || words.includes("database") || words.includes("cache")) {
      reply = "Good system architecture reasoning. Have you considered data consistency during cache invalidation or network partitions?";
    } else if (words.includes("disagree") || words.includes("conflict") || words.includes("team")) {
      reply = "Strong behavioral awareness. Using objective metrics and aligning on shared goals is the best way to resolve technical disagreements.";
    }

    return NextResponse.json({
      id: Math.floor(Math.random() * 100000),
      session_id: session_id || "default",
      role: "assistant",
      content: reply,
      created_at: new Date().toISOString(),
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Chat message failed." }, { status: 500 });
  }
}

