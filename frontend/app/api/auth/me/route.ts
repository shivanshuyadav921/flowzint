import { NextRequest, NextResponse } from "next/server";
import { loadDB, verifyToken } from "@/lib/server-db";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.replace(/^Bearer\s+/i, "");

  if (!token) {
    return NextResponse.json({ detail: "Not authenticated." }, { status: 401 });
  }

  const payload = verifyToken(token);
  if (!payload) {
    return NextResponse.json({ detail: "Invalid or expired token." }, { status: 401 });
  }

  const db = loadDB();
  const user = db.users.find((u) => u.id === payload.sub);

  if (!user) {
    return NextResponse.json({ detail: "User not found." }, { status: 404 });
  }

  return NextResponse.json({
    id: user.id,
    email: user.email,
    full_name: user.full_name,
    role: user.role,
    avatar_url: user.avatar_url,
    created_at: user.created_at,
  });
}
