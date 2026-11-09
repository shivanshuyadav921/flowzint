import { NextRequest, NextResponse } from "next/server";
import { loadDB, saveDB, verifyToken } from "@/lib/server-db";

const DEFAULT_ROLE_QUESTIONS: Record<string, string[]> = {
  "Full Stack / Frontend": [
    "Tell me about a challenging frontend performance or state management issue you solved recently.",
    "How do you approach designing scalable, accessible UI components with Next.js and Tailwind?",
    "Describe a situation where a production bug occurred in your web app. How did you diagnose and remediate it?",
    "How do you optimize Core Web Vitals (LCP, FID, CLS) in Next.js applications?",
  ],
  "Backend & System Design": [
    "How would you design a distributed rate limiter to handle 50,000 requests per second?",
    "Explain how you prevent race conditions and maintain data consistency across microservices.",
    "Tell me about a time you had to optimize slow database queries under heavy production load.",
    "Walk me through your database indexing and partitioning strategy for high-volume transactions.",
  ],
  "Behavioral & Leadership": [
    "Tell me about a time you had a strong disagreement with a technical lead or product manager.",
    "Can you share an example of how you mentored a teammate or resolved a team blocker?",
    "Describe a high-stakes project with tight deadlines. How did you prioritize deliverables?",
    "Tell me about a project that failed or missed expectations. What was your retrospective?",
  ],
};

export async function POST(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const payloadUser = verifyToken(token);
    const userId = payloadUser?.sub || 1;

    const { role = "Full Stack / Frontend", difficulty = "Senior", categories = ["Technical", "System Design"], resume_id } = await req.json();

    const db = loadDB();

    // Check if resume context is requested
    let resumeContext = "";
    if (resume_id) {
      const resume = db.resumes.find((r) => r.id === Number(resume_id));
      if (resume) {
        resumeContext = ` Candidate background: ${resume.skills}`;
      }
    }

    // Role-specific questions
    const pool = DEFAULT_ROLE_QUESTIONS[role] || DEFAULT_ROLE_QUESTIONS["Full Stack / Frontend"];
    const formattedQuestions = pool.map((q, idx) => `${idx + 1}. ${q}`).join("\n");

    const newSession = {
      id: db.interviews.length > 0 ? Math.max(...db.interviews.map((i) => i.id)) + 1 : 1,
      owner_id: userId,
      title: `${role} practice — ${difficulty}`,
      role: role,
      difficulty: difficulty,
      category: Array.isArray(categories) ? categories.join(", ") : String(categories),
      questions: formattedQuestions,
      answers: "",
      feedback: "",
      score: 85,
      created_at: new Date().toISOString(),
    };

    db.interviews.unshift(newSession);
    saveDB();

    return NextResponse.json(newSession, { status: 201 });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Failed to generate interview." }, { status: 500 });
  }
}

