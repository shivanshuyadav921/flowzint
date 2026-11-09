import { NextRequest, NextResponse } from "next/server";
import { loadDB, saveDB, hashPassword } from "@/lib/server-db";

export async function POST(req: NextRequest) {
  try {
    const { email, password, full_name } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ detail: "Email and password are required." }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ detail: "Password must be at least 6 characters." }, { status: 400 });
    }

    const db = loadDB();
    const existing = db.users.find((u) => u.email.toLowerCase() === email.toLowerCase());

    if (existing) {
      return NextResponse.json({ detail: "Email already registered." }, { status: 400 });
    }

    const { salt, hash } = hashPassword(password);
    const newUser = {
      id: db.users.length > 0 ? Math.max(...db.users.map((u) => u.id)) + 1 : 1,
      email: email.toLowerCase(),
      full_name: full_name || email.split("@")[0],
      password_hash: hash,
      salt: salt,
      role: "candidate",
      avatar_url: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(email)}`,
      created_at: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDB();

    return NextResponse.json(
      {
        id: newUser.id,
        email: newUser.email,
        full_name: newUser.full_name,
        role: newUser.role,
        avatar_url: newUser.avatar_url,
      },
      { status: 201 }
    );
  } catch (err: any) {
    return NextResponse.json({ detail: err.message || "Signup failed." }, { status: 500 });
  }
}

