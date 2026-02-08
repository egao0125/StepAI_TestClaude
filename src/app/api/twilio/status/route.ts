import { NextRequest, NextResponse } from "next/server";
import { updateCallSession } from "@/lib/store";

export async function POST(request: NextRequest) {
  const formData = await request.formData();

  const callSid = formData.get("CallSid") as string;
  const callStatus = formData.get("CallStatus") as string;

  if (callSid && callStatus) {
    if (callStatus === "completed" || callStatus === "failed" || callStatus === "busy" || callStatus === "no-answer") {
      updateCallSession(callSid, {
        status: callStatus === "completed" ? "completed" : "failed",
      });
    }
  }

  return NextResponse.json({ received: true });
}
