import { NextResponse } from "next/server";
import { loadDB, signToken } from "@/lib/server-db";

export async function POST() {
  const db = loadDB();
  const demoUser = db.users.find((u) => u.email === "demo@flowzint.com") || db.users[0];

  const token = signToken({
    sub: demoUser.id,
    email: demoUser.email,
    name: demoUser.full_name,
  });

  return NextResponse.json({
    access_token: token,
    token_type: "bearer",
    expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    user: {
      id: demoUser.id,
      email: demoUser.email,
      full_name: demoUser.full_name,
      role: demoUser.role,
      avatar_url: demoUser.avatar_url,
    },
  });
}
