import { NextRequest, NextResponse } from "next/server";
import { loadDB, saveDB, hashPassword, signToken } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const { email, full_name, avatar_url } = await req.json();

    if (!email) {
      return NextResponse.json({ detail: "Email is required for Google authentication." }, { status: 400 });
    }

    const db = loadDB();
    const cleanEmail = email.toLowerCase();
    let user = db.users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!user) {
      const { salt, hash } = hashPassword("OAuthGoogleSecurePass_" + Math.random().toString(36));
      user = {
        id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
        email: cleanEmail,
        full_name: full_name || cleanEmail.split("@")[0],
        password_hash: hash,
        salt: salt,
        role: "candidate",
        avatar_url: avatar_url || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanEmail)}`,
        created_at: new Date().toISOString(),
      };
      db.users.push(user);
      saveDB();
    } else if (full_name && !user.full_name) {
      user.full_name = full_name;
      saveDB();
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
    return NextResponse.json({ detail: err.message || "Google authentication failed." }, { status: 500 });
  }
}

