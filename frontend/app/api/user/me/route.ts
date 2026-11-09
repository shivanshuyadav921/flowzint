import { NextRequest, NextResponse } from "next/server";
import { GET as getAuthMe } from "@/app/api/auth/me/route";

export async function GET(req: NextRequest) {
  return getAuthMe(req);
}

