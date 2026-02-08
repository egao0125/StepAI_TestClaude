import { NextRequest, NextResponse } from "next/server";
import { generateAccessToken } from "@/lib/twilio";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const identity = body.identity || `user-${Date.now()}`;
    const token = generateAccessToken(identity);
    return NextResponse.json({ token, identity });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to generate token";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
