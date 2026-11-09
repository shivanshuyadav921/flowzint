import { NextRequest, NextResponse } from "next/server";
import { loadDB, verifyPassword, signToken } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    let email = "";
    let password = "";

    const contentType = req.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const formData = await req.formData();
      email = (formData.get("username") as string) || (formData.get("email") as string) || "";
      password = (formData.get("password") as string) || "";
    } else {
      const body = await req.json();
      email = body.username || body.email || "";
      password = body.password || "";
    }

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    const db = loadDB();
    const user = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (!user || !verifyPassword(password, user.salt, user.password_hash)) {
      return NextResponse.json({ detail: "Incorrect email or password." }, { status: 401 });
    }

    const token = signToken({ sub: user.id, email: user.email, name: user.full_name });

    return NextResponse.json({
      access_token: token,
      token_type: "bearer",
      expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      user: {
        id: user.id,
        email: user.email,
        full_name: user.full_name,
        role: user.role,
        avatar_url: user.avatar_url,
      },
    });
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Login failed." }, { status: 500 });
  }
}
