import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/cases/:id
export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const found = await prisma.case.findUnique({
    where: { id },
    include: { doctor: true },
  });

  if (!found) {
    return NextResponse.json(
      { success: false, error: "Case not found" },
      { status: 404 }
    );
  }
  return NextResponse.json({ success: true, case: found });
}

// PATCH /api/cases/:id
// body: { status?, confirmedDisease?, doctorNote? }
// This is the doctor-confirm step: confirmedDisease is stored as the
// verified label for future model retraining (the feedback loop).
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { status, confirmedDisease, doctorNote } = body;

    const updated = await prisma.case.update({
      where: { id },
      data: {
        ...(status ? { status } : {}),
        ...(confirmedDisease ? { confirmedDisease } : {}),
        ...(doctorNote !== undefined ? { doctorNote } : {}),
      },
      include: { doctor: true },
    });

    return NextResponse.json({ success: true, case: updated });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ success: false, error: msg }, { status: 500 });
  }
}
