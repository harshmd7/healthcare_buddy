import { NextResponse } from "next/server";
import { getAuthenticatedDoctor } from "@/lib/doctor-auth";

export async function GET() {
  const doctor = await getAuthenticatedDoctor();

  if (!doctor) {
    return NextResponse.json(
      { success: false, error: "No doctor profile is linked to this account." },
      { status: 403 }
    );
  }

  return NextResponse.json({ success: true, doctor });
}