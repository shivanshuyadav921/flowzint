import { NextRequest, NextResponse } from "next/server";
import { loadDB, verifyToken } from "@/lib/server-db";

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace(/^Bearer\s+/i, "");
    const payloadUser = verifyToken(token);
    const userId = payloadUser?.sub || 1;

    const db = loadDB();
    const userInterviews = db.interviews
      .filter((i) => i.owner_id === userId || (userId === 1 && !i.owner_id))
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

    return NextResponse.json(userInterviews);
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Failed to fetch interview history." }, { status: 500 });
  }
}
