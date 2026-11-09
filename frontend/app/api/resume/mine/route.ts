import { NextRequest, NextResponse } from "next/server";
import { loadDB, verifyToken } from "@/lib/server-db";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const payloadUser = verifyToken(token);
    const userId = payloadUser?.sub || 1;

    const db = loadDB();
    const userResumes = db.resumes
      .filter((r) => r.owner_id === userId || (userId === 1 && !r.owner_id))
      .sort((a, b) => new Date(b.uploaded_at).getTime() - new Date(a.uploaded_at).getTime());

    return NextResponse.json(userResumes);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Failed to fetch resumes." }, { status: 500 });
  }
}

