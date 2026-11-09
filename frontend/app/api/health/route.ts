import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "healthy",
    service: "Flowzint AI Interview Assistant",
    environment: process.env.NODE_ENV || "production",
    timestamp: new Date().toISOString(),
  });
}
